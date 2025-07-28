import React, { FC, useEffect, useRef } from 'react';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProFormList,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import styles from '@/pages/Resource/Cloud/Account/index.less';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Flex, Form, Input, message, Modal, Row } from 'antd';
import {
  createVariable,
  deleteVariable,
  updateVariable,
  variableList,
} from '@/services/task/variable';

const Variable: FC = () => {
  const [form] = Form.useForm();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();
  const actionRef = useRef<ActionType>();
  const [query, setQuery] = React.useState<any>({
    name: undefined,
  });
  const [modalStatus, setModalStatus] = React.useState<string>('create'); // create | edit
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = React.useState<any>(undefined);

  const handleReload = async () => {
    await actionRef?.current?.reload();
  };

  const getList = async () => {
    const res = await variableList(query);
    return res.data || {};
  };

  useEffect(() => {
    if (modalVisible) {
      form.setFieldsValue(currentRecord);
    } else {
      setCurrentRecord(undefined);
    }
  }, [modalVisible]);

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
                    const _data = JSON.parse(JSON.stringify(record));
                    // 处理 additional 和 environment 字段
                    _data.additional = Object.entries(_data.additional || {}).map(
                      ([key, value]) => ({ key, value }),
                    );
                    _data.environment = Object.entries(_data.environment || {}).map(
                      ([key, value]) => ({ key, value }),
                    );
                    setCurrentRecord(_data);
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
                      content: '确定是否删除此变量？',
                      okText: '确认',
                      cancelText: '取消',
                      onOk: async () => {
                        await deleteVariable(record.id);
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
              key="addStepAction"
              type="primary"
              icon={<PlusOutlined />}
            >
              新建变量
            </Button>,
            <Input
              key="search"
              placeholder="请输入名称"
              allowClear
              style={{ width: 260 }}
              onChange={(e) => {
                if (e.target.value === '') {
                  setQuery({ ...query, fieldSelector: undefined });
                } else {
                  setQuery({ ...query, fieldSelector: 'metadata.name=' + e.target.value });
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
        title="新建表单"
        form={form}
        autoFocusFirstInput
        modalProps={{
          destroyOnHidden: true,
          onCancel: () => {
            form.setFieldsValue(undefined);
          },
        }}
        onFinish={async (values) => {
          const _data = JSON.parse(JSON.stringify(values));
          let additional: any = {};
          for (const item of _data.additional || []) {
            additional[item.key] = item.value;
          }

          let environment: any = {};
          for (const item of _data.environment || []) {
            environment[item.key] = item.value;
          }

          _data.additional = additional;
          _data.environment = environment;

          if (modalStatus === 'create') {
            // 调用创建接口
            await createVariable(_data);
            await handleReload();
            messageApi.success('创建成功');
          } else if (modalStatus === 'edit') {
            // 调用更新接口
            await updateVariable(currentRecord.id, _data, {});
            await handleReload();
            messageApi.success('更新成功');
          }

          return true;
        }}
        open={modalVisible}
        onOpenChange={(visible) => {
          setModalVisible(visible);
          if (!visible) {
            form.resetFields();
          }
        }}
        width={650}
      >
        <Row gutter={16}>
          <Col span={24}>
            <ProFormText
              name="name"
              label="名称"
              placeholder="请输入变量名称"
              rules={[{ required: true, message: '请输入名称' }]}
            />
          </Col>
          {/*<Col span={12}>*/}
          {/*  <ProFormSelect*/}
          {/*    label="类型"*/}
          {/*    name="types"*/}
          {/*    initialValue="variables"*/}
          {/*    options={[*/}
          {/*      { label: '变量', value: 'variables' },*/}
          {/*      { label: '秘密', value: 'secrets' },*/}
          {/*    ]}*/}
          {/*    rules={[{ required: true, message: '请选择类型' }]}*/}
          {/*    placeholder="请选择变量类型"*/}
          {/*  />*/}
          {/*</Col>*/}
        </Row>
        <ProFormList
          name="additional"
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
                  message: '只能是字母、数字、下划线，以字母开头',
                },
              ]}
            />
            <ProFormText
              style={{ width: '100%' }}
              name="value"
              placeholder="请输入值"
              rules={[{ required: true, message: '请输入值' }]}
            />
          </Flex>
        </ProFormList>
        <ProFormList
          name="environment"
          label="环境变量"
          creatorButtonProps={{
            position: 'bottom',
            creatorButtonText: '新增环境变量',
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
                  message: '只能是字母、数字、下划线，以字母开头',
                },
              ]}
            />
            <ProFormText
              style={{ width: '100%' }}
              name="value"
              placeholder="请输入值"
              rules={[{ required: true, message: '请输入值' }]}
            />
          </Flex>
        </ProFormList>
        <ProFormTextArea label="备注" name="remarks" placeholder="请输入备注" />
      </ModalForm>
    </>
  );
};

export default Variable;
