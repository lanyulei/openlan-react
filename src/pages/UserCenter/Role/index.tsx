import React, { FC, useEffect, useRef } from 'react';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import styles from '@/pages/Resource/Cloud/Account/index.less';
import { createRole, deleteRole, roleList, updateRole } from '@/services/system/role';
import {
  BlockOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Col, Form, Input, message, Modal, Row, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';

interface RoleInterface {
  id?: string;
  name: string;
  status: boolean;
  remark?: string;
}

const RoleList: FC = () => {
  const navigate = useNavigate();
  const [modalForm] = Form.useForm();
  const [modal, modalContextHolder] = Modal.useModal();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [visible, setVisible] = React.useState<boolean>(false);
  const [modalStatus, setModalStatus] = React.useState<string>('create'); // create | edit
  const [roleForm, setRoleForm] = React.useState<RoleInterface>();
  const [query, setQuery] = React.useState<any>({
    name: undefined,
  });
  const actionRef = useRef<ActionType>();

  const getList = async () => {
    const res = await roleList(query);
    return res.data || {};
  };

  const handleReload = async () => {
    await actionRef?.current?.reload();
  };

  useEffect(() => {
    if (visible && roleForm) {
      modalForm.setFieldsValue(roleForm);
    } else {
      setRoleForm({
        name: '',
        status: true,
        remark: '',
      });
    }
  }, [visible]);

  return (
    <>
      {modalContextHolder}
      {messageContextHolder}
      <PageContainer content="角色管理是通过对角色进行分组和权限分配，实现系统访问控制的精细化管理。">
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
              title: '名称',
              dataIndex: 'name',
              key: 'name',
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
              title: '创建时间',
              dataIndex: 'create_time',
              key: 'create_time',
              valueType: 'dateTime',
              width: 170,
            },
            {
              title: '更新时间',
              dataIndex: 'update_time',
              key: 'update_time',
              valueType: 'dateTime',
              width: 170,
            },
            {
              title: '操作',
              dataIndex: 'option',
              valueType: 'option',
              key: 'option',
              align: 'center' as const,
              width: 210,
              render: (_: any, record: any) => [
                <a
                  style={{ marginLeft: 10 }}
                  key="permission"
                  onClick={() => {
                    navigate(`/user-center/role/${record.id}/permission`);
                  }}
                >
                  <BlockOutlined /> 权限
                </a>,
                <a
                  style={{ marginLeft: 10 }}
                  key="edit"
                  onClick={async () => {
                    setModalStatus('edit');
                    setRoleForm({
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
                      content: '确定是否删除此角色？',
                      okText: '确认',
                      cancelText: '取消',
                      onOk: async () => {
                        await deleteRole(record.id);
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
              新建角色
            </Button>,
            <Input
              key="search"
              placeholder="请输入名称"
              allowClear
              style={{ width: 260 }}
              onChange={(e) => {
                if (e.target.value === '') {
                  setQuery({ name: undefined });
                } else {
                  setQuery({ name: e.target.value });
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
        title="管理角色"
        open={visible}
        onOpenChange={setVisible}
        autoFocusFirstInput
        onFinish={async (values) => {
          if (modalStatus === 'create') {
            await createRole(values);
          } else if (modalStatus === 'edit') {
            await updateRole(roleForm?.id || '', {
              ...roleForm,
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
        initialValues={roleForm}
      >
        <Row gutter={16}>
          <Col span={12}>
            <ProFormText
              name="name"
              label="名称"
              placeholder="请输入名称"
              rules={[{ required: true, message: '名称为必填项' }]}
            />
          </Col>
          <Col span={12}>
            <ProFormSwitch
              name="status"
              label="状态"
              checkedChildren="启用"
              unCheckedChildren="禁用"
            />
          </Col>
        </Row>
        <ProFormTextArea name="remark" label="备注" placeholder="请输入备注" />
      </ModalForm>
    </>
  );
};

export default RoleList;
