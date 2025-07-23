import { useModel } from '@umijs/max';
import { Card, theme } from 'antd';
import React from 'react';

const Home: React.FC = () => {
  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');
  return (
    <Card
      style={{
        borderRadius: 8,
      }}
      styles={{
        body: {
          backgroundImage:
            initialState?.settings?.navTheme === 'realDark'
              ? 'background-image: linear-gradient(75deg, #1A1B1F 0%, #191C1F 100%)'
              : 'background-image: linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
        },
      }}
    >
      <div>
        <div
          style={{
            fontSize: '20px',
            color: token.colorTextHeading,
          }}
        >
          欢迎使用运维管理平台
        </div>
        <p
          style={{
            fontSize: '14px',
            color: token.colorTextSecondary,
            lineHeight: '22px',
            marginTop: 16,
            marginBottom: 2,
          }}
        >
          该系统提供全面的管理功能，包括工作台、主机管理、批量执行（如任务执行、模板管理和文件分发）、应用发布（含发布配置、构建仓库和发布申请）、任务计划、配置中心（环境管理、服务配置和应用配置）、监控中心、报警中心（报警历史、报警联系人和报警联系组）以及系统管理（登录日志、账户管理、角色管理和系统设置），支持高效运维与管理。
        </p>
      </div>
    </Card>
  );
};

export default Home;
