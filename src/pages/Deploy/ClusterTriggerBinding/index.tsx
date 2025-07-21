import React, { FC, useEffect, useRef } from 'react';
import { ActionType, DrawerForm, PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Input, message, Modal, Select } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import styles from '@/pages/Resource/Cloud/Account/index.less';
import { getNamespaces } from '@/services/deploy/namespace';
import {
  createClusterResource,
  deleteClusterResource,
  resourceList,
  resourceListByNamespace,
  updateClusterResource,
} from '@/services/deploy/tekton';
import MonacoEditor from '@/components/MonacoEditor';
import { jsonToYaml, yamlToJson } from '@/utils/tools/tools';

const apiVersion = 'triggers.tekton.dev/v1beta1';
const clusterTriggerBindingsName = 'clustertriggerbindings';
const initClusterTriggerBindingData = `apiVersion: ${apiVersion}
kind: ClusterTriggerBinding
metadata:
  name: example-cluster-trigger-binding
spec:
  params:
    - name: env
      value: "dev"  # 直接定义集群级静态参数
`;

const ClusterTriggerBinding: FC = () => {
  // const navigate = useNavigate();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();
  const [query, setQuery] = React.useState<any>({
    name: undefined,
    namespace: undefined,
  });
  const actionRef = useRef<ActionType>();
  const [namespaceList, setNamespaceList] = React.useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = React.useState<boolean>(false);
  const [drawerStatus, setDrawerStatus] = React.useState<'create' | 'edit'>('create');
  const [clusterTriggerBindingData, setClusterTriggerBindingData] = React.useState<any>();

  const handleReload = async () => {
    await actionRef?.current?.reload();
  };

  const getList = async () => {
    let res = {};
    if (query.namespace && query.namespace !== '') {
      res = await resourceListByNamespace(
        clusterTriggerBindingsName,
        query.namespace,
        query,
        {},
        apiVersion,
      );
    } else {
      res = await resourceList(clusterTriggerBindingsName, query, {}, apiVersion);
    }

    // @ts-ignore
    return (res.data?.items || []).reverse();
  };

  useEffect(() => {
    (async () => {
      const nsRes = await getNamespaces({}, {});
      setNamespaceList(nsRes.data?.items || []);
    })();
  }, []);

  return (
    <>
      {modalContextHolder}
      {messageContextHolder}
      <PageContainer content="ClusterTriggerBinding 是 Tekton Triggers 中的一个集群级资源，用于定义如何将外部事件（如 Webhook 请求）的参数映射到 Trigger 的输入参数，以便动态触发流水线或任务的执行。">
        <ProTable
          className={styles.tableList}
          columns={[
            {
              title: '名称',
              dataIndex: ['metadata', 'name'],
              key: 'metadata.name',
              ellipsis: true,
            },
            {
              title: '创建时间',
              dataIndex: ['metadata', 'creationTimestamp'],
              key: 'metadata.creationTimestamp',
              valueType: 'dateTime',
            },
            {
              title: '操作',
              dataIndex: 'option',
              valueType: 'option',
              key: 'option',
              align: 'center' as const,
              width: 150,
              render: (_: any, record: any) => [
                <a
                  style={{ marginLeft: 10 }}
                  key="edit"
                  onClick={() => {
                    // navigate(
                    //   `/deploy/task/edit/${record.metadata?.namespace}/${record.metadata?.name}`,
                    // );
                    setDrawerStatus('edit');
                    delete record.metadata?.managedFields;
                    setClusterTriggerBindingData(record);
                    setDrawerOpen(true);
                  }}
                >
                  <EditOutlined /> 编辑
                </a>,
                <a
                  style={{ marginLeft: 10 }}
                  key="delete"
                  onClick={() => {
                    modal.confirm({
                      title: '提示',
                      content: '确定是否删除此集群触发器绑定？',
                      okText: '确认',
                      cancelText: '取消',
                      onOk: async () => {
                        await deleteClusterResource(
                          clusterTriggerBindingsName,
                          record.metadata?.name,
                          {},
                          apiVersion,
                        );
                        await handleReload();
                        messageApi.success('集群触发器绑定删除成功');
                        return true;
                      },
                    });
                  }}
                >
                  <DeleteOutlined /> 删除
                </a>,
              ],
            },
          ]}
          actionRef={actionRef}
          request={async () => {
            const _res = await getList();
            return {
              data: _res || [],
              success: true,
              total: _res?.length || 0,
            };
          }}
          rowKey={(record) => record.metadata?.name}
          pagination={false}
          bordered
          toolBarRender={() => [
            <Button
              onClick={() => {
                // navigate('/deploy/task/create');
                setDrawerStatus('create');
                setClusterTriggerBindingData(initClusterTriggerBindingData);
                setDrawerOpen(true);
              }}
              key="addClusterTriggerBinding"
              type="primary"
              icon={<PlusOutlined />}
            >
              新建集群触发器绑定
            </Button>,
            <Input
              key="search"
              placeholder="请输入名称"
              allowClear
              style={{ width: 260 }}
              onChange={(e) => {
                if (e.target.value === '') {
                  setQuery({ ...query, fieldSelector: undefined });
                } else {
                  setQuery({ ...query, fieldSelector: 'metadata.name=' + e.target.value });
                }
              }}
              onPressEnter={handleReload}
              suffix={<SearchOutlined />}
            />,
            <Select
              key="namespace"
              style={{ width: 200 }}
              allowClear
              value={query.namespace}
              options={namespaceList.map((ns) => ({
                // @ts-ignore
                label: ns.metadata.name,
                // @ts-ignore
                value: ns.metadata.name,
              }))}
              placeholder="请选择命名空间"
              onChange={(value) => {
                setQuery({ ...query, namespace: value });
                setTimeout(async () => {
                  await handleReload();
                });
              }}
            />,
          ]}
          search={false}
        />
      </PageContainer>

      <DrawerForm
        title={drawerStatus === 'create' ? '新建集群触发器绑定' : '编辑集群触发器绑定'}
        autoFocusFirstInput
        drawerProps={{
          destroyOnHidden: true,
        }}
        onFinish={async () => {
          const clusterTriggerBindingDetails = yamlToJson(clusterTriggerBindingData);
          if (drawerStatus === 'create') {
            await createClusterResource(
              clusterTriggerBindingsName,
              clusterTriggerBindingDetails,
              {},
              apiVersion,
            );
            messageApi.success('集群触发器绑定创建成功');
          } else if (drawerStatus === 'edit') {
            await updateClusterResource(
              clusterTriggerBindingsName,
              clusterTriggerBindingDetails.metadata?.name,
              clusterTriggerBindingDetails,
              {},
              apiVersion,
            );
            messageApi.success('集群触发器绑定更新成功');
          }
          await handleReload();
          return true;
        }}
        width={800}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        submitter={{
          searchConfig: { submitText: '保存', resetText: '取消' },
        }}
      >
        <MonacoEditor
          codeType="yaml"
          value={jsonToYaml(clusterTriggerBindingData) || ''}
          onChange={(value: string) => {
            setClusterTriggerBindingData(value);
          }}
        />
      </DrawerForm>
    </>
  );
};

export default ClusterTriggerBinding;
