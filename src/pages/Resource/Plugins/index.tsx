import React, { useEffect, useState } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import {
  ModalForm,
  PageContainer,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { getPlugins, updatePlugin } from '@/services/resource/plugin';
import styles from '@/pages/Resource/common.less';
import pluginStyles from './index.less';

import { Form, IconPicker, IconUnit } from '@ant-design/pro-editor';

const { Meta } = Card;

export enum PluginStatus {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
  UNAVAILABLE = 'unavailable',
}

const App: React.FC = () => {
  const [form] = Form.useForm();
  const [pluginList, setPluginList] = React.useState<any[]>([]);
  const [modalVisit, setModalVisit] = React.useState(false);
  const [pluginIcon, setPluginIcon] = useState<IconUnit>();

  const getList = async () => {
    const _res = await getPlugins({}, {});
    setPluginList(_res.data || []);
  };

  useEffect(() => {
    (async () => {
      await getList();
    })();
  }, []);

  return (
    <>
      <PageContainer content="插件管理支持内置及自定义插件的全生命周期管理，包括插件元数据维护、上传部署等，实现多云、混合云及自定义资源的灵活同步。">
        {pluginList.map((plugin, idx) => (
          <Card
            key={plugin.name || idx}
            style={{ width: 300, marginBottom: 16 }}
            actions={[
              <EditOutlined
                onClick={() => {
                  form.setFieldsValue({
                    title: plugin.title,
                    name: plugin.name,
                    author: plugin.author,
                    icon: plugin.icon,
                    status: plugin.status,
                    remarks: plugin.remarks,
                  });
                  setPluginIcon(plugin.icon);
                  setModalVisit(true);
                }}
                key="edit"
              />,
            ]}
          >
            <Meta
              avatar={
                <div className={styles.modelIcon} style={{ marginLeft: 0 }}>
                  <IconPicker icon={plugin.icon} />
                </div>
              }
              title={
                <div className={pluginStyles.pluginTitle}>
                  <div>{plugin.title || plugin.name || '未知'}</div>
                  {plugin.status === PluginStatus.ENABLED ? (
                    <div
                      className={`${pluginStyles.pluginStatusEnabled} ${pluginStyles.pluginStatus}`}
                    ></div>
                  ) : plugin.status === PluginStatus.DISABLED ? (
                    <div
                      className={`${pluginStyles.pluginStatusDisabled} ${pluginStyles.pluginStatus}`}
                    ></div>
                  ) : plugin.status === PluginStatus.UNAVAILABLE ? (
                    <div
                      className={`${pluginStyles.pluginStatusUnavailable} ${pluginStyles.pluginStatus}`}
                    ></div>
                  ) : null}
                </div>
              }
              description={plugin.remarks || '暂无描述'}
            />
          </Card>
        ))}
      </PageContainer>

      <ModalForm
        title="编辑插件信息"
        form={form}
        autoFocusFirstInput
        modalProps={{
          destroyOnHidden: true,
          onCancel: () => {
            form.setFieldsValue({
              title: '',
              name: '',
              author: '',
              icon: undefined,
              status: PluginStatus.ENABLED,
              remarks: '',
            });
          },
        }}
        onFinish={async (values) => {
          let _data = {
            ...values,
            icon: pluginIcon,
          };
          await updatePlugin(values.name, _data, {});
          await getList();
          return true;
        }}
        open={modalVisit}
        onOpenChange={setModalVisit}
        width={600}
        submitter={{
          searchConfig: { submitText: '保存', resetText: '取消' },
        }}
      >
        <div className={pluginStyles.modelIcon}>
          <div>
            <IconPicker icon={pluginIcon} onIconChange={setPluginIcon} />
          </div>
          <div className={pluginStyles.modelSelectIcon}>选择图标</div>
        </div>
        <ProFormText
          name="title"
          label="插件标题"
          rules={[{ required: true, message: '请输入插件标题' }]}
          fieldProps={{ maxLength: 128 }}
          placeholder="请输入插件标题"
        />
        <ProFormText
          disabled={true}
          name="name"
          label="插件名称"
          rules={[{ required: true, message: '请输入插件名称' }]}
          fieldProps={{ maxLength: 128 }}
          placeholder="请输入插件名称"
        />
        <ProFormText
          name="author"
          label="插件作者"
          rules={[{ required: true, message: '请输入插件作者' }]}
          fieldProps={{ maxLength: 128 }}
          placeholder="请输入插件作者"
        />
        <ProFormSelect
          name="status"
          label="状态"
          rules={[{ required: true, message: '请选择状态' }]}
          options={[
            { label: '启用', value: PluginStatus.ENABLED },
            { label: '禁用', value: PluginStatus.DISABLED },
            { label: '不可用', value: PluginStatus.UNAVAILABLE },
          ]}
          placeholder="请选择状态"
        />
        <ProFormTextArea
          name="remarks"
          label="备注"
          fieldProps={{ maxLength: 512, rows: 4 }}
          placeholder="请输入备注"
        />
      </ModalForm>
    </>
  );
};

export default App;
