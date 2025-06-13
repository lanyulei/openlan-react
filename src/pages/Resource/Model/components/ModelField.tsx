import {
  CaretDownOutlined,
  DeleteOutlined,
  EyeOutlined,
  MinusCircleOutlined,
  MoreOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  DrawerForm,
  EditableProTable,
  ModalForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
  ProFormTimePicker,
} from '@ant-design/pro-components';
import {
  Button,
  Col,
  Dropdown,
  Empty,
  Flex,
  Form,
  Input,
  MenuProps,
  message,
  Modal,
  Row,
} from 'antd';
import { FC, useEffect, useRef, useState } from 'react';
import styles from './ModelField.less';
import modelStyles from '../../common.less';
import { getUserList } from '@/services/system/user';
import { useParams } from 'react-router-dom';
import {
  createFieldGroup,
  deleteFieldGroup,
  updateFieldGroup,
} from '@/services/resource/fieldGroup';
import {
  createModelField,
  deleteModelField,
  getModelFieldList,
  updateModelField,
} from '@/services/resource/field';
import FieldPreview from './FieldPreview';
import {
  FieldType,
  FieldTypeBoolean,
  FieldTypeDate,
  FieldTypeDatetime,
  FieldTypeEnum,
  FieldTypeEnumMulti,
  FieldTypeFloat,
  FieldTypeList,
  FieldTypeLongString,
  FieldTypeNumber,
  FieldTypeShortString,
  FieldTypeTable,
  FieldTypeTime,
  FieldTypeTimeZone,
  FieldTypeUser,
} from '../variable';

interface FieldForm {
  id?: string | undefined;
  name?: string;
  group_id?: string | undefined;
  type?: FieldType;
  options?: any;
  is_edit?: boolean;
  is_required?: boolean;
  is_list?: boolean;
  placeholder?: string;
  desc?: string;
  order?: number;
  span?: number;
  model_id?: string;
}

interface LabelValue {
  Label: string;
  Value: FieldType;
}

const baseFieldTypeMap: LabelValue[] = [
  { Label: '短字符串', Value: FieldTypeShortString },
  { Label: '数字', Value: FieldTypeNumber },
  { Label: '浮点数', Value: FieldTypeFloat },
  { Label: '枚举', Value: FieldTypeEnum },
  { Label: '枚举多选', Value: FieldTypeEnumMulti },
  { Label: '日期', Value: FieldTypeDate },
  { Label: '时间', Value: FieldTypeTime },
  { Label: '日期时间', Value: FieldTypeDatetime },
  { Label: '长字符串', Value: FieldTypeLongString },
  { Label: '用户', Value: FieldTypeUser },
  { Label: '时区', Value: FieldTypeTimeZone },
  { Label: '布尔值', Value: FieldTypeBoolean },
  { Label: '列表', Value: FieldTypeList },
  { Label: '表格', Value: FieldTypeTable },
];

const initOptions = {
  options: [],
  regexp: undefined,
  min: undefined,
  max: undefined,
  default: undefined,
};

type DataSourceType = {
  id: string;
  index: number;
  label: string;
  value: string;
};

const ModelField: FC = () => {
  interface FieldPreview {
    showDrawer: () => void;
  }

  const fieldPreviewRef = useRef<FieldPreview>(null);
  const [modal, modalContextHolder] = Modal.useModal();
  const [messageApi, messageContextHolder] = message.useMessage();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [mgForm] = Form.useForm();
  const [fieldForm, setFieldForm] = useState<FieldForm>({
    id: undefined,
    name: '',
    group_id: undefined,
    type: FieldTypeShortString,
    options: {
      options: [], // 初始化options数组
      columns: [],
    },
    is_edit: true,
    is_required: false,
    is_list: false,
    placeholder: '',
    desc: '',
    order: 1,
    span: 4,
    model_id: id,
  });
  const [fieldVisit, setFieldVisit] = useState(false);
  const [drawerStatus, setDrawerStatus] = useState('create');
  const [userList, setUserList] = useState<any[]>([]);

  const [fieldGroupVisit, setFieldGroupVisit] = useState(false);
  const [fieldGroupForm, setFieldGroupForm] = useState({
    id: undefined,
    name: '',
    desc: '',
    order: 1,
    model_id: id,
  });
  const [fieldGroupStatus, setFieldGroupStatus] = useState('create');
  const [fieldList, setFieldList] = useState<any[]>([]);
  const [fieldName, setFieldName] = useState<string>('');

  const [dataSource, setDataSource] = useState<readonly DataSourceType[]>([]);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

  const handleRestFieldForm = async (groupId: string | undefined) => {
    const _data = {
      id: undefined,
      name: '',
      group_id: groupId,
      type: FieldTypeShortString,
      options: {
        options: [],
        columns: [],
      },
      is_edit: true,
      is_required: false,
      is_list: false,
      placeholder: '',
      desc: '',
      order: 1,
      span: 4,
      model_id: id,
    };
    setFieldForm(_data);
    form.setFieldsValue(_data);
  };

  // 修改handleChange函数
  const handleChange = (index: number, field: 'id' | 'value', val: string) => {
    setFieldForm((prev) => {
      const newOptions = [...(prev.options?.options || [])]; // 添加空数组回退
      if (newOptions[index]) {
        newOptions[index][field] = val;
      }
      return {
        ...prev,
        options: { ...prev.options, options: newOptions },
      };
    });
  };

  const getUsers = async () => {
    const res = await getUserList({
      not_page: true,
    });
    const { data } = res;
    setUserList(data?.list);
  };

  const getModelFields = async () => {
    const _res = await getModelFieldList(id, {
      name: fieldName,
    });
    const { data } = _res;
    setFieldList(data);
  };

  const getItems = (item: any): MenuProps['items'] => [
    {
      label: <div>编辑分组</div>,
      key: '0',
      onClick: () => {
        setFieldGroupForm({
          id: item.id,
          name: item.name,
          desc: item.desc,
          order: item.order,
          model_id: item.model_id,
        });
        setFieldGroupStatus('edit');
        setFieldGroupVisit(true);
      },
    },
    {
      label: <div>删除分组</div>,
      key: '1',
      onClick: () => {
        modal.confirm({
          title: '删除分组',
          content: '确定要删除此分组吗？',
          okText: '确认',
          cancelText: '取消',
          onOk: async () => {
            await deleteFieldGroup(item.id);
            await getModelFields();
            messageApi.success('分组删除成功');
            return true;
          },
        });
      },
    },
  ];

  useEffect(() => {
    if (fieldGroupVisit) {
      mgForm.setFieldsValue(fieldGroupForm);
    }
  }, [fieldGroupVisit]);

  useEffect(() => {
    getModelFields();
  }, []);

  return (
    <>
      {modalContextHolder}
      {messageContextHolder}
      <div>
        <Flex gap={10} wrap>
          <Button
            type="primary"
            onClick={async () => {
              getUsers();
              await handleRestFieldForm(undefined);
              setDrawerStatus('create');
              setFieldVisit(true);
            }}
          >
            <PlusOutlined />
            新建字段
          </Button>
          <Button
            onClick={() => {
              setFieldGroupForm({
                id: undefined,
                name: '',
                desc: '',
                order: 1,
                model_id: '',
              });
              setFieldGroupStatus('create');
              setFieldGroupVisit(true);
            }}
          >
            <PlusOutlined />
            新建分组
          </Button>
          <Button
            onClick={() => {
              fieldPreviewRef.current?.showDrawer();
            }}
          >
            <EyeOutlined />
            字段预览
          </Button>
          <Input
            placeholder="请输入字段名"
            style={{ width: '300px' }}
            suffix={<SearchOutlined />}
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            onPressEnter={getModelFields}
          />
        </Flex>
        <>
          {Array.isArray(fieldList) && fieldList.length > 0 ? (
            fieldList.map((groupItem, groupIndex) => (
              <div key={groupItem.id} style={{ marginTop: groupIndex === 0 ? '12px' : '15px' }}>
                <div className={modelStyles.modelGroup}>
                  <CaretDownOutlined />
                  <span className={modelStyles.modelGroupName}>
                    {groupItem.name} ( {groupItem.fields?.length || 0} ){''}
                  </span>
                  <Dropdown menu={{ items: getItems(groupItem) }} trigger={['click']}>
                    <MoreOutlined className={modelStyles.modelGroupMoreIcon} />
                  </Dropdown>
                </div>
                {!groupItem.fields || groupItem.fields?.length === 0 ? (
                  <div className={modelStyles.modelItem}>
                    <div
                      className={modelStyles.modelAdd}
                      style={{ display: 'block' }}
                      onClick={async () => {
                        await handleRestFieldForm(groupItem.id);
                        setDrawerStatus('create');
                        setFieldVisit(true);
                      }}
                    >
                      <PlusOutlined />
                      <span style={{ marginLeft: '5px' }}>新建字段</span>
                    </div>
                  </div>
                ) : (
                  <div className={modelStyles.modelItem}>
                    {groupItem.fields?.map((fieldItem: any) => (
                      <div
                        className={modelStyles.modelValue}
                        key={fieldItem.id}
                        style={{
                          backgroundColor: '#f5f7fa',
                          border: '1px solid #eaeaea',
                          borderRadius: '2px',
                        }}
                      >
                        <div
                          className={modelStyles.modelInfo}
                          style={{
                            paddingLeft: '3px',
                            paddingRight: '3px',
                          }}
                          onClick={() => {
                            const _data = {
                              ...fieldItem,
                              options: {
                                ...fieldItem.options,
                                options: fieldItem.options?.options || [],
                              },
                            };

                            setDataSource(fieldItem.options?.columns || []);

                            setFieldForm(_data);
                            form.setFieldsValue(_data);
                            setDrawerStatus('edit');
                            setFieldVisit(true);
                          }}
                        >
                          <div className={modelStyles.modelDetails}>
                            <div className={modelStyles.modelName}>{fieldItem.name}</div>
                            <div className={modelStyles.modelDescription}>
                              {fieldItem.desc !== '' ? fieldItem.desc : '暂无描述'}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`${modelStyles.modelEdit} ${styles.fieldDelete}`}
                          onClick={() => {
                            modal.confirm({
                              title: '删除字段',
                              content: '确定要删除此模型字段吗？',
                              okText: '确认',
                              cancelText: '取消',
                              onOk: async () => {
                                await deleteModelField(fieldItem.id);
                                await getModelFields();
                                messageApi.success('分组删除成功');
                                return true;
                              },
                            });
                          }}
                        >
                          <DeleteOutlined />
                        </div>
                      </div>
                    ))}
                    <div
                      className={modelStyles.modelAdd}
                      onClick={async () => {
                        await handleRestFieldForm(groupItem.id);
                        setDrawerStatus('create');
                        setFieldVisit(true);
                      }}
                    >
                      <PlusOutlined />
                      <span style={{ marginLeft: '5px' }}>新建字段</span>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <Empty
              style={{
                height: '120px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无字段数据"
            />
          )}
        </>

        <DrawerForm
          form={form}
          title={drawerStatus === 'create' ? '新建字段' : '编辑字段'}
          width={800}
          autoFocusFirstInput
          drawerProps={{
            destroyOnHidden: true,
            onClose: () => {
              form?.setFieldsValue({
                options: initOptions,
                columns: [],
              });
            },
          }}
          onFinish={async () => {
            const _data = {
              ...fieldForm,
              options: {
                ...fieldForm.options,
                options: fieldForm.options?.options || [],
                columns: dataSource || [],
              },
            };

            if (drawerStatus === 'create') {
              setFieldForm(_data);
              await createModelField(_data);
              await getModelFields();
              setFieldVisit(false);
              messageApi.success('字段创建成功');
            } else if (drawerStatus === 'edit') {
              if (!_data.id) {
                messageApi.error('字段创建失败');
                return false;
              }

              setFieldForm(_data);

              await updateModelField(_data.id, _data);
              await getModelFields();
              setFieldVisit(false);
              messageApi.success('更新字段成功');
            }
            form?.resetFields();
            form?.setFieldsValue({
              options: initOptions,
            });
          }}
          onValuesChange={(_, values) => {
            setFieldForm((prev) => ({
              ...prev,
              ...values,
            }));
          }}
          initialValues={fieldForm}
          onOpenChange={setFieldVisit}
          open={fieldVisit}
        >
          <ProFormText
            name="key"
            label="字段标识"
            placeholder="请输入字段标识"
            rules={[
              { required: true, message: '标识不能为空' },
              {
                pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
                message: '只能包含字母、数字、下划线，且不能以数字开头',
              },
            ]}
          />
          <ProFormText
            name="name"
            label="字段名称"
            placeholder="请输入字段名称"
            rules={[{ required: true, message: '名称不能为空' }]}
          />
          <ProFormSelect
            name="group_id"
            label="所属分组"
            options={fieldList.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
            rules={[{ required: true, message: '请选择分组' }]}
            placeholder="请选择分组"
          />
          <ProFormSelect
            name="type"
            label="字段类型"
            options={baseFieldTypeMap.map((item) => ({
              label: item.Label,
              value: item.Value,
            }))}
            rules={[{ required: true, message: '请选择字段类型' }]}
            placeholder="请选择字段类型"
            onChange={() => {
              form.setFieldsValue({
                options: initOptions,
              });
            }}
          />
          <div className={styles.modelFieldOptions}>
            {fieldForm?.type === FieldTypeShortString || fieldForm?.type === FieldTypeLongString ? (
              <>
                <ProFormTextArea
                  name={['options', 'regexp']}
                  label="正则表达式"
                  placeholder="请输入验证正则表达式"
                />
                {fieldForm?.type === FieldTypeLongString ? (
                  <ProFormTextArea
                    name={['options', 'default']}
                    label="默认值"
                    placeholder="请输入默认值"
                  />
                ) : (
                  <ProFormText
                    name={['options', 'default']}
                    label="默认值"
                    placeholder="请输入默认值"
                  />
                )}
              </>
            ) : fieldForm?.type === FieldTypeNumber ? (
              <>
                <ProFormDigit name={['options', 'min']} label="最小值" placeholder="请输入最小值" />
                <ProFormDigit name={['options', 'max']} label="最大值" placeholder="请输入最大值" />
                <ProFormDigit
                  name={['options', 'default']}
                  label="默认值"
                  placeholder="请输入默认值"
                />
              </>
            ) : fieldForm?.type === FieldTypeFloat ? (
              <>
                <ProFormDigit
                  name={['options', 'min']}
                  label="最小值"
                  placeholder="请输入最小值"
                  fieldProps={{ step: 0.01 }}
                />
                <ProFormDigit
                  name={['options', 'max']}
                  label="最大值"
                  placeholder="请输入最大值"
                  fieldProps={{ step: 0.01 }}
                />
                <ProFormDigit
                  name={['options', 'default']}
                  label="默认值"
                  placeholder="请输入默认值"
                  fieldProps={{ step: 0.01 }}
                />
              </>
            ) : fieldForm?.type === FieldTypeEnum || fieldForm?.type === FieldTypeEnumMulti ? (
              <>
                <div className={styles.enumSection}>
                  <h4>枚举值</h4>
                  <Form.List name={['options', 'options']}>
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                          <Flex
                            key={key}
                            gap={8}
                            style={{
                              width: '100%', // 添加宽度设置
                            }}
                            className={styles.enumItem}
                          >
                            <ProFormText
                              {...restField}
                              name={[name, 'id']}
                              placeholder="请输入ID"
                              style={{ flex: 1, width: '100%' }}
                              fieldProps={{
                                onChange: (e) => handleChange(name, 'id', e.target.value),
                              }}
                            />
                            <ProFormText
                              {...restField}
                              name={[name, 'value']}
                              placeholder="请输入值"
                              style={{ flex: 1, width: '100%' }}
                              fieldProps={{
                                onChange: (e) => handleChange(name, 'value', e.target.value),
                              }}
                            />
                            <Button
                              type="link"
                              danger
                              onClick={() => remove(name)}
                              icon={<MinusCircleOutlined />}
                            />
                          </Flex>
                        ))}
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                          新增枚举值
                        </Button>
                      </>
                    )}
                  </Form.List>
                </div>

                <div className={styles.defaultSection}>
                  <h4>默认值设置</h4>
                  <ProFormSelect
                    name={['options', 'default']}
                    placeholder="请选择默认值"
                    mode={fieldForm?.type === FieldTypeEnumMulti ? 'multiple' : undefined} // 动态设置多选模式
                    options={
                      fieldForm?.options?.options
                        ?.filter((opt: { id: any; value: any }) => opt?.id && opt?.value)
                        .map((opt: { id: any; value: any }) => ({
                          label: opt.value,
                          value: opt.id,
                        })) || []
                    }
                    fieldProps={{
                      loading: !fieldForm.options?.options,
                    }}
                  />
                </div>
              </>
            ) : fieldForm?.type === FieldTypeDate ? (
              <>
                <ProFormDatePicker
                  name={['options', 'default']}
                  label="默认值"
                  placeholder="请选择日期"
                  fieldProps={{
                    format: 'YYYY-MM-DD',
                    style: { width: '100%' },
                  }}
                />
              </>
            ) : fieldForm?.type === FieldTypeTime ? (
              <>
                <ProFormTimePicker
                  name={['options', 'default']}
                  label="默认值"
                  placeholder="请选择时间"
                  fieldProps={{
                    format: 'HH:mm:ss',
                    style: { width: '100%' },
                  }}
                />
              </>
            ) : fieldForm?.type === FieldTypeDatetime ? (
              <>
                <ProFormDatePicker
                  name={['options', 'default']}
                  label="默认值"
                  placeholder="请选择日期时间"
                  fieldProps={{
                    showTime: true,
                    format: 'YYYY-MM-DD HH:mm:ss',
                    style: { width: '100%' },
                  }}
                />
              </>
            ) : fieldForm?.type === FieldTypeUser ? (
              <>
                <ProFormSelect
                  name={['options', 'default']}
                  label="默认用户"
                  placeholder="请选择默认用户"
                  mode="multiple"
                  options={userList.map((user) => ({
                    label: user.username,
                    value: user.id,
                  }))}
                  fieldProps={{
                    loading: !userList.length,
                  }}
                />
              </>
            ) : fieldForm?.type === FieldTypeTimeZone ? (
              <>
                <ProFormText
                  name={['options', 'default']}
                  label="默认时区"
                  placeholder="请输入默认时区"
                />
              </>
            ) : fieldForm?.type === FieldTypeBoolean ? (
              <>
                <ProFormSwitch name={['options', 'default']} label="默认值" />
              </>
            ) : fieldForm?.type === FieldTypeList ? (
              <>
                <div className={styles.enumSection}>
                  <h4>列表值</h4>
                  <Form.List name={['options', 'options']}>
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                          <Flex
                            key={key}
                            gap={8}
                            style={{
                              width: '100%',
                            }}
                          >
                            <ProFormText
                              {...restField}
                              name={name}
                              placeholder="请输入值"
                              rules={[{ required: true, message: '该字段是必填项' }]}
                            />
                            <Button
                              type="link"
                              danger
                              onClick={() => remove(name)}
                              icon={<MinusCircleOutlined />}
                            />
                          </Flex>
                        ))}
                        <Button
                          type="dashed"
                          onClick={() => {
                            add();
                          }}
                          block
                          icon={<PlusOutlined />}
                        >
                          新增
                        </Button>
                      </>
                    )}
                  </Form.List>
                </div>

                <div className={styles.defaultSection}>
                  <h4>默认值设置</h4>
                  <ProFormSelect
                    name={['options', 'default']}
                    placeholder="请选择"
                    options={
                      fieldForm?.options?.options?.map((value: string) => ({
                        label: value,
                        value: value,
                      })) || []
                    }
                  />
                </div>
              </>
            ) : fieldForm?.type === FieldTypeTable ? (
              <>
                <div className={styles.defaultSection}>
                  <h4>表格设置</h4>
                  <EditableProTable<DataSourceType>
                    rowKey="id"
                    recordCreatorProps={{
                      position: 'bottom',
                      record: (index) => ({
                        id: (Math.random() * 1000000).toFixed(0),
                        index: index,
                        value: '',
                        label: '',
                      }),
                    }}
                    loading={false}
                    columns={[
                      {
                        title: '列 ID',
                        dataIndex: 'value',
                        formItemProps: () => {
                          return {
                            rules: [
                              { required: true, message: '此项为必填项' },
                              {
                                pattern: /^[A-Za-z][A-Za-z0-9_]*$/,
                                message: '只能是字母开头，且仅允许包含字母、数字、下划线',
                              },
                            ],
                          };
                        },
                      },
                      {
                        title: '列名称',
                        dataIndex: 'label',
                        formItemProps: () => {
                          return {
                            rules: [{ required: true, message: '此项为必填项' }],
                          };
                        },
                      },
                      {
                        title: '操作',
                        valueType: 'option',
                        width: 200,
                        render: (_, record, __, action) => {
                          // 获取当前记录在数据源中的索引
                          return [
                            <a key="editable" onClick={() => action?.startEditable?.(record.id)}>
                              编辑
                            </a>,
                            <a
                              key="delete"
                              onClick={() => {
                                setDataSource(dataSource.filter((item) => item.id !== record.id));
                              }}
                            >
                              删除
                            </a>,
                          ];
                        },
                      },
                    ]}
                    value={dataSource}
                    onChange={setDataSource}
                    editable={{
                      type: 'multiple',
                      editableKeys,
                      onChange: setEditableRowKeys,
                    }}
                  />
                </div>
              </>
            ) : null}
          </div>
          <Flex justify="flex-start" gap={80}>
            <ProFormSwitch name="is_edit" label="是否可编辑" />
            <ProFormSwitch name="is_required" label="是否必填" />
            <ProFormSwitch name="is_list" label="列表展示" />
          </Flex>
          <ProFormText name="placeholder" label="占位提示" placeholder="请输入占位提示" />
          <Row gutter={15}>
            <Col span={12}>
              <ProFormDigit
                name="order"
                label="排序序号"
                min={1}
                rules={[{ required: true, message: '请输入排序' }]}
              />
            </Col>
            <Col span={12}>
              <ProFormDigit
                name="span"
                label="跨度"
                min={4}
                max={24}
                rules={[{ required: true, message: '请输入宽度' }]}
              />
            </Col>
          </Row>
          <ProFormTextArea name="desc" label="字段描述" placeholder="请输入字段描述" />
        </DrawerForm>

        <ModalForm
          form={mgForm}
          title="新建分组"
          autoFocusFirstInput
          modalProps={{
            destroyOnHidden: true,
          }}
          onFinish={async () => {
            if (fieldGroupStatus === 'create') {
              await createFieldGroup(fieldGroupForm);
              setFieldGroupVisit(false);
              await getModelFields();
              messageApi.success('创建成功');
            } else if (fieldGroupStatus === 'edit') {
              if (!fieldGroupForm.id) {
                messageApi.error('创建失败');
                return false;
              }
              await updateFieldGroup(fieldGroupForm.id, fieldGroupForm);
              await getModelFields();
              setFieldGroupVisit(false);
              messageApi.success('更新成功');
            }
          }}
          onValuesChange={(_, values) => {
            setFieldGroupForm((prev) => ({
              ...prev,
              ...values,
              model_id: id,
            }));
          }}
          initialValues={fieldGroupForm}
          onOpenChange={setFieldGroupVisit}
          open={fieldGroupVisit}
        >
          <Flex gap={12} style={{ width: '100%' }} className={styles.flexWidth100}>
            <ProFormText
              name="name"
              label="名称"
              placeholder="请输入名称"
              rules={[{ required: true, message: '名称不能为空' }]}
              style={{
                flex: 1,
                width: '100%',
              }}
            />
            <ProFormDigit
              name="order"
              label="排序序号"
              min={1}
              rules={[{ required: true, message: '请输入排序' }]}
              style={{
                flex: 1,
                width: '100%',
              }}
            />
          </Flex>
          <ProFormTextArea name="desc" label="描述" placeholder="请输入描述" />
        </ModalForm>

        <FieldPreview ref={fieldPreviewRef} fieldList={fieldList} />
      </div>
    </>
  );
};

export default ModelField;
