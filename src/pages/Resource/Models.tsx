import { FC, useState } from 'react';
import {
  ModalForm,
  PageContainer,
  ProForm,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import {
  CaretDownOutlined,
  GithubOutlined,
  MoreOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import styles from './less/Models.less';
import { Button, Dropdown, message } from 'antd';
import type { MenuProps } from 'antd';

const Models: FC = () => {
  const [modalVisit, setModalVisit] = useState(false);

  const items: MenuProps['items'] = [
    {
      label: <div>编辑分组</div>,
      key: '0',
    },
    {
      label: <div>删除分组</div>,
      key: '1',
    },
  ];

  return (
    <>
      <PageContainer
        header={{
          extra: [
            <Button
              type="primary"
              key="1"
              icon={<PlusCircleOutlined />}
              onClick={() => {
                setModalVisit(true);
              }}
            >
              新建分组
            </Button>,
          ],
        }}
      >
        <div>
          <div className={styles.modelGroup}>
            <CaretDownOutlined />
            <span className={styles.modelGroupName}>主机管理 ( 1 ) </span>
            <Dropdown menu={{ items }} trigger={['click']}>
              <MoreOutlined className={styles.modelGroupMoreIcon} />
            </Dropdown>
          </div>
          <div className={styles.modelItem}>
            <div className={styles.modelValue}>
              <div className={styles.modelInfo}>
                <div className={styles.modelIcon}>
                  <GithubOutlined />
                </div>
                <div className={styles.modelDetails}>
                  <div className={styles.modelName}>
                    adsadfadfaadsadfadfaadsadfadfaadsadfadfaadsadfadfaadsadfadfa
                  </div>
                  <div className={styles.modelDescription}>
                    sadasdfasdsadasdfasdsadasdfasdsadasdfasdsadasdfasdsadasdfasdsadasdfasd
                  </div>
                </div>
              </div>
              <div className={styles.modelInstanceCount}>0</div>
            </div>
            <div className={styles.modelAdd}>
              <PlusOutlined />
              <span style={{ marginLeft: '5px' }}>新建模型</span>
            </div>
          </div>
        </div>
      </PageContainer>
      <ModalForm
        title="新建表单"
        open={modalVisit}
        onFinish={async () => {
          message.success('提交成功');
          return true;
        }}
        onOpenChange={setModalVisit}
      >
        <ProForm.Group>
          <ProFormText
            width="md"
            name="name"
            label="签约客户名称"
            tooltip="最长为 24 位"
            placeholder="请输入名称"
          />

          <ProFormText width="md" name="company" label="我方公司名称" placeholder="请输入名称" />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText width="md" name="contract" label="合同名称" placeholder="请输入名称" />
          <ProFormDateRangePicker name="contractTime" label="合同生效时间" />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormSelect
            options={[
              {
                value: 'chapter',
                label: '盖章后生效',
              },
            ]}
            width="xs"
            name="useMode"
            label="合同约定生效方式"
          />
          <ProFormSelect
            width="xs"
            options={[
              {
                value: 'time',
                label: '履行完终止',
              },
            ]}
            name="unusedMode"
            label="合同约定失效效方式"
          />
        </ProForm.Group>
        <ProFormText width="sm" name="id" label="主合同编号" />
        <ProFormText name="project" disabled label="项目名称" initialValue="xxxx项目" />
        <ProFormText width="xs" name="mangerName" disabled label="商务经理" initialValue="启途" />
      </ModalForm>
    </>
  );
};

export default Models;
