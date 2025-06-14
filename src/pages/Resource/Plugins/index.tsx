import React from 'react';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card } from 'antd';
import { PageContainer } from '@ant-design/pro-components';

const { Meta } = Card;

const App: React.FC = () => (
  <>
    <PageContainer content="插件管理支持内置及自定义插件的全生命周期管理，包括插件元数据维护、上传部署等，实现多云、混合云及自定义资源的灵活同步。">
      <Card
        style={{ width: 300 }}
        actions={[
          <SettingOutlined key="setting" />,
          <EditOutlined key="edit" />,
          <EllipsisOutlined key="ellipsis" />,
        ]}
      >
        <Meta
          avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
          title="Card title"
          description="This is the description"
        />
      </Card>
    </PageContainer>
  </>
);

export default App;
