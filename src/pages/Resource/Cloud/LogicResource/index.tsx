import React, { FC, useRef } from 'react';
import { ActionType, PageContainer, ProTable } from '@ant-design/pro-components';
import styles from '@/pages/Resource/Cloud/Account/index.less';
import { Input } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { getLogicResourceList } from '@/services/resource/logicResource';
import { useNavigate } from 'react-router-dom';

const LogicResource: FC = () => {
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
      <PageContainer content="运管平台通过将逻辑资源映射到不同云厂商的具体产品，实现了多云环境的统一抽象和标准化操作，有效屏蔽底层差异，简化资源管理和调度流程。">
        <ProTable
          className={styles.tableList}
          columns={[
            {
              title: 'ID',
              dataIndex: 'id',
              key: 'id',
              ellipsis: true,
            },
            {
              title: '标题',
              dataIndex: 'title',
              key: 'title',
            },
            {
              title: '名称',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '描述',
              dataIndex: 'remarks',
              key: 'remarks',
              ellipsis: true,
            },
            {
              title: '创建时间',
              dataIndex: 'create_time',
              key: 'create_time',
              valueType: 'dateTime',
              width: '160px',
            },
            {
              title: '更新时间',
              dataIndex: 'update_time',
              key: 'update_time',
              valueType: 'dateTime',
              width: '160px',
            },
            {
              title: '操作',
              dataIndex: 'option',
              valueType: 'option',
              key: 'option',
              align: 'center' as const,
              width: 120,
              render: (_: any, record: any) => (
                <a
                  key="edit"
                  onClick={() => {
                    navigate(`/resource/cloud/logic-resource-details/${record.id}`);
                  }}
                >
                  <EyeOutlined /> 详情
                </a>
              ),
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

export default LogicResource;
