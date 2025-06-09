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
import { forwardRef, Fragment, useEffect, useImperativeHandle, useState } from 'react';
import modelStyles from '../index.less';
import { CaretDownOutlined } from '@ant-design/icons';
import { getUserList } from '@/services/system/user';

// 定义一个接口来描述组件的 props 类型
interface FieldPreviewProps {
  fieldList: any; // 这里使用 any 类型，可根据实际情况替换为更具体的类型
}

const FieldPreview = forwardRef<{ showDrawer: () => void }, FieldPreviewProps>(
  ({ fieldList }, ref) => {
    const [form] = Form.useForm();
    const [drawerVisit, setDrawerVisit] = useState(false);
    const [dataForm, setDataForm] = useState<any>();

    const [userList, setUserList] = useState<any[]>([]);

    const showDrawer = () => {
      setDrawerVisit(true);
    };

    const getUsers = async () => {
      const res = await getUserList({
        not_page: true,
      });
      const { data } = res;
      setUserList(data?.list);
    };

    useImperativeHandle<{ showDrawer: () => void }, { showDrawer: () => void }>(
      ref as React.MutableRefObject<{ showDrawer: () => void }> | null,
      () => ({
        showDrawer,
      }),
    );

    useEffect(() => {
      getUsers();
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
                        <Fragment key={fieldItem.id}>
                          {fieldItem?.type === 'shortString' ? (
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
                          ) : fieldItem?.type === 'number' ? (
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
                            </Col>
                          ) : fieldItem?.type === 'float' ? (
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
                            </Col>
                          ) : fieldItem?.type === 'enum' ? (
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
                          ) : fieldItem?.type === 'enumMulti' ? (
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
                          ) : fieldItem?.type === 'date' ? (
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
                          ) : fieldItem?.type === 'time' ? (
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
                          ) : fieldItem?.type === 'datetime' ? (
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
                          ) : fieldItem?.type === 'longString' ? (
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
                          ) : fieldItem?.type === 'user' ? (
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
                          ) : fieldItem?.type === 'timeZone' ? (
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
                          ) : fieldItem?.type === 'boolean' ? (
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
                          ) : fieldItem?.type === 'list' ? (
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
                          ) : fieldItem?.type === 'table' ? (
                            <Col span={fieldItem.span}>this is table</Col>
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
  },
);

export default FieldPreview;
