import React, { FC, useEffect, useRef } from 'react';
import { ActionType, PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Input, Select } from 'antd';
import { EditOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import styles from '@/pages/Resource/Cloud/Account/index.less';
import { useNavigate } from 'react-router-dom';
import { getNamespaces } from '@/services/deploy/namespace';
import { taskList, taskListByNamespace } from '@/services/deploy/tasks';

const Task: FC = () => {
  const navigate = useNavigate();
  const actionRef = useRef<ActionType>();
  const [query, setQuery] = React.useState<any>({
    name: undefined,
    namespace: undefined,
  });
  const [namespaceList, setNamespaceList] = React.useState<string[]>([]);

  const handleReload = async () => {
    console.log(query);
    await actionRef?.current?.reload();
  };

  const getList = async () => {
    let res = {};
    if (query.namespace && query.namespace !== '') {
      res = await taskListByNamespace(query.namespace, query, {});
    } else {
      res = await taskList(query, {});
    }

    // @ts-ignore
    return res.data?.items || [];
  };

  useEffect(() => {
    (async () => {
      const nsRes = await getNamespaces({}, {});
      setNamespaceList(nsRes.data?.items || []);

      await getList();
    })();
  }, []);

  return (
    <>
      <PageContainer content="Task 是一个定义单次容器化操作（如构建、测试或部署）的可复用工作单元，包含一个或多个按顺序执行的步骤。">
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
              title: '操作',
              dataIndex: 'option',
              valueType: 'option',
              key: 'option',
              align: 'center' as const,
              width: 150,
              render: (_: any, record: any) => [
                <a
                  key="details"
                  onClick={() => {
                    navigate(`/resource/cloud/logic-resource-details/${record.id}`);
                  }}
                >
                  <EyeOutlined /> 详情
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
              style={{ width: 300 }}
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
              style={{ width: 220 }}
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
