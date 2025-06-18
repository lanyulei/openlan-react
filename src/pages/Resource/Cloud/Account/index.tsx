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
import { Button, Dropdown, Input, MenuProps, message, Modal, SelectProps, Space, Tag } from 'antd';
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
import { getModels } from '@/services/resource/model';
import { getLogicResourceList } from '@/services/resource/logicResource';
import { getLogicHandleList } from '@/services/resource/logicHandle';

const Account: FC = () => {
  const [form] = Form.useForm();
  const [syncForm] = Form.useForm();
  const actionRef = useRef<ActionType>();
  const searchInputRef = useRef(null);
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();
  const [syncModal, setSyncModal] = React.useState(false);
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
    regions: [],
    remarks: '',
  });
  const [modalStatus, setModalStatus] = React.useState('create');
  const [pluginList, setPluginList] = React.useState<any[]>([]);
  const [modelList, setModelList] = React.useState<any[]>([]);
  const [logicResourceList, setLogicResourceList] = React.useState<any[]>([]);
  const [logicHandleList, setLogicHandleList] = React.useState<any[]>([]);

  const handleCreate = () => {
    setModalStatus('create');
    setModalVisible(true);
  };
  const getMenuItems = (record: any): MenuProps['items'] => [
    {
      label: (
        <a
          onClick={() => {
            setAccountForm(record);
            setSyncModal(true);
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
            form.setFieldsValue(record);
            setAccountForm(record);
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
  const handleReload = () => {
    actionRef.current?.reload();
  };

  const options: SelectProps['options'] = [];
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

  useEffect(() => {
    if (syncModal) {
      syncForm.setFieldsValue({
        region: undefined,
        model_id: undefined,
        logic_resource_id: undefined,
        logic_handle_id: undefined,
      });
    }
  }, [syncModal]);

  useEffect(() => {
    (async () => {
      const res = await getLogicResourceList(
        {
          not_page: true,
        },
        {},
      );
      setLogicResourceList(res.data?.list || []);

      const _modelRes = await getModels({});
      setModelList(_modelRes.data);

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
              regions: [],
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
          tooltip="可用区域 ID，支持在操作云产品时候，指定在哪个区域进行操作。"
          name="regions"
          label="可用区域 ID"
          mode="tags"
          style={{ width: '100%' }}
          fieldProps={{
            tokenSeparators: [','],
          }}
          options={options}
          placeholder="请输入区域 ID"
        />
        <ProFormSelect
          name="plugin_name"
          label="插件名称"
          placeholder="请选择插件名称"
          rules={[{ required: true, message: '请选择插件名称' }]}
          options={pluginList.map((item) => ({
            label: item.name,
            value: item.name,
          }))}
        />
        <ProFormTextArea name="remarks" label="备注" placeholder="请输入备注" />
      </ModalForm>

      <ModalForm
        title="资源同步"
        form={syncForm}
        autoFocusFirstInput
        modalProps={{
          destroyOnHidden: true,
        }}
        onFinish={async (values) => {
          const _data = {
            ...values,
            cloud_account_id: accountForm.id,
          };
          await syncCloudResource(_data, {});
          return true;
        }}
        onOpenChange={setSyncModal}
        open={syncModal}
        width={600}
      >
        <ProFormSelect
          mode="multiple"
          tooltip="Region 是云服务提供商在全球不同地理位置设立的数据中心区域，用于就近提供云服务。阿里云示例：cn-hangzhou（杭州区域）。"
          name="region"
          label="区域 ID"
          style={{ width: '100%' }}
          options={accountForm.regions?.map((region: string) => ({
            label: region,
            value: region,
          }))}
          placeholder="请选择区域 ID"
        />
        <ProFormSelect
          tooltip="目标模型，将数据导入到哪个模型中。"
          name="model_id"
          label="模型"
          style={{ width: '100%' }}
          options={modelList?.map((item) => ({
            label: item.name,
            value: item.id,
            options: item.models?.map((field: any) => ({
              label: field.name,
              value: field.id,
            })),
          }))}
          placeholder="请选择目标模型"
          onChange={async (_, option: any) => {
            if (option?.value) {
              for (let group of modelList) {
                for (let model of group.models || []) {
                  if (option?.value === model.id) {
                    // 自动填充 logic_resource_id 字段
                    if (model?.logic_resource_id && model?.logic_resource_id !== '') {
                      syncForm.setFieldsValue({
                        ...syncForm.getFieldsValue(),
                        logic_resource_id: model?.logic_resource_id,
                      });

                      const _res = await getLogicHandleList(
                        model?.logic_resource_id,
                        {
                          not_page: true,
                        },
                        {},
                      );
                      setLogicHandleList(_res.data?.list || []);
                    } else {
                      syncForm.setFieldsValue({
                        ...syncForm.getFieldsValue(),
                        logic_resource_id: undefined,
                      });
                    }
                  }
                }
              }
            }
          }}
        />
        <ProFormSelect
          tooltip="逻辑资源对应云产品资源。"
          name="logic_resource_id"
          label="逻辑资源"
          style={{ width: '100%' }}
          options={logicResourceList?.map((item: any) => ({
            label: (
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div>{item.name}</div>
                <div style={{ color: '#909399' }}>{item.title}</div>
              </div>
            ),
            value: item.id,
          }))}
          placeholder="请选择逻辑资源"
          onChange={async (_, option: any) => {
            // 这里 option.value 即为选中的逻辑资源 id
            if (option?.value) {
              const _res = await getLogicHandleList(
                option?.value,
                {
                  not_page: true,
                },
                {},
              );
              setLogicHandleList(_res.data?.list || []);
              // 同步表单字段
              syncForm.setFieldsValue({
                ...syncForm.getFieldsValue(),
                logic_handle_id: undefined, // 选择逻辑资源后重置逻辑操作
              });
            } else {
              setLogicHandleList([]);
              syncForm.setFieldsValue({
                ...syncForm.getFieldsValue(),
                logic_handle_id: undefined,
              });
            }
          }}
        />
        <ProFormSelect
          key={logicHandleList.length}
          tooltip="逻辑操作对应云产品 API 操作。"
          name="logic_handle_id"
          label="逻辑操作"
          style={{ width: '100%' }}
          options={logicHandleList?.map((item: any) => ({
            label: (
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div>{item.name}</div>
                <div style={{ color: '#909399' }}>{item.title}</div>
              </div>
            ),
            value: item.id,
          }))}
          placeholder="请选择逻辑操作"
        />
      </ModalForm>
    </>
  );
};

export default Account;
