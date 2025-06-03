import {
  ModalForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { IconPicker, IconUnit } from '@ant-design/pro-editor';
import styles from './CreateModel.less';
import { getModelGroupList } from '@/services/resource/modelGroup';
import { createModel } from '@/services/resource/model';

type modelGroup = {
  id: string;
  name: string;
};

// 定义组件，接收父组件传过来的 getList 函数
interface CreateModelProps {
  getList?: () => void; // 父组件传递的函数
}

interface CreateModelRef {
  showModal: (groupId: string) => void; // 暴露给父组件的方法
}

const CreateModel = forwardRef<CreateModelRef, CreateModelProps>(({ getList }, ref) => {
  const [modalVisit, setModalVisit] = useState(false);
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

  const showModal = async (groupId: string) => {
    setModelForm({
      ...modelForm,
      group_id: groupId,
    });
    setModalVisit(true);
  };

  // 向父组件暴露方法
  useImperativeHandle(ref, () => ({
    showModal,
  }));

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
          let _data = {
            ...values,
            status: true,
            icon: {},
          };

          if (modelIcon) {
            _data.icon = modelIcon;
          }

          await createModel(_data);

          if (getList) {
            getList();
          }

          setModalVisit(false);
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
});

export default CreateModel;
