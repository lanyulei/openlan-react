import React, { FC, useRef } from 'react';
import { ActionType, PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Input } from 'antd';
import { EditOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import styles from '@/pages/Resource/Cloud/Account/index.less';
import { getLogicResourceList } from '@/services/resource/logicResource';
import { useNavigate } from 'react-router-dom';

const Task: FC = () => {
  const navigate = useNavigate();
  const actionRef = useRef<ActionType>();
  const [query, setQuery] = React.useState({
    name: '',
  });

  const handleReload = async () => {
    await actionRef?.current?.reload();
  };

  return (
    <>
      <PageContainer content="Task 是一个定义单次容器化操作（如构建、测试或部署）的可复用工作单元，包含一个或多个按顺序执行的步骤">
        <ProTable
          className={styles.tableList}
          columns={[
            {
              title: '名称',
              dataIndex: 'name',
              key: 'name',
              ellipsis: true,
            },
            {
              title: '命名空间',
              dataIndex: 'namespace',
              key: 'namespace',
            },
            {
              title: '步骤数量',
              dataIndex: 'stepCount',
              key: 'stepCount',
            },
            {
              title: '参数数量',
              dataIndex: 'paramCount',
              key: 'paramCount',
              ellipsis: true,
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
                    navigate(`/resource/cloud/logic-resource-details/${record.id}`);
                  }}
                >
                  <EditOutlined /> 编辑
                </a>,
              ],
            },
          ]}
          actionRef={actionRef}
          request={async () => {
            const _res = await getLogicResourceList(
              {
                not_page: true,
              },
              {},
            );
            return {
              data: _res.data?.list || [],
              success: true,
              total: _res.data?.total || 0,
            };
          }}
          rowKey="id"
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
              value={query.name}
              onChange={(e) => setQuery({ ...query, name: e.target.value })}
              onPressEnter={handleReload}
              suffix={<SearchOutlined />}
            />,
          ]}
          search={false}
          options={{
            reload: false,
          }}
        />
      </PageContainer>
    </>
  );
};

export default Task;
