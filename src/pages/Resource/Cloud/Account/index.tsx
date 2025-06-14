import React, { FC, useRef } from 'react';
import { ProTable, ActionType, PageContainer } from '@ant-design/pro-components';
import { Button, Input } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import styles from './index.less';

const Account: FC = () => {
  const actionRef = useRef<ActionType>();
  const searchInputRef = useRef(null);

  const handleCreate = () => {};

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      search: false,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: () => [
        <a key="details" onClick={() => {}}>
          详情
        </a>,
        <a style={{ marginLeft: '12px' }} key="edit" onClick={() => {}}>
          编辑
        </a>,
      ],
    },
  ];

  // 搜索功能（可根据实际接口调整）
  const handleSearch = () => {
    actionRef.current?.reload();
  };

  return (
    <>
      <PageContainer content="云账号管理用于集中管理各类云服务账号，提供统一的视图和操作界面，支持账号的创建、编辑、删除和查询等功能。">
        <ProTable
          className={styles.tableList}
          columns={columns}
          actionRef={actionRef}
          request={async () => {
            // 模拟请求数据，实际可根据 params 传递搜索参数
            return {
              data: [
                { id: 1, name: '示例1', description: '描述1' },
                { id: 2, name: '示例2', description: '描述2' },
              ],
              success: true,
              total: 2,
            };
          }}
          rowKey="id"
          pagination={{
            pageSize: 10,
          }}
          bordered
          toolBarRender={() => [
            <Button key="create" type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              新建
            </Button>,
            <Input
              key="search"
              placeholder="请输入名称"
              allowClear
              style={{ width: 260, marginLeft: 3 }}
              ref={searchInputRef}
              onPressEnter={handleSearch}
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

export default Account;
