import React, { FC, useEffect, useRef } from 'react';
import { ActionType, DrawerForm, PageContainer, ProTable } from '@ant-design/pro-components';
import { Alert, Button, Input, message, Modal, Select, Spin } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  RightSquareOutlined,
  SearchOutlined,
} from '@ant-design/icons';
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
import { invoke } from '@/services/openlei/chat';
import tektonTaskPrompt from '@/pages/Deploy/Task/components/variable';

const tasksName = 'tasks';
const taskRunsName = 'taskruns';
const initTaskData = `apiVersion: tekton.dev/v1
kind: Task
metadata:
  name: demo-task
  namespace: default
spec:
  steps:
    - computeResources: {}
      image: alpine
      name: echo-lanyulei
      script: |
        #!/bin/sh
        echo "Hello, lanyulei!"
`;

const Task: FC = () => {
  // const navigate = useNavigate();
  const [modal, modalContextHolder] = Modal.useModal();
  const [messageApi, messageContextHolder] = message.useMessage();
  const actionRef = useRef<ActionType>();
  const [query, setQuery] = React.useState<any>({
    name: undefined,
    namespace: undefined,
  });
  const [namespaceList, setNamespaceList] = React.useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = React.useState<boolean>(false);
  const [execDrawerOpen, setExecDrawerOpen] = React.useState<boolean>(false);
  const [drawerStatus, setDrawerStatus] = React.useState<'create' | 'edit'>('create');
  const [taskData, setTaskData] = React.useState<any>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [taskRunData, setTaskRunData] = React.useState<any>();

  const handleReload = async () => {
    await actionRef?.current?.reload();
  };

  const getList = async () => {
    let res = {};
    if (query.namespace && query.namespace !== '') {
      res = await resourceListByNamespace(tasksName, query.namespace, query, {});
    } else {
      res = await resourceList(tasksName, query, {});
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
      <PageContainer content="任务（Task）是一个定义单次容器化操作（如构建、测试或部署）的可复用工作单元，包含一个或多个按顺序执行的步骤。">
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
              width: 200,
              render: (_: any, record: any) => [
                <a
                  key="run"
                  onClick={async () => {
                    setLoading(true);
                    setExecDrawerOpen(true);
                    let jsonValue = JSON.parse(JSON.stringify(record));
                    delete jsonValue?.metadata?.managedFields;
                    const prompt = tektonTaskPrompt(
                      record.metadata.name,
                      jsonToYaml(jsonValue),
                      record.metadata?.name + '-run-' + new Date().getTime(),
                      record.metadata?.namespace,
                    );
                    const res = await invoke(
                      {
                        query: prompt,
                      },
                      {},
                    );
                    setTaskRunData(res?.data || '');
                    setLoading(false);
                  }}
                >
                  <RightSquareOutlined /> 执行
                </a>,
                <a
                  style={{ marginLeft: 10 }}
                  key="edit"
                  onClick={() => {
                    // navigate(
                    //   `/deploy/task/edit/${record.metadata?.namespace}/${record.metadata?.name}`,
                    // );
                    setDrawerStatus('edit');
                    delete record.metadata?.managedFields;
                    setTaskData(record);
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
                      content: '确定是否删除此任务？',
                      okText: '确认',
                      cancelText: '取消',
                      onOk: async () => {
                        await deleteResource(
                          tasksName,
                          record.metadata?.name,
                          record.metadata?.namespace,
                          {},
                        );
                        await handleReload();
                        messageApi.success('任务删除成功');
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
                setTaskData(initTaskData);
                setDrawerOpen(true);
              }}
              key="addTask"
              type="primary"
              icon={<PlusOutlined />}
            >
              新建任务
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
        title={drawerStatus === 'create' ? '新建任务' : '编辑任务'}
        autoFocusFirstInput
        drawerProps={{
          destroyOnHidden: true,
        }}
        onFinish={async () => {
          const taskDetails = yamlToJson(taskData);
          if (drawerStatus === 'create') {
            await createResource(tasksName, taskDetails.metadata?.namespace, taskDetails, {});
            messageApi.success('任务创建成功');
          } else if (drawerStatus === 'edit') {
            await updateResource(
              tasksName,
              taskDetails.metadata?.name,
              taskDetails.metadata?.namespace,
              taskDetails,
              {},
            );
            messageApi.success('任务更新成功');
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
          value={jsonToYaml(taskData) || ''}
          onChange={(value: string) => {
            setTaskData(value);
          }}
        />
      </DrawerForm>

      <DrawerForm
        title="执行任务"
        autoFocusFirstInput
        drawerProps={{
          destroyOnHidden: true,
        }}
        onFinish={async () => {
          let _params = yamlToJson(taskRunData);
          await createResource(
            taskRunsName,
            _params?.metadata?.namespace,
            yamlToJson(taskRunData),
            {},
          );
          messageApi.success('任务执行成功');
          return true;
        }}
        width={800}
        open={execDrawerOpen}
        onOpenChange={setExecDrawerOpen}
        submitter={{
          searchConfig: { submitText: '执行', resetText: '取消' },
        }}
      >
        <Alert
          message="下面的 YAML 内容，是根据当前 Task 的 YAML 自动生成，请根据实际情况进行调整。"
          type="info"
          style={{ marginBottom: 15 }}
        />
        <Spin spinning={loading}>
          <MonacoEditor
            codeType="yaml"
            value={taskRunData || ''}
            onChange={(value: string) => {
              setTaskRunData(value);
            }}
          />
        </Spin>
      </DrawerForm>
    </>
  );
};

export default Task;
