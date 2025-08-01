import React, { FC, useEffect, useRef } from 'react';
import {
  ActionType,
  DrawerForm,
  PageContainer,
  ProFormList,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import styles from '@/pages/Resource/Cloud/Account/index.less';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  RightSquareOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Checkbox, Col, Flex, Form, Input, message, Modal, Row } from 'antd';
import {
  createTemplate,
  deleteTemplate,
  templateList,
  updateTemplate,
} from '@/services/task/template';
import { variableList } from '@/services/task/variable';
import { inventoryList } from '@/services/task/inventory';
import MonacoEditor from '@/components/MonacoEditor';

interface KeyValue {
  key: string;
  value: string;
  is_prompt: boolean; // 是否提示
}

interface TemplateData {
  id?: string | undefined;
  name: string;
  types: 'shell' | 'playbook'; // 模板类型
  content: string; // 模板内容
  variable_id: string | undefined; // 绑定变量 ID
  variable?: KeyValue[]; // 变量内容
  args?: KeyValue[]; // 参数列表
  limit?: string[]; // 限制列表
  tags?: string[]; // 标签列表
  skip_tags?: string[]; // 跳过标签列表
  remarks?: string; // 备注
}

const Template: FC = () => {
  const [form] = Form.useForm();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();
  const actionRef = useRef<ActionType>();
  const [query, setQuery] = React.useState<any>({
    name: undefined,
  });
  const [modalStatus, setModalStatus] = React.useState<string>('create'); // create | edit
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [templateForm, setTemplateForm] = React.useState<TemplateData>({
    id: undefined,
    name: '',
    types: 'shell',
    content: '',
    variable_id: undefined,
  });
  const [variables, setVariables] = React.useState<any[]>([]);
  const [inventorys, setInventorys] = React.useState<any[]>([]);

  const handleReload = async () => {
    await actionRef?.current?.reload();
  };

  const getVariableList = async () => {
    const res = await variableList({
      not_page: true,
    });
    setVariables(res.data?.list || []);
  };

  const getInventoryList = async () => {
    const res = await inventoryList({
      not_page: true,
    });
    setInventorys(res.data?.list || []);
  };

  const getList = async () => {
    const res = await templateList(query);
    return res.data || {};
  };

  useEffect(() => {
    if (modalVisible && templateForm) {
      form.setFieldsValue(templateForm);
    } else {
      setTemplateForm({
        name: '',
        types: 'shell',
        content: '',
        variable_id: undefined,
        variable: [],
        args: [],
        limit: [],
        tags: [],
        skip_tags: [],
      });
    }
  }, [modalVisible]);

  useEffect(() => {
    (async () => {
      await getVariableList();
      await getInventoryList();
    })();
  }, []);

  return (
    <>
      {modalContextHolder}
      {messageContextHolder}
      <PageContainer content="任务模板是通过 Playbook（YAML 格式）定义自动化流程，或使用 shell/bash 模块执行命令行任务，实现配置管理和批量操作。">
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
                if (record.types === 'shell') return 'Shell';
                if (record.types === 'playbook') return 'Playbook';
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
              width: 210,
              render: (_: any, record: any) => [
                <a
                  style={{ marginLeft: 10 }}
                  key="execute"
                  onClick={() => {
                    console.log(123);
                  }}
                >
                  <RightSquareOutlined /> 执行
                </a>,
                <a
                  style={{ marginLeft: 10 }}
                  key="edit"
                  onClick={() => {
                    const _data = {
                      ...record,
                      variable_id:
                        record?.variable_id === '' ? undefined : record.variable_id || undefined,
                    };
                    setTemplateForm(_data);
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
                      content: '确定是否删除此任务模板？',
                      okText: '确认',
                      cancelText: '取消',
                      onOk: async () => {
                        await deleteTemplate(record.id);
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
              key="addTemplate"
              type="primary"
              icon={<PlusOutlined />}
            >
              新建任务模板
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

      <DrawerForm
        title={modalStatus === 'create' ? '新建任务模板' : '编辑任务模板'}
        form={form}
        autoFocusFirstInput
        drawerProps={{
          destroyOnHidden: true,
          onClose: () => {
            form.setFieldsValue(undefined);
          },
        }}
        onFinish={async (values) => {
          const _data = {
            ...values,
            content: templateForm.content,
          };

          if (modalStatus === 'create') {
            // 调用创建接口
            await createTemplate(_data);
            await handleReload();
            messageApi.success('创建成功');
          } else if (modalStatus === 'edit') {
            // 调用更新接口
            await updateTemplate(templateForm?.id, _data, {});
            await handleReload();
            messageApi.success('更新成功');
          }

          return true;
        }}
        open={modalVisible}
        onOpenChange={(visible) => {
          setModalVisible(visible);
        }}
        width={680}
        onValuesChange={(_, allValues) => setTemplateForm({ ...templateForm, ...allValues })}
      >
        <Row gutter={15}>
          <Col span={12}>
            <ProFormText
              name="name"
              label="名称"
              placeholder="请输入任务模板名称"
              rules={[{ required: true, message: '请输入名称' }]}
            />
          </Col>
          <Col span={12}>
            <ProFormSelect
              name="types"
              label="类型"
              options={[
                { label: 'Shell', value: 'shell' },
                { label: 'Playbook', value: 'playbook' },
              ]}
              placeholder="请选择类型"
              rules={[{ required: true, message: '请选择类型' }]}
              fieldProps={{
                value: templateForm.types,
                onChange: (value) =>
                  setTemplateForm({ ...templateForm, types: value as 'shell' | 'playbook' }),
              }}
            />
          </Col>
        </Row>
        {templateForm.types === 'playbook' && (
          <ProFormSelect
            label="主机清单"
            name="inventory"
            placeholder="请选择主机清单"
            options={inventorys.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
            rules={[{ required: true, message: '请选择主机清单' }]}
          />
        )}
        {templateForm.types === 'shell' && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ marginBottom: 8 }}>内容</div>
            <MonacoEditor
              codeType={templateForm.types}
              value={templateForm.content}
              onChange={(value: string) => {
                setTemplateForm({
                  ...templateForm,
                  content: value,
                });
              }}
            />
          </div>
        )}
        <ProFormSelect
          label="变量组"
          name="variable_id"
          placeholder="请选择变量组"
          options={variables.map((item) => ({
            label: (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{item.name}</span>
                <span style={{ color: '#888' }}>{item.types}</span>
              </div>
            ),
            value: item.id,
          }))}
        />
        <ProFormList
          name="variable"
          label="变量"
          creatorButtonProps={{
            position: 'bottom',
            creatorButtonText: '新增变量',
          }}
          itemRender={({ listDom, action }) => (
            <Flex align="center" gap={5}>
              <div style={{ width: '100%' }}>{listDom}</div>
              <div>{action}</div>
            </Flex>
          )}
        >
          <Flex gap={15}>
            <ProFormText
              style={{ width: '100%' }}
              name="key"
              placeholder="请输入键"
              rules={[
                { required: true, message: '请输入键' },
                {
                  pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
                  message: '字母开头，字母、数字、下划线',
                },
              ]}
            />
            <ProFormText
              style={{ width: '100%' }}
              name="value"
              placeholder="请输入值"
              rules={[{ required: true, message: '请输入值' }]}
            />
            <Form.Item style={{ width: 230 }} valuePropName="checked" name="is_prompt">
              <Checkbox>是否提示</Checkbox>
            </Form.Item>
          </Flex>
        </ProFormList>
        <ProFormList
          name="args"
          label="额外参数"
          creatorButtonProps={{
            position: 'bottom',
            creatorButtonText: '新增额外参数',
          }}
          itemRender={({ listDom, action }) => (
            <Flex align="center" gap={5}>
              <div style={{ width: '100%' }}>{listDom}</div>
              <div>{action}</div>
            </Flex>
          )}
        >
          <Flex gap={15}>
            <ProFormText
              style={{ width: '100%' }}
              name="key"
              placeholder="请输入键"
              rules={[
                { required: true, message: '请输入键' },
                {
                  pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
                  message: '字母开头，字母、数字、下划线',
                },
              ]}
            />
            <ProFormText
              style={{ width: '100%' }}
              name="value"
              placeholder="请输入值"
              rules={[{ required: true, message: '请输入值' }]}
            />
            <Form.Item style={{ width: 230 }} valuePropName="checked" name="is_prompt">
              <Checkbox>是否提示</Checkbox>
            </Form.Item>
          </Flex>
        </ProFormList>
        <ProFormSelect
          label="限制"
          name="limit"
          placeholder="请输入限制"
          tooltip="限制 Playbook 仅在指定的主机或组上执行"
          mode="tags"
        />
        <ProFormSelect
          label="标签"
          name="tags"
          placeholder="请输入标签"
          tooltip="仅执行带有指定标签的任务"
          mode="tags"
        />
        <ProFormSelect
          label="跳过标签"
          name="skip_tags"
          placeholder="请输入跳过标签"
          tooltip="跳过带有指定标签的任务"
          mode="tags"
        />
        <ProFormTextArea label="备注" name="remarks" placeholder="请输入备注" />
      </DrawerForm>
    </>
  );
};

export default Template;
