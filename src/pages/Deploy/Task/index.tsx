import React, { FC, useEffect, useRef } from 'react';
import { ActionType, PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Input, message, Modal, Select } from 'antd';
import { EditOutlined, PlusOutlined, RightSquareOutlined, SearchOutlined } from '@ant-design/icons';
import styles from '@/pages/Resource/Cloud/Account/index.less';
import { useNavigate } from 'react-router-dom';
import { getNamespaces } from '@/services/deploy/namespace';
import { createResource, resourceList, resourceListByNamespace } from '@/services/deploy/tekton';

const tasksName = 'tasks';
const taskRunsName = 'taskruns';

const Task: FC = () => {
  const navigate = useNavigate();
  const [modal, modalContextHolder] = Modal.useModal();
  const [messageApi, messageContextHolder] = message.useMessage();
  const actionRef = useRef<ActionType>();
  const [query, setQuery] = React.useState<any>({
    name: undefined,
    namespace: undefined,
  });
  const [namespaceList, setNamespaceList] = React.useState<string[]>([]);

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
              width: 150,
              render: (_: any, record: any) => [
                <a
                  key="run"
                  onClick={() => {
                    modal.confirm({
                      title: '提示',
                      content: '确定是否需要运行此任务？',
                      okText: '确认',
                      cancelText: '取消',
                      onOk: async () => {
                        let _params = {
                          apiVersion: 'tekton.dev/v1',
                          kind: 'TaskRun',
                          metadata: {
                            name: record.metadata?.name + '-run-' + new Date().getTime(),
                            namespace: record.metadata?.namespace,
                          },
                          spec: {
                            taskRef: {
                              name: record.metadata?.name,
                            },
                          },
                        };

                        await createResource(taskRunsName, record.metadata?.namespace, _params, {});
                        messageApi.success('已执行此任务');
                        return true;
                      },
                    });
                  }}
                >
                  <RightSquareOutlined /> 执行
                </a>,
                <a
                  style={{ marginLeft: 10 }}
                  key="edit"
                  onClick={() => {
                    navigate(
                      `/deploy/task/edit/${record.metadata?.namespace}/${record.metadata?.name}`,
                    );
                  }}
                >
                  <EditOutlined /> 编辑
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
                navigate('/deploy/task/create');
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
    </>
  );
};

export default Task;
