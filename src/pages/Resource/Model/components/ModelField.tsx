import { EyeOutlined, MinusCircleOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import {
  DrawerForm,
  ProFormDigit,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, Flex, Form, Input } from 'antd';
import { FC, useState } from 'react';
import styles from './ModelField.less';

interface FieldForm {
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
  model_id?: string;
}

type FieldType =
  | 'shortString'
  | 'number'
  | 'float'
  | 'enum'
  | 'enumMulti'
  | 'date'
  | 'time'
  | 'longString'
  | 'user'
  | 'timeZone'
  | 'boolean'
  | 'list'
  | 'table';

interface LabelValue {
  Label: string;
  Value: FieldType;
}

const baseFieldTypeMap: LabelValue[] = [
  { Label: '短字符串', Value: 'shortString' },
  { Label: '数字', Value: 'number' },
  { Label: '浮点数', Value: 'float' },
  { Label: '枚举', Value: 'enum' },
  { Label: '枚举多选', Value: 'enumMulti' },
  { Label: '日期', Value: 'date' },
  { Label: '时间', Value: 'time' },
  { Label: '长字符串', Value: 'longString' },
  { Label: '用户', Value: 'user' },
  { Label: '时区', Value: 'timeZone' },
  { Label: '布尔值', Value: 'boolean' },
  { Label: '列表', Value: 'list' },
  { Label: '表格', Value: 'table' },
];

const ModelField: FC = () => {
  const [fieldForm, setFieldForm] = useState<FieldForm>({
    name: '',
    group_id: undefined,
    type: 'shortString',
    options: {
      options: [], // 初始化options数组
    },
    is_edit: false,
    is_required: false,
    is_list: false,
    placeholder: '',
    desc: '',
    order: 1,
    model_id: '',
  });
  const [fieldVisit, setFieldVisit] = useState(false);
  const [drawerStatus, setDrawerStatus] = useState('create');

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

  return (
    <div>
      <Flex gap={10} wrap>
        <Button
          type="primary"
          onClick={() => {
            setDrawerStatus('create');
            setFieldVisit(true);
          }}
        >
          <PlusOutlined />
          新建字段
        </Button>
        <Button>
          <PlusOutlined />
          新建分组
        </Button>
        <Button>
          <EyeOutlined />
          字段预览
        </Button>
        <Input placeholder="请输入字段名" style={{ width: '300px' }} suffix={<SearchOutlined />} />
      </Flex>
      <DrawerForm
        title={drawerStatus === 'create' ? '新建字段' : '编辑字段'}
        initialValues={fieldForm}
        width={600}
        autoFocusFirstInput
        drawerProps={{
          destroyOnHidden: true,
        }}
        onFinish={async (values) => {
          console.log(values);
          return true;
        }}
        onValuesChange={(_, values) => {
          setFieldForm((prev) => ({ ...prev, ...values }));
        }}
        onOpenChange={setFieldVisit}
        open={fieldVisit}
      >
        <ProFormText
          name="name"
          label="字段名称"
          placeholder="请输入字段名称"
          rules={[{ required: true, message: '名称不能为空' }]}
        />
        <ProFormSelect
          name="group_id"
          label="所属分组"
          options={[
            { label: '基础信息', value: 'basic' },
            { label: '扩展信息', value: 'extend' },
          ]}
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
        />
        <div className={styles.modelFieldOptions}>
          {fieldForm?.type === 'shortString' || fieldForm?.type === 'longString' ? (
            <>
              <ProFormTextArea
                name={['options', 'regexp']}
                label="正则表达式"
                placeholder="请输入验证正则表达式"
              />
              {fieldForm?.type === 'longString' ? (
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
          ) : fieldForm?.type === 'number' ? (
            <>
              <ProFormDigit name={['options', 'min']} label="最小值" placeholder="请输入最小值" />
              <ProFormDigit name={['options', 'max']} label="最大值" placeholder="请输入最大值" />
              <ProFormDigit
                name={['options', 'default']}
                label="默认值"
                placeholder="请输入默认值"
              />
            </>
          ) : fieldForm?.type === 'float' ? (
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
          ) : fieldForm?.type === 'enum' || fieldForm?.type === 'enumMulti' ? (
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
                  key={fieldForm?.options?.options?.length} // 添加key触发重新渲染
                  name={['options', 'default']}
                  placeholder="请选择默认值"
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
          ) : null}
        </div>
        <Flex justify="space-between">
          <ProFormSwitch name="is_edit" label="是否可编辑" />
          <ProFormSwitch name="is_required" label="是否必填" />
          <ProFormSwitch name="is_list" label="列表展示" />
        </Flex>
        <ProFormText name="placeholder" label="占位提示" placeholder="请输入占位提示" />
        <ProFormDigit
          name="order"
          label="排序序号"
          min={1}
          rules={[{ required: true, message: '请输入排序' }]}
        />
        <ProFormTextArea name="desc" label="字段描述" placeholder="请输入字段描述" />
      </DrawerForm>
    </div>
  );
};

export default ModelField;
