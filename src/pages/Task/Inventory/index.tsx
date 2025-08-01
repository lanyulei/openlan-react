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
import {
  createInventory,
  deleteInventory,
  inventoryList,
  updateInventory,
} from '@/services/task/inventory';
import { secretList } from '@/services/task/secret';
import MonacoEditor from '@/components/MonacoEditor';

interface InventoryData {
  id?: string | undefined;
  name: string;
  types: 'ini' | 'yaml' | undefined;
  user_cred: string | undefined; // 用户凭据 ID
  sudo_cred?: string | undefined; // Sudo 凭据 ID
  content?: string; // 内容
  remarks?: string; // 备注
}

const Inventory: FC = () => {
  const [form] = Form.useForm();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();
  const actionRef = useRef<ActionType>();
  const [query, setQuery] = React.useState<any>({
    name: undefined,
  });
  const [modalStatus, setModalStatus] = React.useState<string>('create'); // create | edit
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [inventoryForm, setInventoryForm] = React.useState<InventoryData>({
    id: undefined,
    name: '',
    types: 'ini',
    user_cred: undefined,
    sudo_cred: undefined,
  });
  const [secretValueList, setSecretValueList] = React.useState<any[]>([]);

  const handleReload = async () => {
    await actionRef?.current?.reload();
  };

  const getList = async () => {
    const res = await inventoryList(query);
    return res.data || {};
  };

  const getSecretList = async () => {
    const res = await secretList({
      not_page: true,
    });
    setSecretValueList(res.data?.list);
  };

  useEffect(() => {
    if (modalVisible && inventoryForm) {
      form.setFieldsValue(inventoryForm);
    } else {
      setInventoryForm({
        name: '',
        types: 'ini',
        user_cred: undefined,
        sudo_cred: undefined,
      });
    }
  }, [modalVisible]);

  useEffect(() => {
    (async () => {
      await getSecretList();
    })();
  }, []);

  return (
    <>
      {modalContextHolder}
      {messageContextHolder}
      <PageContainer content="主机清单是用于定义和管理目标主机（或节点）列表的配置文件或动态脚本，指定了 Playbook 或命令操作的对象。">
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
              title: '类型',
              dataIndex: 'types',
              key: 'types',
              render: (_: React.ReactNode, record: any) => {
                if (record.types === 'ini') return 'INI 格式';
                if (record.types === 'yaml') return 'YAML 格式';
                return record.types || '-';
              },
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
                    setInventoryForm({ ...record });
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
                      content: '确定是否删除此主机清单？',
                      okText: '确认',
                      cancelText: '取消',
                      onOk: async () => {
                        await deleteInventory(record.id);
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
              key="addInventory"
              type="primary"
              icon={<PlusOutlined />}
            >
              新建主机清单
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
        title={modalStatus === 'create' ? '新建主机清单' : '编辑主机清单'}
        form={form}
        autoFocusFirstInput
        modalProps={{
          destroyOnHidden: true,
          onCancel: () => {
            form.setFieldsValue(undefined);
          },
        }}
        onFinish={async (values) => {
          const _data = {
            ...values,
            content: inventoryForm.content,
          };

          if (modalStatus === 'create') {
            // 调用创建接口
            await createInventory(_data);
            await handleReload();
            messageApi.success('创建成功');
          } else if (modalStatus === 'edit') {
            // 调用更新接口
            await updateInventory(inventoryForm?.id, _data, {});
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
        onValuesChange={(_, allValues) => setInventoryForm({ ...inventoryForm, ...allValues })}
      >
        <Row gutter={15}>
          <Col span={12}>
            <ProFormText
              name="name"
              label="名称"
              placeholder="请输入主机清单名称"
              rules={[{ required: true, message: '请输入名称' }]}
            />
          </Col>
          <Col span={12}>
            <ProFormSelect
              name="types"
              label="类型"
              options={[
                { label: 'INI 格式', value: 'ini' },
                { label: 'YAML 格式', value: 'yaml' },
              ]}
              placeholder="请选择类型"
              rules={[{ required: true, message: '请选择类型' }]}
            />
          </Col>
          <Col span={12}>
            <ProFormSelect
              name="user_cred"
              label="用户凭证"
              options={secretValueList.map((item) => ({
                label: (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 500 }}>{item.name}</span>
                    <span style={{ color: '#888', marginLeft: 8 }}>{item.types}</span>
                  </div>
                ),
                value: item.id,
              }))}
              placeholder="请选择用户凭证"
              rules={[{ required: true, message: '请选择用户凭证' }]}
            />
          </Col>
          <Col span={12}>
            <ProFormSelect
              name="sudo_cred"
              label="Sudo 凭证"
              options={secretValueList
                .filter((item) => item.types !== 'none')
                .map((item) => ({
                  label: (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 500 }}>{item.name}</span>
                      <span style={{ color: '#888', marginLeft: 8 }}>{item.types}</span>
                    </div>
                  ),
                  value: item.id,
                }))}
              placeholder="请选择 Sudo 凭证"
            />
          </Col>
        </Row>
        <div style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 8 }}>内容</div>
          <MonacoEditor
            codeType={inventoryForm.types}
            value={inventoryForm.content}
            onChange={(value) => {
              setInventoryForm({ ...inventoryForm, content: value });
            }}
          />
        </div>
        <ProFormTextArea label="备注" name="remarks" placeholder="请输入备注" />
      </ModalForm>
    </>
  );
};

export default Inventory;
