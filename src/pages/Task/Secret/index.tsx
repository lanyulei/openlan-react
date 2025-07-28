import React, { FC, useEffect, useRef } from 'react';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import styles from '@/pages/Resource/Cloud/Account/index.less';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, message, Modal, Row } from 'antd';
import { createSecret, deleteSecret, secretList, updateSecret } from '@/services/task/secret';

interface SecretData {
  id?: string | undefined;
  name: string;
  types: 'sshKey' | 'password' | 'none' | undefined;
  username?: string;
  password?: string;
  ssh_key?: string;
  remarks?: string;
}

const Secret: FC = () => {
  const [form] = Form.useForm();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();
  const actionRef = useRef<ActionType>();
  const [query, setQuery] = React.useState<any>({
    name: undefined,
  });
  const [modalStatus, setModalStatus] = React.useState<string>('create'); // create | edit
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [secretForm, setSecretForm] = React.useState<SecretData>({
    id: undefined,
    name: '',
    types: undefined,
  });

  const handleReload = async () => {
    await actionRef?.current?.reload();
  };

  const getList = async () => {
    const res = await secretList(query);
    return res.data || {};
  };

  useEffect(() => {
    if (modalVisible && secretForm) {
      form.setFieldsValue(secretForm);
    } else {
      setSecretForm({
        name: '',
        types: undefined,
      });
    }
  }, [modalVisible]);

  return (
    <>
      {modalContextHolder}
      {messageContextHolder}
      <PageContainer content="秘钥管理是通过加密敏感数据（如密码、密钥等）并配合密码或密钥文件进行解密，确保 Playbook 中的机密信息安全存储和传输。">
        <ProTable
          className={styles.tableList}
          columns={[
            {
              title: '名称',
              dataIndex: 'name',
              key: 'name',
              ellipsis: true,
            },
            {
              title: '创建时间',
              dataIndex: 'create_time',
              key: 'create_time',
              valueType: 'dateTime',
            },
            {
              title: '更新时间',
              dataIndex: 'update_time',
              key: 'update_time',
              valueType: 'dateTime',
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
                  onClick={() => {
                    setSecretForm({ ...record });
                    setModalStatus('edit');
                    setModalVisible(true);
                  }}
                >
                  <EditOutlined /> 编辑
                </a>,
                <a
                  style={{ marginLeft: 10 }}
                  key="delete"
                  onClick={() => {
                    modal.confirm({
                      title: '提示',
                      content: '确定是否删除此秘钥？',
                      okText: '确认',
                      cancelText: '取消',
                      onOk: async () => {
                        await deleteSecret(record.id);
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
                setModalStatus('create');
                setModalVisible(true);
              }}
              key="addSecret"
              type="primary"
              icon={<PlusOutlined />}
            >
              新建秘钥
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
        title={modalStatus === 'create' ? '新建秘钥' : '编辑秘钥'}
        form={form}
        autoFocusFirstInput
        modalProps={{
          destroyOnHidden: true,
          onCancel: () => {
            form.setFieldsValue(undefined);
          },
        }}
        onFinish={async (values) => {
          if (modalStatus === 'create') {
            // 调用创建接口
            await createSecret(values);
            await handleReload();
            messageApi.success('创建成功');
          } else if (modalStatus === 'edit') {
            // 调用更新接口
            await updateSecret(secretForm?.id, values, {});
            await handleReload();
            messageApi.success('更新成功');
          }

          return true;
        }}
        open={modalVisible}
        onOpenChange={(visible) => {
          setModalVisible(visible);
        }}
        width={650}
        onValuesChange={(_, allValues) => setSecretForm({ ...secretForm, ...allValues })}
      >
        <Row gutter={15}>
          <Col span={12}>
            <ProFormText
              name="name"
              label="名称"
              placeholder="请输入秘钥名称"
              rules={[{ required: true, message: '请输入名称' }]}
            />
          </Col>
          <Col span={12}>
            <ProFormSelect
              name="types"
              label="类型"
              options={[
                { label: 'SSH 秘钥', value: 'sshKey' },
                { label: '用户密码', value: 'password' },
                { label: '无', value: 'none' },
              ]}
              placeholder="请选择类型"
              rules={[{ required: true, message: '请选择类型' }]}
            />
          </Col>
          {secretForm?.types && secretForm?.types !== 'none' && (
            <>
              <Col span={12}>
                <ProFormText name="username" label="用户名" placeholder="请输入用户名" />
              </Col>
              <Col span={12}>
                <ProFormText.Password
                  name="password"
                  label="密码"
                  placeholder="请输入密码"
                  rules={[
                    {
                      required: secretForm.types === 'password',
                      message: '请输入密码',
                    },
                  ]}
                />
              </Col>
            </>
          )}
        </Row>
        {secretForm?.types === 'sshKey' && (
          <ProFormTextArea
            label="SSH 秘钥"
            name="ssh_key"
            placeholder="请输入SSH 秘钥"
            rules={[{ required: true, message: '请输入SSH 秘钥' }]}
          />
        )}
        <ProFormTextArea label="备注" name="remarks" placeholder="请输入备注" />
      </ModalForm>
    </>
  );
};

export default Secret;
