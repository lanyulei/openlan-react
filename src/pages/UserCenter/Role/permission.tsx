import { FC, Key, useEffect, useState } from 'react';
import {
  ModalForm,
  PageContainer,
  ProCard,
  ProFormDigit,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import {
  Button,
  Checkbox,
  Col,
  Empty,
  Flex,
  Form,
  message,
  Row,
  Tree,
  TreeDataNode,
  TreeProps,
} from 'antd';
import { createPermission, permissionTree } from '@/services/system/permission';
import { useIntl, useParams } from '@umijs/max';
import * as Icons from '@ant-design/icons';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
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
  const [form] = Form.useForm();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [selectedValue, setSelectedValue] = useState<any>({});
  const [checkedKeys, setCheckedKeys] = useState<Key[]>([]);
  const [treeData, setTreeData] = useState<{ menu: TreeDataNode[]; element: object }>();
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState<'create' | 'edit'>('create');

  const onExpand: TreeProps['onExpand'] = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };
  const onSelect: TreeProps['onSelect'] = (selectedKeysValue, info) => {
    console.log(info.node);
    setSelectedValue(info?.node);
  };
  const onCheck: TreeProps['onCheck'] = (checkedKeysValue) => {
    const keys: Key[] = Array.isArray(checkedKeysValue)
      ? checkedKeysValue
      : checkedKeysValue.checked;
    setCheckedKeys(keys);
  };

  const onChange = (list: any[]) => {
    console.log('checked = ', list);
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
                {
                  key: 'Element',
                  label: '页面元素',
                  children: (
                    <>
                      {(selectedValue as any)?.id ? (
                        <>
                          <Flex gap="small" wrap>
                            <Button
                              color="primary"
                              variant="outlined"
                              icon={<PlusOutlined />}
                              onClick={() => {
                                setStatus('create');
                                setVisible(true);
                              }}
                            >
                              新建
                            </Button>
                            <Button
                              color="default"
                              variant="outlined"
                              icon={<EditOutlined />}
                              onClick={() => {
                                setStatus('edit');
                                setVisible(true);
                              }}
                            >
                              编辑
                            </Button>
                            <Button color="danger" variant="outlined" icon={<DeleteOutlined />}>
                              删除
                            </Button>
                          </Flex>
                          <Checkbox.Group
                            style={{ marginTop: 16 }}
                            options={(
                              (treeData?.element as Record<string, any[]> | undefined)?.[
                                String(selectedValue?.id ?? '')
                              ] ?? []
                            ).map((el: any) => ({
                              label: el.name,
                              value: el.id,
                            }))}
                            defaultValue={[]}
                            onChange={onChange}
                          />
                        </>
                      ) : (
                        <Empty
                          style={{ marginTop: 100 }}
                          description="暂未选择菜单选项"
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                      )}
                    </>
                  ),
                },
              ],
            }}
          />
        </Flex>
      </PageContainer>

      <ModalForm
        title="页面元素管理"
        form={form}
        autoFocusFirstInput
        modalProps={{
          destroyOnHidden: true,
        }}
        onFinish={async (values: any) => {
          const params = {
            ...values,
            parent: selectedValue?.id,
            types: 'element',
            built_in: true,
          };
          if (status === 'create') {
            await createPermission(params);
            messageApi.success('创建成功');
          } else if (status === 'edit') {
            console.log('更新', values);
            messageApi.success('更新成功');
          }
          return true;
        }}
        open={visible}
        onOpenChange={setVisible}
      >
        <Row gutter={16}>
          <Col span={12}>
            <ProFormText
              name="name"
              label="名称"
              placeholder="请输入名称"
              rules={[{ required: true, message: '请输入名称' }]}
            />
          </Col>
          <Col span={12}>
            <ProFormText
              name="code"
              label="编码"
              placeholder="请输入编码"
              rules={[{ required: true, message: '请输入编码' }]}
            />
          </Col>
        </Row>
        <ProFormDigit name="sort" label="排序" min={0} fieldProps={{ precision: 0 }} />
        <ProFormTextArea
          name="remark"
          label="备注"
          placeholder="请输入备注"
          fieldProps={{ rows: 3, maxLength: 500, showCount: true }}
        />
      </ModalForm>
    </>
  );
};

export default Element;
