import {
  DragSortTable,
  DrawerForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
  ProFormTimePicker,
} from '@ant-design/pro-components';
import { Col, Form, Row } from 'antd';
import React, { forwardRef, Fragment, useEffect, useImperativeHandle, useState } from 'react';
import modelStyles from '../../common.less';
import { CaretDownOutlined } from '@ant-design/icons';
import { getUserList } from '@/services/system/user';
import {
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
import styles from './FieldPreview.less';
import { createData } from '@/services/resource/data';

// 定义一个接口来描述组件的 props 类型
interface FieldPreviewProps {
  fieldList: any; // 这里使用 any 类型，可根据实际情况替换为更具体的类型
}

const FieldPreview = forwardRef<
  { showDrawer: (modelId: string | undefined, status: string | undefined) => void },
  FieldPreviewProps
>(({ fieldList }, ref) => {
  const [form] = Form.useForm();
  const [drawerVisit, setDrawerVisit] = useState(false);
  const [dataForm, setDataForm] = useState<any>();
  const [modelId, setModelId] = useState<string | undefined>(undefined);

  const [userList, setUserList] = useState<any[]>([]);
  const [fieldPreviewStatus, setFieldPreviewStatus] = useState<string | undefined>(undefined); // create | edit | undefined

  const showDrawer = (modelId: string | undefined, status: string | undefined) => {
    setFieldPreviewStatus(status);
    setDrawerVisit(true);
    setModelId(modelId);
  };

  const getUsers = async () => {
    const res = await getUserList({
      not_page: true,
    });
    const { data } = res;
    setUserList(data?.list);
  };

  useImperativeHandle<
    { showDrawer: (modelId: string | undefined, status: string | undefined) => void },
    { showDrawer: (modelId: string | undefined, status: string | undefined) => void }
  >(
    ref as React.MutableRefObject<{
      showDrawer: (modelId: string | undefined, status: string | undefined) => void;
    }> | null,
    () => ({
      showDrawer: (modelId: string | undefined, status: string | undefined) =>
        showDrawer(modelId, status),
    }),
  );

  useEffect(() => {
    (async () => {
      await getUsers();
    })();
  }, []);

  return (
    <DrawerForm
      title="字段预览"
      width={600}
      form={form}
      autoFocusFirstInput
      drawerProps={{
        destroyOnHidden: true,
      }}
      onFinish={async (values) => {
        if (fieldPreviewStatus === 'create') {
          let _data = {
            status: 'default',
            model_id: modelId,
            data: {
              ...dataForm,
              ...values,
            },
          };
          await createData(_data, {});
        } else if (fieldPreviewStatus === 'edit') {
          console.log('Editing field with values:', values);
        }
        return true;
      }}
      onOpenChange={setDrawerVisit}
      open={drawerVisit}
      onValuesChange={(_, values) => {
        setDataForm((prev: any) => ({
          ...prev,
          ...values,
        }));
      }}
    >
      {Array.isArray(fieldList) && fieldList.length > 0
        ? fieldList.map((item) => (
            <div key={item.id}>
              <div className={modelStyles.modelGroup}>
                <CaretDownOutlined />
                <span className={modelStyles.modelGroupName}>{item.name}</span>
              </div>
              <div style={{ paddingLeft: '2px' }}>
                {item.fields && item.fields?.length > 0 ? (
                  <Row gutter={15}>
                    {item.fields?.map((fieldItem: any) => (
                      <Fragment key={fieldItem.id}>
                        {fieldItem?.type === FieldTypeShortString ? (
                          <Col span={fieldItem.span}>
                            <ProFormText
                              name={fieldItem.key}
                              label={fieldItem.name}
                              placeholder={fieldItem.placeholder}
                              disabled={!fieldItem?.is_edit}
                              rules={[
                                fieldItem?.is_required && {
                                  required: true,
                                  message: `${fieldItem.name} 为必填项`,
                                },
                                {
                                  validator: async (_: any, value: string) => {
                                    if (fieldItem?.options?.regexp) {
                                      const regex = new RegExp(fieldItem?.options?.regexp);
                                      if (!regex.test(value)) {
                                        return Promise.reject(
                                          new Error('输入内容不符合指定的正则表达式'),
                                        );
                                      }
                                    }
                                    return Promise.resolve();
                                  },
                                },
                              ].filter(Boolean)}
                              initialValue={fieldItem?.options?.default}
                            />
                          </Col>
                        ) : fieldItem?.type === FieldTypeNumber ? (
                          <Col span={fieldItem.span}>
                            <ProFormDigit
                              name={fieldItem.key}
                              label={fieldItem.name}
                              placeholder={fieldItem.placeholder}
                              disabled={!fieldItem?.is_edit}
                              rules={[
                                fieldItem?.is_required && {
                                  required: true,
                                  message: `${fieldItem.name} 为必填项`,
                                },
                                fieldItem?.options?.min !== undefined && {
                                  validator: (_: any, value: number) => {
                                    if (value < fieldItem.options.min) {
                                      return Promise.reject(
                                        new Error(
                                          `${fieldItem.name} 不能小于 ${fieldItem.options.min}`,
                                        ),
                                      );
                                    }
                                    return Promise.resolve();
                                  },
                                },
                                fieldItem?.options?.max !== undefined && {
                                  validator: (_: any, value: number) => {
                                    if (value > fieldItem.options.max) {
                                      return Promise.reject(
                                        new Error(
                                          `${fieldItem.name} 不能大于 ${fieldItem.options.max}`,
                                        ),
                                      );
                                    }
                                    return Promise.resolve();
                                  },
                                },
                              ].filter(Boolean)}
                              initialValue={fieldItem?.options?.default}
                            />
                          </Col>
                        ) : fieldItem?.type === FieldTypeFloat ? (
                          <Col span={fieldItem.span}>
                            <ProFormDigit
                              name={fieldItem.key}
                              label={fieldItem.name}
                              placeholder={fieldItem.placeholder}
                              disabled={!fieldItem?.is_edit}
                              rules={[
                                fieldItem?.is_required && {
                                  required: true,
                                  message: `${fieldItem.name} 为必填项`,
                                },
                                fieldItem?.options?.min !== undefined && {
                                  validator: (_: any, value: number) => {
                                    if (value < fieldItem.options.min) {
                                      return Promise.reject(
                                        new Error(
                                          `${fieldItem.name} 不能小于 ${fieldItem.options.min}`,
                                        ),
                                      );
                                    }
                                    return Promise.resolve();
                                  },
                                },
                                fieldItem?.options?.max !== undefined && {
                                  validator: (_: any, value: number) => {
                                    if (value > fieldItem.options.max) {
                                      return Promise.reject(
                                        new Error(
                                          `${fieldItem.name} 不能大于 ${fieldItem.options.max}`,
                                        ),
                                      );
                                    }
                                    return Promise.resolve();
                                  },
                                },
                              ].filter(Boolean)}
                              initialValue={fieldItem?.options?.default}
                              fieldProps={{ step: 0.01 }}
                            />
                          </Col>
                        ) : fieldItem?.type === FieldTypeEnum ? (
                          <Col span={fieldItem.span}>
                            <ProFormSelect
                              name={fieldItem.key}
                              label={fieldItem.name}
                              placeholder={fieldItem.placeholder}
                              disabled={!fieldItem?.is_edit}
                              options={
                                fieldItem?.options?.options?.map((item: any) => ({
                                  value: item.id,
                                  label: item.value,
                                })) || []
                              }
                              rules={[
                                fieldItem?.is_required && {
                                  required: true,
                                  message: `${fieldItem.name} 为必选项`,
                                },
                              ].filter(Boolean)}
                              initialValue={fieldItem?.options?.default}
                            />
                          </Col>
                        ) : fieldItem?.type === FieldTypeEnumMulti ? (
                          <Col span={fieldItem.span}>
                            <ProFormSelect
                              name={fieldItem.key}
                              label={fieldItem.name}
                              placeholder={fieldItem.placeholder}
                              disabled={!fieldItem?.is_edit}
                              options={
                                fieldItem?.options?.options?.map((item: any) => ({
                                  value: item.id,
                                  label: item.value,
                                })) || []
                              }
                              rules={[
                                fieldItem?.is_required && {
                                  required: true,
                                  message: `${fieldItem.name} 为必选项`,
                                },
                              ].filter(Boolean)}
                              initialValue={fieldItem?.options?.default}
                              mode="multiple"
                            />
                          </Col>
                        ) : fieldItem?.type === FieldTypeDate ? (
                          <Col span={fieldItem.span}>
                            <ProFormDatePicker
                              name={fieldItem.key}
                              label={fieldItem.name}
                              placeholder={fieldItem.placeholder}
                              disabled={!fieldItem?.is_edit}
                              width="100%"
                              rules={[
                                fieldItem?.is_required && {
                                  required: true,
                                  message: `${fieldItem.name} 为必选项`,
                                },
                              ].filter(Boolean)}
                              initialValue={fieldItem?.options?.default}
                            />
                          </Col>
                        ) : fieldItem?.type === FieldTypeTime ? (
                          <Col span={fieldItem.span}>
                            <ProFormTimePicker
                              name={fieldItem.key}
                              label={fieldItem.name}
                              placeholder={fieldItem.placeholder}
                              disabled={!fieldItem?.is_edit}
                              // @ts-ignore
                              width="100%"
                              rules={[
                                fieldItem?.is_required && {
                                  required: true,
                                  message: `${fieldItem.name} 为必选项`,
                                },
                              ].filter(Boolean)}
                              initialValue={fieldItem?.options?.default}
                            />
                          </Col>
                        ) : fieldItem?.type === FieldTypeDatetime ? (
                          <Col span={fieldItem.span}>
                            <ProFormDatePicker
                              name={fieldItem.key}
                              label={fieldItem.name}
                              placeholder={fieldItem.placeholder}
                              disabled={!fieldItem?.is_edit}
                              width="100%"
                              rules={[
                                fieldItem?.is_required && {
                                  required: true,
                                  message: `${fieldItem.name} 为必选项`,
                                },
                              ].filter(Boolean)}
                              initialValue={fieldItem?.options?.default}
                              showTime
                            />
                          </Col>
                        ) : fieldItem?.type === FieldTypeLongString ? (
                          <Col span={fieldItem.span}>
                            <ProFormTextArea
                              name={fieldItem.key}
                              label={fieldItem.name}
                              placeholder={fieldItem.placeholder}
                              disabled={!fieldItem?.is_edit}
                              rules={[
                                fieldItem?.is_required && {
                                  required: true,
                                  message: `${fieldItem.name} 为必填项`,
                                },
                                fieldItem?.options?.regexp && {
                                  validator: async (_: any, value: string) => {
                                    const regex = new RegExp(fieldItem.options.regexp);
                                    if (!regex.test(value)) {
                                      return Promise.reject(
                                        new Error('输入内容不符合指定的正则表达式'),
                                      );
                                    }
                                    return Promise.resolve();
                                  },
                                },
                              ].filter(Boolean)}
                              initialValue={fieldItem?.options?.default}
                            />
                          </Col>
                        ) : fieldItem?.type === FieldTypeUser ? (
                          <Col span={fieldItem.span}>
                            <ProFormSelect
                              name={fieldItem.key}
                              label={fieldItem.name}
                              placeholder={fieldItem.placeholder}
                              disabled={!fieldItem?.is_edit}
                              mode="multiple"
                              options={userList.map((user) => ({
                                label: user.username,
                                value: user.id,
                              }))}
                              rules={[
                                fieldItem?.is_required && {
                                  required: true,
                                  message: `${fieldItem.name} 为必选项`,
                                },
                              ].filter(Boolean)}
                              initialValue={fieldItem?.options?.default}
                              fieldProps={{
                                loading: !userList.length,
                              }}
                            />
                          </Col>
                        ) : fieldItem?.type === FieldTypeTimeZone ? (
                          <Col span={fieldItem.span}>
                            <ProFormText
                              name={fieldItem.key}
                              label={fieldItem.name}
                              placeholder={fieldItem.placeholder}
                              disabled={!fieldItem?.is_edit}
                              rules={[
                                fieldItem?.is_required && {
                                  required: true,
                                  message: `${fieldItem.name} 为必填项`,
                                },
                              ].filter(Boolean)}
                              initialValue={fieldItem?.options?.default}
                            />
                          </Col>
                        ) : fieldItem?.type === FieldTypeBoolean ? (
                          <Col span={fieldItem.span}>
                            <ProFormSwitch
                              name={fieldItem.key}
                              label={fieldItem.name}
                              disabled={!fieldItem?.is_edit}
                              rules={[
                                fieldItem?.is_required && {
                                  required: true,
                                  message: `${fieldItem.name} 为必填项`,
                                },
                              ].filter(Boolean)}
                              initialValue={fieldItem?.options?.default === true}
                            />
                          </Col>
                        ) : fieldItem?.type === FieldTypeList ? (
                          <Col span={fieldItem.span}>
                            <ProFormSelect
                              name={fieldItem.key}
                              label={fieldItem.name}
                              placeholder={fieldItem.placeholder}
                              disabled={!fieldItem?.is_edit}
                              options={fieldItem?.options?.options || []}
                              rules={[
                                fieldItem?.is_required && {
                                  required: true,
                                  message: `${fieldItem.name} 为必填项`,
                                },
                              ].filter(Boolean)}
                              initialValue={fieldItem?.options?.default}
                            />
                          </Col>
                        ) : fieldItem?.type === FieldTypeTable ? (
                          <Col span={fieldItem.span}>
                            <div className={styles.fieldPreviewTable}>
                              <div style={{ marginBottom: '8px' }}>{fieldItem.name}</div>
                              <DragSortTable
                                columns={fieldItem?.options?.columns?.map((column: any) => ({
                                  title: column.label,
                                  dataIndex: column.value,
                                }))}
                                bordered
                                rowKey="key"
                                search={false}
                                pagination={false}
                                dragSortKey="sort"
                                toolBarRender={false}
                              />
                            </div>
                          </Col>
                        ) : null}
                      </Fragment>
                    ))}
                  </Row>
                ) : null}
              </div>
            </div>
          ))
        : null}
    </DrawerForm>
  );
});

export default FieldPreview;
