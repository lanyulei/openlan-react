import { DrawerForm, ProFormText } from '@ant-design/pro-components';
import { Col, Form, Row } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';
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
        initialValues={dataForm}
      >
        {Array.isArray(fieldList) && fieldList.length > 0
          ? fieldList.map((item) => (
              <div key={item.id}>
                <div className={modelStyles.modelGroup}>
                  <CaretDownOutlined />
                  <span className={modelStyles.modelGroupName}>{item.name}</span>
                </div>
                {item.fields && item.fields?.length > 0 ? (
                  <Row>
                    {item.fields?.map((fieldItem: any) => (
                      <div key={fieldItem.id}>
                        {fieldItem?.type === 'shortString' || fieldItem?.type === 'longString' ? (
                          <Col span={12}>
                            <ProFormText
                              name={[fieldItem.name]}
                              label="正则表达式"
                              placeholder="请输入验证正则表达式"
                            />
                          </Col>
                        ) : null}
                      </div>
                    ))}
                  </Row>
                ) : null}
              </div>
            ))
          : null}
      </DrawerForm>
    );
  },
);

export default FieldPreview;
