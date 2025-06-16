import React, { FC, useEffect, useRef } from 'react';
import {
  ProTable,
  ActionType,
  PageContainer,
  ModalForm,
  ProFormSelect,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
  ProFormGroup,
  ProColumns,
} from '@ant-design/pro-components';
import { Button, Dropdown, Input, MenuProps, message, Modal, Space, Tag } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  PlusOutlined,
  SearchOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import styles from './index.less';
import {
  createCloudAccount,
  deleteCloudAccount,
  getAccountList,
  syncCloudResource,
  updateCloudAccount,
} from '@/services/resource/cloudAccount';
import { Form } from '@ant-design/pro-editor';
import { getPlugins } from '@/services/resource/plugin';

const Account: FC = () => {
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();
  const searchInputRef = useRef(null);
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();

  const [modalVisible, setModalVisible] = React.useState(false);
  const [query, setQuery] = React.useState({
    name: '',
  });
  const [accountForm, setAccountForm] = React.useState<any>({
    id: undefined,
    name: '',
    provider: 'AliCloud',
    available: true,
    access_key: '',
    secret_key: '',
    plugin_name: undefined,
    remarks: '',
  });
  const [modalStatus, setModalStatus] = React.useState('create');
  const [pluginList, setPluginList] = React.useState<any[]>([]);

  const handleCreate = () => {
    setModalStatus('create');
    setModalVisible(true);
  };

  const getMenuItems = (record: any): MenuProps['items'] => [
    {
      label: (
        <a
          onClick={() => {
            modal.confirm({
              title: '提示',
              content: '请确定是否进行资源同步？',
              okText: '确认',
              cancelText: '取消',
              onOk: async () => {
                await syncCloudResource(
                  {
                    cloud_account_id: record.id,
                  },
                  {},
                );
                actionRef.current?.reload();
                return true;
              },
            });
          }}
        >
          <SyncOutlined />
          &nbsp; 同步
        </a>
      ),
      key: 'sync',
    },
    {
      label: (
        <a
          onClick={() => {
            const _data = {
              ...record,
            };
            form.setFieldsValue(_data);
            setAccountForm(_data);
            setModalStatus('edit');
            setModalVisible(true);
          }}
        >
          <EditOutlined />
          &nbsp; 编辑
        </a>
      ),
      key: 'edit',
    },
    {
      label: (
        <a
          onClick={() => {
            modal.confirm({
              title: '提示',
              content: '确定要删除此云账号吗？',
              okText: '确认',
              cancelText: '取消',
              onOk: async () => {
                await deleteCloudAccount(record.id, {});
                actionRef.current?.reload();
                messageApi.success('云账号删除成功');
                return true;
              },
            });
          }}
        >
          <DeleteOutlined />
          &nbsp; 删除
        </a>
      ),
      key: 'delete',
    },
  ];

  const columns: ProColumns[] = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '云厂商',
      dataIndex: 'provider_name',
      key: 'provider_name',
    },
    {
      title: '是否可用',
      dataIndex: 'available',
      key: 'available',
      render: (_: any, record: any) => (
        <Tag color={record.available ? 'blue' : 'red'}>{record.available ? '启用' : '停用'}</Tag>
      ),
    },
    {
      title: '同步状态',
      dataIndex: 'sync_status',
      key: 'sync_status',
      render: (_: any, record: any) => {
        const statusMap: Record<string, React.ReactNode> = {
          running: (
            <div style={{ display: 'flex' }}>
              <SyncOutlined style={{ marginRight: 5 }} />
              同步中
            </div>
          ),
          success: (
            <div style={{ display: 'flex' }}>
              <CheckCircleOutlined style={{ color: 'green', marginRight: 5 }} />
              同步成功
            </div>
          ),
          failed: (
            <div style={{ display: 'flex' }}>
              <CloseCircleOutlined style={{ color: 'red', marginRight: 5 }} />
              同步失败
            </div>
          ),
        };
        return statusMap[record.sync_status];
      },
    },
    {
      title: '最近同步时间',
      dataIndex: 'last_sync_time',
      valueType: 'dateTime',
      key: 'last_sync_time',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      valueType: 'dateTime',
      key: 'create_time',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      key: 'option',
      align: 'center' as const,
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Dropdown menu={{ items: getMenuItems(record) }} trigger={['click']}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <EllipsisOutlined />
              </Space>
            </a>
          </Dropdown>
        </div>
      ),
    },
  ];

  // 搜索功能（可根据实际接口调整）
  const handleReload = () => {
    actionRef.current?.reload();
  };

  useEffect(() => {
    (async () => {
      const _res = await getPlugins({}, {});
      setPluginList(_res.data || []);
    })();
  }, []);

  return (
    <>
      {modalContextHolder}
      {messageContextHolder}
      <PageContainer content="云账号管理用于集中管理各类云服务账号，提供统一的视图和操作界面，支持账号的创建、编辑、删除和查询等功能。">
        <ProTable
          className={styles.tableList}
          columns={columns}
          actionRef={actionRef}
          request={async () => {
            const _res = await getAccountList(query, {});
            return {
              data: _res.data?.list || [],
              success: true,
              total: _res.data?.total || 0,
            };
          }}
          rowKey="id"
          pagination={{
            pageSize: 10,
          }}
          bordered
          toolBarRender={() => [
            <Button key="create" type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              新建
            </Button>,
            <Input
              key="search"
              placeholder="请输入名称"
              allowClear
              style={{ width: 260, marginLeft: 3 }}
              ref={searchInputRef}
              value={query.name}
              onChange={(e) => setQuery({ ...query, name: e.target.value })}
              onPressEnter={handleReload}
              suffix={<SearchOutlined />}
            />,
          ]}
          search={false}
          options={{
            reload: false,
          }}
        />
      </PageContainer>
      <ModalForm
        form={form}
        title="云账号管理"
        width={600}
        onFinish={async (values) => {
          const _data = {
            ...accountForm,
            ...values,
          };
          if (modalStatus === 'create') {
            await createCloudAccount(_data, {});
            handleReload();
            setModalVisible(false);
            messageApi.success('云账号创建成功');
          } else if (modalStatus === 'edit') {
            await updateCloudAccount(_data.id, _data, {});
            handleReload();
            setModalVisible(false);
            messageApi.success('云账号更新成功');
          }
        }}
        onOpenChange={setModalVisible}
        open={modalVisible}
        modalProps={{
          destroyOnHidden: true,
          onCancel: () => {
            setAccountForm({
              id: undefined,
              name: '',
              provider: 'AliCloud',
              available: true,
              access_key: '',
              secret_key: '',
              plugin_name: '',
              remarks: '',
            });
          },
        }}
        initialValues={accountForm}
        onValuesChange={(_, values) => {
          setAccountForm((prev: any) => ({ ...prev, ...values }));
        }}
      >
        <ProFormGroup>
          <ProFormSelect
            name="provider"
            label="云厂商"
            width="sm"
            rules={[{ required: true, message: '请选择云厂商' }]}
            options={[
              { value: 'AliCloud', label: '阿里云' },
              { value: 'TencentCloud', label: '腾讯云' },
            ]}
          />
          <ProFormRadio.Group
            name="available"
            label="是否可用"
            options={[
              { label: '启用', value: true },
              { label: '停用', value: false },
            ]}
            rules={[{ required: true, message: '请选择是否可用' }]}
          />
        </ProFormGroup>
        <ProFormText
          name="name"
          label="名称"
          placeholder="请输入名称"
          rules={[{ required: true, message: '请输入名称' }]}
        />
        <ProFormText.Password
          name="access_key"
          label="访问密钥ID（Access Key ID）"
          placeholder="请输入访问密钥ID"
        />
        <ProFormText.Password
          name="secret_key"
          label="秘密访问密钥（Secret Access Key）"
          placeholder="请输入秘密访问密钥"
        />
        <ProFormSelect
          name="plugin_name"
          label="插件名称"
          placeholder="请选择插件名称"
          rules={[{ required: true, message: '请选择插件名称' }]}
          options={pluginList.map((item) => ({ label: item, value: item }))}
        />
        <ProFormTextArea name="remarks" label="备注" placeholder="请输入备注" />
      </ModalForm>
    </>
  );
};

export default Account;
