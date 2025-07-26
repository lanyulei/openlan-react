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

const apiVersion = 'tekton.dev/v1beta1';
const stepActionsName = 'stepactions';
const initStepActionData = `apiVersion: ${apiVersion}
kind: StepAction
metadata:
  name: example-step-action
  namespace: default
spec:
  image: alpine
  command: ["echo"]
  args: ["Hello from StepAction!"]
`;

const Template: FC = () => {
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
  const [stepActionData, setStepActionData] = React.useState<any>();

  const handleReload = async () => {
    await actionRef?.current?.reload();
  };

  const getList = async () => {
    let res = {};
    if (query.namespace && query.namespace !== '') {
      res = await resourceListByNamespace(stepActionsName, query.namespace, query, {}, apiVersion);
    } else {
      res = await resourceList(stepActionsName, query, {}, apiVersion);
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
      <PageContainer content="任务模板是通过 Playbook（YAML 格式）定义自动化流程，或使用 shell/bash 模块执行命令行任务，实现配置管理和批量操作。">
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
                    setStepActionData(record);
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
                      content: '确定是否删除此步骤动作？',
                      okText: '确认',
                      cancelText: '取消',
                      onOk: async () => {
                        await deleteResource(
                          stepActionsName,
                          record.metadata?.name,
                          record.metadata?.namespace,
                          {},
                          apiVersion,
                        );
                        await handleReload();
                        messageApi.success('步骤动作删除成功');
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
                setStepActionData(initStepActionData);
                setDrawerOpen(true);
              }}
              key="addStepAction"
              type="primary"
              icon={<PlusOutlined />}
            >
              新建步骤动作
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
        title={drawerStatus === 'create' ? '新建步骤动作' : '编辑步骤动作'}
        autoFocusFirstInput
        drawerProps={{
          destroyOnHidden: true,
        }}
        onFinish={async () => {
          const stepActionDetails = yamlToJson(stepActionData);
          if (drawerStatus === 'create') {
            await createResource(
              stepActionsName,
              stepActionDetails.metadata?.namespace,
              stepActionDetails,
              {},
              apiVersion,
            );
            messageApi.success('步骤动作创建成功');
          } else if (drawerStatus === 'edit') {
            await updateResource(
              stepActionsName,
              stepActionDetails.metadata?.name,
              stepActionDetails.metadata?.namespace,
              stepActionDetails,
              {},
              apiVersion,
            );
            messageApi.success('步骤动作更新成功');
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
          value={jsonToYaml(stepActionData) || ''}
          onChange={(value: string) => {
            setStepActionData(value);
          }}
        />
      </DrawerForm>
    </>
  );
};

export default Template;
