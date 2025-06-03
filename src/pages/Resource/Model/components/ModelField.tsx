import { EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { DrawerForm } from '@ant-design/pro-components';
import { Button, Flex, Input } from 'antd';
import { FC, useState } from 'react';

interface FieldGroupForm {
  name?: string;
}

const ModelField: FC = () => {
  const [fieldGroupForm, setFieldGroupForm] = useState<FieldGroupForm>();
  const [fieldVisit, setFieldVisit] = useState(false);
  const [drawerStatus, setDrawerStatus] = useState('create');

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
        initialValues={fieldGroupForm}
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
          setFieldGroupForm((prev) => ({ ...prev, ...values }));
        }}
        onOpenChange={setFieldVisit}
        open={fieldVisit}
      ></DrawerForm>
    </div>
  );
};

export default ModelField;
