import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Typography } from 'antd';
import { PlusCircleOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons';
import { CheckCard } from '@ant-design/pro-components';

const { Paragraph } = Typography;

const Directory: React.FC = () => {
  return (
    <PageContainer
      header={{
        title: '页面标题',
        ghost: true,
        extra: [
          <Button key="1" icon={<PlusCircleOutlined />}>
            创建
          </Button>,
          <Button key="2" icon={<FormOutlined />}>
            编辑
          </Button>,
          <Button key="3" icon={<DeleteOutlined />}>
            删除
          </Button>,
        ],
      }}
    >
      <CheckCard
        avatar="https://gw.alipayobjects.com/zos/bmw-prod/f601048d-61c2-44d0-bf57-ca1afe7fd92e.svg"
        title="选择一个由流程编排提供的典型用户案例，可以从中学习到流程编排很多设计理念。"
        description={
          <Paragraph
            ellipsis={{ rows: 1 }}
            style={{
              marginBottom: 0,
            }}
          >
            选择一个由流程编排提供的典型用户案例，可以从中学习到流程编排很多设计理念。
          </Paragraph>
        }
        onChange={(checked) => {
          console.log('checked', checked);
        }}
        defaultChecked
        onClick={() => {
          console.log('clicked');
        }}
      />
    </PageContainer>
  );
};

export default Directory;
