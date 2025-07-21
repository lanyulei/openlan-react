import React, { FC, useEffect, useRef } from 'react';
import { ActionType, DrawerForm, PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Input, message, Modal, Select } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import styles from '@/pages/Resource/Cloud/Account/index.less';
import { getNamespaces } from '@/services/deploy/namespace';
import {
  createResource,
  deleteResource,
  resourceList,
  resourceListByNamespace,
  updateResource,
} from '@/services/deploy/tekton';
import MonacoEditor from '@/components/MonacoEditor';
import { jsonToYaml, yamlToJson } from '@/utils/tools/tools';

const apiVersion = 'triggers.tekton.dev/v1beta1';
const eventListenersName = 'eventlisteners';
const initEventListenerData = `apiVersion: ${apiVersion}
kind: EventListener
metadata:
  name: example-event-listener
  namespace: default
spec:
  serviceAccountName: default  # 使用默认的ServiceAccount
  triggers:
    - name: example-trigger
      template:
        ref: example-trigger-template  # 需要提前创建对应的TriggerTemplate
`;

const EventListener: FC = () => {
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
  const [eventListenerData, setEventListenerData] = React.useState<any>();

  const handleReload = async () => {
    await actionRef?.current?.reload();
  };

  const getList = async () => {
    let res = {};
    if (query.namespace && query.namespace !== '') {
      res = await resourceListByNamespace(
        eventListenersName,
        query.namespace,
        query,
        {},
        apiVersion,
      );
    } else {
      res = await resourceList(eventListenersName, query, {}, apiVersion);
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
      <PageContainer content="EventListener（事件监听器）是用于接收外部事件（如 Git Webhook）并触发指定 PipelineRun 或 TaskRun 的组件。">
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
              title: '命名空间',
              dataIndex: ['metadata', 'namespace'],
              key: 'metadata.namespace',
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
                    setEventListenerData(record);
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
                      content: '确定是否删除此事件监听器？',
                      okText: '确认',
                      cancelText: '取消',
                      onOk: async () => {
                        await deleteResource(
                          eventListenersName,
                          record.metadata?.name,
                          record.metadata?.namespace,
                          {},
                          apiVersion,
                        );
                        await handleReload();
                        messageApi.success('事件监听器删除成功');
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
                setEventListenerData(initEventListenerData);
                setDrawerOpen(true);
              }}
              key="addEventListener"
              type="primary"
              icon={<PlusOutlined />}
            >
              新建事件监听器
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
        title={drawerStatus === 'create' ? '新建事件监听器' : '编辑事件监听器'}
        autoFocusFirstInput
        drawerProps={{
          destroyOnHidden: true,
        }}
        onFinish={async () => {
          const eventListenerDetails = yamlToJson(eventListenerData);
          if (drawerStatus === 'create') {
            await createResource(
              eventListenersName,
              eventListenerDetails.metadata?.namespace,
              eventListenerDetails,
              {},
              apiVersion,
            );
            messageApi.success('事件监听器创建成功');
          } else if (drawerStatus === 'edit') {
            await updateResource(
              eventListenersName,
              eventListenerDetails.metadata?.name,
              eventListenerDetails.metadata?.namespace,
              eventListenerDetails,
              {},
              apiVersion,
            );
            messageApi.success('事件监听器更新成功');
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
          value={jsonToYaml(eventListenerData) || ''}
          onChange={(value: string) => {
            setEventListenerData(value);
          }}
        />
      </DrawerForm>
    </>
  );
};

export default EventListener;
