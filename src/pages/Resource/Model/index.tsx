import { FC, useState } from 'react';
import {
  ModalForm,
  PageContainer,
  ProFormDigit,
  ProFormText,
  ProFormTextArea,
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

import { createModelGroup } from '@/services/resource/model';

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
      <ModalForm<{
        name: string;
        desc: string;
        order: number;
      }>
        width={500}
        title="新建表单"
        open={modalVisit}
        onFinish={async (values) => {
          console.log(values);
          const res = await createModelGroup({
            name: values.name,
            desc: values.desc,
            order: values.order,
          });
          console.log(res);
          message.success('提交成功');
          return true;
        }}
        initialValues={{
          order: 1,
        }}
        onOpenChange={setModalVisit}
      >
        <ProFormText name="name" label="名称：" placeholder="请输入名称" />
        <ProFormTextArea name="desc" label="备注：" placeholder="请输入备注" />
        <ProFormDigit label="顺序：" name="order" min={1} placeholder="请输入顺序" />
      </ModalForm>
    </>
  );
};

export default Models;
