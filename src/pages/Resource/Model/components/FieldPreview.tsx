import {
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
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import modelStyles from '../index.less';
import { CaretDownOutlined } from '@ant-design/icons';

// 定义一个接口来描述组件的 props 类型
interface FieldPreviewProps {
  fieldList: any; // 这里使用 any 类型，可根据实际情况替换为更具体的类型
}

const FieldPreview = forwardRef<{ showDrawer: () => void }, FieldPreviewProps>(
  ({ fieldList }, ref) => {
    const [form] = Form.useForm();
    const [drawerVisit, setDrawerVisit] = useState(false);
    const [dataForm, setDataForm] = useState<any>();

    const showDrawer = () => {
      console.log(fieldList);
      setDrawerVisit(true);
    };

    useImperativeHandle<{ showDrawer: () => void }, { showDrawer: () => void }>(
      ref as React.MutableRefObject<{ showDrawer: () => void }> | null,
      () => ({
        showDrawer,
      }),
    );

    useEffect(() => {
      console.log(dataForm);
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
        onFinish={async (values: { name: any }) => {
          console.log(values.name);
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
                        <Col key={fieldItem.id} span={12}>
                          {fieldItem?.type === 'shortString' ? (
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
                          ) : fieldItem?.type === 'number' ? (
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
                                  min: fieldItem.options.min,
                                  message: `${fieldItem.name} 不能小于 ${fieldItem.options.min}`,
                                },
                                fieldItem?.options?.max !== undefined && {
                                  max: fieldItem.options.max,
                                  message: `${fieldItem.name} 不能大于 ${fieldItem.options.max}`,
                                },
                              ].filter(Boolean)}
                              initialValue={fieldItem?.options?.default}
                            />
                          ) : fieldItem?.type === 'float' ? (
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
                                  min: fieldItem.options.min,
                                  message: `${fieldItem.name} 不能小于 ${fieldItem.options.min}`,
                                },
                                fieldItem?.options?.max !== undefined && {
                                  max: fieldItem.options.max,
                                  message: `${fieldItem.name} 不能大于 ${fieldItem.options.max}`,
                                },
                              ].filter(Boolean)}
                              initialValue={fieldItem?.options?.default}
                              fieldProps={{ step: 0.01 }}
                            />
                          ) : fieldItem?.type === 'enum' ? (
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
                                  message: `${fieldItem.name} 为必填项`,
                                },
                              ].filter(Boolean)}
                              initialValue={fieldItem?.options?.default}
                            />
                          ) : fieldItem?.type === 'enumMulti' ? (
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
                                  message: `${fieldItem.name} 为必填项`,
                                },
                              ].filter(Boolean)}
                              initialValue={fieldItem?.options?.default}
                              mode="multiple"
                            />
                          ) : fieldItem?.type === 'date' ? (
                            <ProFormDatePicker
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
                          ) : fieldItem?.type === 'time' ? (
                            <ProFormTimePicker
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
                          ) : fieldItem?.type === 'datetime' ? (
                            <ProFormDatePicker
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
                              showTime
                            />
                          ) : fieldItem?.type === 'longString' ? (
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
                          ) : // ) : fieldItem?.type === 'user' ? (
                          fieldItem?.type === 'timeZone' ? (
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
                          ) : fieldItem?.type === 'boolean' ? (
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
                          ) : fieldItem?.type === 'list' ? (
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
                          ) : // ) : fieldItem?.type === 'table' ? (
                          null}
                        </Col>
                      ))}
                    </Row>
                  ) : null}
                </div>
              </div>
            ))
          : null}
      </DrawerForm>
    );
  },
);

export default FieldPreview;
