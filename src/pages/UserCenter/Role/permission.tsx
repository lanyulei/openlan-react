import { FC } from 'react';
import { PageContainer, ProCard } from '@ant-design/pro-components';

const RolePermission: FC = () => {
  return (
    <>
      <PageContainer content="角色权限分配用于管理和控制用户对系统资源的访问权限，通过分配不同的权限给角色，实现对用户操作的精细化管理。">
        <ProCard title="默认尺寸" bordered style={{ maxWidth: 300 }}>
          <div>Card content</div>
          <div>Card content</div>
          <div>Card content</div>
        </ProCard>
      </PageContainer>
    </>
  );
};

export default RolePermission;
