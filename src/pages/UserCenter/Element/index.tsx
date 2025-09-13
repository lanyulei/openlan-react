import { FC, Key, useEffect, useState } from 'react';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Flex, Tree, TreeDataNode, TreeProps } from 'antd';
import { permissionTree } from '@/services/system/permission';
import { useIntl } from '@umijs/max';
import * as Icons from '@ant-design/icons';

interface TreeDataInterface {
  menu: TreeDataNode[];
  element: object;
}

const Element: FC = () => {
  const intl = useIntl();
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
  const [treeData, setTreeData] = useState<TreeDataInterface>();

  const onSelect: TreeProps['onSelect'] = (selectedKeysValue, info) => {
    console.log('onSelect', info);
    setSelectedKeys(selectedKeysValue);
  };

  useEffect(() => {
    (async () => {
      const res = await permissionTree();
      setTreeData(res.data);
    })();
  }, []);

  return (
    <>
      <PageContainer content="权限元素用于对系统中的各类操作及菜单进行权限控制，通过对元素的管理，可以实现对用户操作的精细化控制。">
        <Flex gap={16}>
          <ProCard bordered style={{ maxWidth: 300 }}>
            <Tree
              checkable
              onSelect={onSelect}
              selectedKeys={selectedKeys}
              fieldNames={{ title: 'name', key: 'id', children: 'children' }}
              treeData={treeData?.menu}
              titleRender={(node: any) => {
                const getIconComponent = (icon?: string) => {
                  if (!icon) return null;
                  // 转 PascalCase，并兼容 kebab/underscore 命名
                  const pascal = icon
                    .trim()
                    .replace(/[-_](\w)/g, (_: string, c: string) => c.toUpperCase())
                    .replace(/^\w/, (s) => s.toUpperCase());

                  const candidates = [
                    pascal, // 已经是完整名，如 UserOutlined
                    `${pascal}Outlined`,
                    `${pascal}Filled`,
                    `${pascal}TwoTone`,
                  ];

                  for (const key of candidates) {
                    const Comp = (Icons as any)[key];
                    if (Comp) return Comp;
                  }
                  return null;
                };

                const IconComp = getIconComponent(node?.icon);

                return (
                  <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                    {IconComp ? <IconComp style={{ marginRight: 8 }} /> : null}
                    {intl.formatMessage({ id: `menu.${node?.intl}`, defaultMessage: node?.name })}
                  </span>
                );
              }}
              onRightClick={(info) => {
                info.event.preventDefault(); // 阻止浏览器默认菜单
                console.log('右键节点', info.node);
              }}
            />
          </ProCard>
          <ProCard
            tabs={{
              type: 'card',
              items: [
                {
                  key: 'Basic',
                  label: '基本信息',
                  children: '内容一',
                },
                {
                  key: 'Element',
                  label: '页面元素',
                  children: '内容二',
                },
              ],
            }}
          />
        </Flex>
      </PageContainer>
    </>
  );
};

export default Element;
