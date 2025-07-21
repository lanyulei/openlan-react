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

const apiVersion = 'triggers.tekton.dev/v1alpha1';
const clusterInterceptorsName = 'clusterinterceptors';
const initClusterInterceptorData = `apiVersion: ${apiVersion}
kind: ClusterInterceptor
metadata:
  name: example-cluster-interceptor
spec:
  clientConfig:
    service:
      name: tekton-triggers-core-interceptors
      namespace: tekton-pipelines
      path: /headers  # 使用内置的 header 拦截器
`;

const ClusterInterceptor: FC = () => {
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
  const [clusterInterceptorData, setClusterInterceptorData] = React.useState<any>();

  const handleReload = async () => {
    await actionRef?.current?.reload();
  };

  const getList = async () => {
    let res = {};
    if (query.namespace && query.namespace !== '') {
      res = await resourceListByNamespace(
        clusterInterceptorsName,
        query.namespace,
        query,
        {},
        apiVersion,
      );
    } else {
      res = await resourceList(clusterInterceptorsName, query, {}, apiVersion);
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
      <PageContainer content="集群拦截器（ClusterInterceptor）是用于在触发事件到达 Trigger 之前拦截、验证或修改事件数据（如 HTTP 请求负载），以确保其符合预期格式或安全要求。">
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
                    setClusterInterceptorData(record);
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
                      content: '确定是否删除此集群拦截器？',
                      okText: '确认',
                      cancelText: '取消',
                      onOk: async () => {
                        await deleteClusterResource(
                          clusterInterceptorsName,
                          record.metadata?.name,
                          {},
                          apiVersion,
                        );
                        await handleReload();
                        messageApi.success('集群拦截器删除成功');
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
                setClusterInterceptorData(initClusterInterceptorData);
                setDrawerOpen(true);
              }}
              key="addClusterInterceptor"
              type="primary"
              icon={<PlusOutlined />}
            >
              新建集群拦截器
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
        title={drawerStatus === 'create' ? '新建集群拦截器' : '编辑集群拦截器'}
        autoFocusFirstInput
        drawerProps={{
          destroyOnHidden: true,
        }}
        onFinish={async () => {
          const clusterInterceptorDetails = yamlToJson(clusterInterceptorData);
          if (drawerStatus === 'create') {
            await createClusterResource(
              clusterInterceptorsName,
              clusterInterceptorDetails,
              {},
              apiVersion,
            );
            messageApi.success('集群拦截器创建成功');
          } else if (drawerStatus === 'edit') {
            await updateClusterResource(
              clusterInterceptorsName,
              clusterInterceptorDetails.metadata?.name,
              clusterInterceptorDetails,
              {},
              apiVersion,
            );
            messageApi.success('集群拦截器更新成功');
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
          value={jsonToYaml(clusterInterceptorData) || ''}
          onChange={(value: string) => {
            setClusterInterceptorData(value);
          }}
        />
      </DrawerForm>
    </>
  );
};

export default ClusterInterceptor;
