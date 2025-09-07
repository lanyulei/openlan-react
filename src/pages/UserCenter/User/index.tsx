import React, { FC, useEffect, useRef } from 'react';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import styles from '@/pages/Resource/Cloud/Account/index.less';
import { createUser, deleteUser, getUserList, updateUser } from '@/services/system/user';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, message, Modal, Row, Tag } from 'antd';
import { roleList } from '@/services/system/role';

interface UserInterface {
  id?: string;
  username: string;
  password?: string;
  password_confirm?: string;
  nickname: string;
  email: string;
  tel?: string;
  status: boolean;
  is_admin: boolean;
  role: string[];
  remark?: string;
}

const UserList: FC = () => {
  const [modalForm] = Form.useForm();
  const [modal, modalContextHolder] = Modal.useModal();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [visible, setVisible] = React.useState<boolean>(false);
  const [modalStatus, setModalStatus] = React.useState<string>('create'); // create | edit
  const [userForm, setUserForm] = React.useState<UserInterface>();
  const [query, setQuery] = React.useState<any>({
    username: undefined,
  });
  const actionRef = useRef<ActionType>();

  const getList = async () => {
    const res = await getUserList(query);
    return res.data || {};
  };

  const handleReload = async () => {
    await actionRef?.current?.reload();
  };

  useEffect(() => {
    if (visible && userForm) {
      modalForm.setFieldsValue(userForm);
    } else {
      setUserForm({
        username: '',
        nickname: '',
        email: '',
        tel: '',
        status: true,
        is_admin: false,
        role: [],
        remark: '',
      });
    }
  }, [visible]);

  return (
    <>
      {modalContextHolder}
      {messageContextHolder}
      <PageContainer content="用户管理是负责通过对用户进行增删改查、角色分配，来控制系统访问与操作范围，保障安全与秩序。">
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
              title: '用户名',
              dataIndex: 'username',
              key: 'username',
              ellipsis: true,
            },
            {
              title: '昵称',
              dataIndex: 'nickname',
              key: 'nickname',
              ellipsis: true,
            },
            {
              title: '邮箱',
              dataIndex: 'email',
              key: 'email',
              ellipsis: true,
            },
            {
              title: '状态',
              dataIndex: 'status',
              key: 'status',
              render: (_: any, record: any) => (
                <span>
                  <Tag color={record.status ? 'green' : 'red'}>
                    {record.status ? '启用' : '禁用'}
                  </Tag>
                </span>
              ),
            },
            {
              title: '是否管理员',
              dataIndex: 'is_admin',
              key: 'is_admin',
              render: (_: any, record: any) => (
                <span>
                  <Tag color={record.is_admin ? 'green' : 'red'}>
                    {record.is_admin ? '是' : '否'}
                  </Tag>
                </span>
              ),
            },
            {
              title: '创建时间',
              dataIndex: 'create_time',
              key: 'create_time',
              valueType: 'dateTime',
              width: 160,
            },
            {
              title: '更新时间',
              dataIndex: 'update_time',
              key: 'update_time',
              valueType: 'dateTime',
              width: 160,
            },
            {
              title: '操作',
              dataIndex: 'option',
              valueType: 'option',
              key: 'option',
              align: 'center' as const,
              width: 150,
              render: (_: any, record: any) => [
                <a
                  style={{ marginLeft: 10 }}
                  key="edit"
                  onClick={async () => {
                    setModalStatus('edit');
                    setUserForm({
                      ...record,
                    });
                    setVisible(true);
                  }}
                >
                  <EditOutlined /> 编辑
                </a>,
                <a
                  style={{ marginLeft: 10 }}
                  key="delete"
                  onClick={async () => {
                    modal.confirm({
                      title: '提示',
                      content: '确定是否删除此用户？',
                      okText: '确认',
                      cancelText: '取消',
                      onOk: async () => {
                        await deleteUser(record.id);
                        await handleReload();
                        messageApi.success('删除成功');
                        return true;
                      },
                    });
                  }}
                >
                  <DeleteOutlined /> 删除
                </a>,
              ],
            },
          ]}
          actionRef={actionRef}
          request={async () => {
            const _res = await getList();
            return {
              data: _res?.list || [],
              success: true,
              total: _res?.total || 0,
            };
          }}
          rowKey={(record) => record.id || record.name}
          pagination={false}
          bordered
          toolBarRender={() => [
            <Button
              onClick={() => {
                setVisible(true);
              }}
              key="addTemplate"
              type="primary"
              icon={<PlusOutlined />}
            >
              新建用户
            </Button>,
            <Input
              key="search"
              placeholder="请输入用户名"
              allowClear
              style={{ width: 260 }}
              onChange={(e) => {
                if (e.target.value === '') {
                  setQuery({ username: undefined });
                } else {
                  setQuery({ username: e.target.value });
                }
              }}
              onPressEnter={handleReload}
              suffix={<SearchOutlined />}
            />,
          ]}
          search={false}
        />
      </PageContainer>

      <ModalForm
        form={modalForm}
        title="管理用户"
        open={visible}
        onOpenChange={setVisible}
        autoFocusFirstInput
        onFinish={async (values) => {
          if (modalStatus === 'create') {
            await createUser(values);
          } else if (modalStatus === 'edit') {
            await updateUser(userForm?.id || '', {
              ...userForm,
              ...values,
            });
          }

          messageApi.success('更新成功');
          await handleReload();
          return true;
        }}
        modalProps={{
          destroyOnHidden: true,
        }}
        width={640}
        initialValues={userForm}
      >
        <Row gutter={16}>
          <Col span={12}>
            <ProFormText
              name="username"
              label="用户名"
              placeholder="请输入用户名"
              rules={[{ required: true, message: '用户名为必填项' }]}
            />
          </Col>
          <Col span={12}>
            <ProFormText
              name="nickname"
              label="姓名"
              placeholder="请输入姓名"
              rules={[{ required: true, message: '姓名为必填项' }]}
            />
          </Col>
          {modalStatus === 'create' && (
            <>
              <Col span={12}>
                <ProFormText.Password
                  name="password"
                  label="密码"
                  placeholder="请输入密码"
                  rules={[{ required: true, message: '密码为必填项' }]}
                />
              </Col>
              <Col span={12}>
                <ProFormText.Password
                  name="password_confirm"
                  label="确认密码"
                  placeholder="请再次输入密码"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: '请确认密码' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('两次输入的密码不一致'));
                      },
                    }),
                  ]}
                />
              </Col>
            </>
          )}
          <Col span={12}>
            <ProFormText
              name="email"
              label="邮箱"
              placeholder="请输入邮箱"
              rules={[
                { required: true, message: '邮箱为必填项' },
                { type: 'email', message: '邮箱格式不正确' },
              ]}
            />
          </Col>
          <Col span={12}>
            <ProFormText
              name="tel"
              label="手机号"
              placeholder="请输入手机号"
              rules={[
                {
                  pattern: /^1[3-9]\d{9}$/,
                  message: '手机号格式不正确',
                },
              ]}
            />
          </Col>
          {userForm?.is_admin && (
            <Col span={24}>
              <ProFormSelect
                name="role"
                label="角色"
                placeholder="请选择角色"
                options={[
                  { label: '管理员', value: 'admin' },
                  { label: '用户', value: 'user' },
                  { label: '访客', value: 'guest' },
                ]}
                request={async () => {
                  try {
                    const res = await roleList();
                    const list = res.data?.list || [];
                    return (list || []).map((item: any) => ({
                      label: item.name,
                      value: item.id,
                    }));
                  } catch (error) {
                    console.error('获取角色列表失败', error);
                    return [];
                  }
                }}
                fieldProps={{
                  mode: 'multiple',
                  showSearch: true,
                  allowClear: true,
                  optionFilterProp: 'label',
                  maxTagCount: 'responsive',
                }}
              />
            </Col>
          )}
          <Col span={12}>
            <ProFormSwitch
              name="status"
              label="状态"
              checkedChildren="启用"
              unCheckedChildren="禁用"
            />
          </Col>
          <Col span={12}>
            <ProFormSwitch
              name="is_admin"
              label="是否管理员"
              checkedChildren="是"
              unCheckedChildren="否"
              fieldProps={{
                checked: userForm?.is_admin,
                onChange: (checked: boolean) =>
                  setUserForm((prev: UserInterface | undefined) =>
                    prev ? { ...prev, is_admin: checked } : prev,
                  ),
              }}
            />
          </Col>
          <Col span={24}>
            <ProFormTextArea name="remark" label="备注" placeholder="请输入备注" />
          </Col>
        </Row>
      </ModalForm>
    </>
  );
};

export default UserList;
