import { FC, Key, useEffect, useState } from 'react';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Button, Flex, message, Tree, TreeDataNode, TreeProps } from 'antd';
import { permissionTree } from '@/services/system/permission';
import { useIntl, useParams } from '@umijs/max';
import * as Icons from '@ant-design/icons';
import { getRolePermission, setRolePermission } from '@/services/system/role';

const normalizeKey = (k: Key) => String(k);
const collectIds = (nodes?: TreeDataNode[]): Set<string> => {
  const set = new Set<string>();
  const stack = Array.isArray(nodes) ? [...nodes] : [];
  while (stack.length) {
    const node = stack.pop() as any;
    const id = node?.id;
    if (id !== undefined && id !== null) set.add(normalizeKey(id));
    const children = node?.children;
    if (Array.isArray(children)) stack.push(...children);
  }
  return set;
};

const Element: FC = () => {
  const intl = useIntl();
  const params = useParams();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<Key[]>([]);
  const [treeData, setTreeData] = useState<{ menu: TreeDataNode[]; element: object }>();
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);

  const onExpand: TreeProps['onExpand'] = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };
  const onSelect: TreeProps['onSelect'] = (selectedKeysValue) => setSelectedKeys(selectedKeysValue);
  const onCheck: TreeProps['onCheck'] = (checkedKeysValue) => {
    const keys: Key[] = Array.isArray(checkedKeysValue)
      ? checkedKeysValue
      : checkedKeysValue.checked;
    setCheckedKeys(keys);
  };

  const handleSubmit = async () => {
    await setRolePermission(params.id as string, { permission_ids: checkedKeys });
    messageApi.success('保存成功');
  };

  useEffect(() => {
    (async () => {
      // 并发获取树与角色权限
      const [menuRes, rp] = await Promise.all([
        permissionTree(),
        getRolePermission(params.id as string),
      ]);

      setTreeData(menuRes.data);

      // 只展开存在的 key
      const firstId = menuRes.data?.menu?.[0]?.id;
      setExpandedKeys(firstId !== null ? [firstId] : []);

      // 过滤掉不在 menu 树中的权限 id，避免 Tree missing follow keys
      const allMenuIds = collectIds(menuRes.data?.menu);
      const rawKeys: Key[] = rp.data || [];
      const filtered = rawKeys.map(normalizeKey).filter((k) => allMenuIds.has(k));
      setCheckedKeys(filtered);
    })();
  }, [params.id]);

  return (
    <>
      {messageContextHolder}
      <PageContainer
        content="角色权限分配用于管理和控制用户对系统资源的访问权限，通过分配不同的权限给角色，实现对用户操作的精细化管理。"
        extra={
          <Button type="primary" onClick={handleSubmit}>
            保存
          </Button>
        }
      >
        <Flex gap={16}>
          <ProCard bordered style={{ maxWidth: 300 }}>
            <Tree
              checkable
              onExpand={onExpand}
              onSelect={onSelect}
              onCheck={onCheck}
              checkedKeys={checkedKeys}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              selectedKeys={selectedKeys}
              fieldNames={{ title: 'name', key: 'id', children: 'children' }}
              treeData={treeData?.menu}
              titleRender={(node: any) => {
                const pascal = String(node?.icon || '')
                  .trim()
                  .replace(/[-_](\w)/g, (_: string, c: string) => c.toUpperCase())
                  .replace(/^\w/, (s) => s.toUpperCase());
                const candidates = [
                  pascal,
                  `${pascal}Outlined`,
                  `${pascal}Filled`,
                  `${pascal}TwoTone`,
                ];
                const IconComp = candidates.reduce<any>(
                  (acc, key) => acc || (Icons as any)[key],
                  null,
                );

                return (
                  <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                    {IconComp ? <IconComp style={{ marginRight: 8 }} /> : null}
                    <span style={{ color: node?.sort > 99 ? '#939393' : undefined }}>
                      {intl.formatMessage({ id: `menu.${node?.intl}`, defaultMessage: node?.name })}
                    </span>
                  </span>
                );
              }}
              onRightClick={(info) => {
                info.event.preventDefault();
                console.log('右键节点', info.node);
              }}
            />
          </ProCard>
          <ProCard
            tabs={{
              type: 'card',
              items: [
                { key: 'Basic', label: '基本信息', children: '内容一' },
                { key: 'Element', label: '页面元素', children: '内容二' },
              ],
            }}
          />
        </Flex>
      </PageContainer>
    </>
  );
};

export default Element;
