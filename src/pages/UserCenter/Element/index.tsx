import { FC, Key, useEffect, useState } from 'react';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Flex, Tree, TreeDataNode, TreeProps } from 'antd';

const treeData: TreeDataNode[] = [
  {
    title: '0-0',
    key: '0-0',
    children: [
      {
        title: '0-0-0',
        key: '0-0-0',
        children: [
          { title: '0-0-0-0', key: '0-0-0-0' },
          { title: '0-0-0-1', key: '0-0-0-1' },
          { title: '0-0-0-2', key: '0-0-0-2' },
        ],
      },
      {
        title: '0-0-1',
        key: '0-0-1',
        children: [
          { title: '0-0-1-0', key: '0-0-1-0' },
          { title: '0-0-1-1', key: '0-0-1-1' },
          { title: '0-0-1-2', key: '0-0-1-2' },
        ],
      },
      {
        title: '0-0-2',
        key: '0-0-2',
      },
    ],
  },
  {
    title: '0-1',
    key: '0-1',
    children: [
      { title: '0-1-0-0', key: '0-1-0-0' },
      { title: '0-1-0-1', key: '0-1-0-1' },
      { title: '0-1-0-2', key: '0-1-0-2' },
    ],
  },
  {
    title: '0-2',
    key: '0-2',
  },
];

const Element: FC = () => {
  const [expandedKeys, setExpandedKeys] = useState<Key[]>(['0-0-0', '0-0-1']);
  const [checkedKeys, setCheckedKeys] = useState<Key[]>(['0-0-0']);
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const onExpand: TreeProps['onExpand'] = (expandedKeysValue) => {
    console.log('onExpand', expandedKeysValue);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck: TreeProps['onCheck'] = (checkedKeysValue) => {
    console.log('onCheck', checkedKeysValue);
    setCheckedKeys(checkedKeysValue as Key[]);
  };

  const onSelect: TreeProps['onSelect'] = (selectedKeysValue, info) => {
    console.log('onSelect', info);
    setSelectedKeys(selectedKeysValue);
  };

  useEffect(() => {
    // 获取路由数据
  }, []);

  return (
    <>
      <PageContainer content="权限元素用于对系统中的各类操作及菜单进行权限控制，通过对元素的管理，可以实现对用户操作的精细化控制。">
        <Flex gap={16}>
          <ProCard bordered style={{ maxWidth: 300 }}>
            <Tree
              checkable
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onCheck={onCheck}
              checkedKeys={checkedKeys}
              onSelect={onSelect}
              selectedKeys={selectedKeys}
              treeData={treeData}
              onRightClick={() => {
                console.log(123123);
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
