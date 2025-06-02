import {
  ModalForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { FC, useEffect, useState } from 'react';
import { IconPicker, IconUnit } from '@ant-design/pro-editor';
import styles from './CreateModel.less';
import { getModelGroupList } from '@/services/resource/modelGroup';

type modelGroup = {
  id: string;
  name: string;
};

const CreateModel: FC = () => {
  const [modalVisit, setModalVisit] = useState(true);
  const [modelGroupList, setModelGroupList] = useState<modelGroup[]>([]);
  const [modelIcon, setModelIcon] = useState<IconUnit>();
  const [modelForm, setModelForm] = useState<{
    name: string;
    icon: string;
    status: boolean;
    desc: string;
    group_id: string | undefined;
    order: number;
  }>({
    name: '',
    icon: '',
    status: true,
    desc: '',
    group_id: undefined,
    order: 1,
  });

  useEffect(() => {
    (async () => {
      const res = await getModelGroupList({
        not_page: true,
      });
      setModelGroupList(res?.data?.list || []);
    })();
  }, []);

  return (
    <>
      <ModalForm<{
        name: string;
        company: string;
      }>
        width={500}
        title="新建模型"
        autoFocusFirstInput
        modalProps={{
          destroyOnHidden: true,
        }}
        open={modalVisit}
        onFinish={async (values) => {
          console.log(modelIcon);
          console.log(values);
          return true;
        }}
        initialValues={modelForm}
        onValuesChange={(_, values) => {
          setModelForm((prev) => ({ ...prev, ...values }));
        }}
        onOpenChange={setModalVisit}
      >
        <div className={styles.modelIcon}>
          <div>
            <IconPicker icon={modelIcon} onIconChange={setModelIcon} />
          </div>
          <div className={styles.modelSelectIcon}>选择图标</div>
        </div>
        <ProFormText
          name="name"
          label="名称："
          rules={[{ required: true, message: '请输入名称' }]}
          placeholder="请输入名称"
        />
        <ProFormSelect
          name="group_id"
          label="分组："
          showSearch
          options={modelGroupList.map((item) => ({
            value: item.id,
            label: item.name,
          }))}
          placeholder="请选择模型分组"
          rules={[{ required: true, message: '请选择模型分组' }]}
        />
        <ProFormDigit
          label="顺序："
          name="order"
          min={1}
          placeholder="请输入顺序"
          rules={[{ required: true, message: '请输入顺序' }]}
        />
        <ProFormTextArea name="desc" label="备注：" placeholder="请输入备注" />
      </ModalForm>
    </>
  );
};

export default CreateModel;
