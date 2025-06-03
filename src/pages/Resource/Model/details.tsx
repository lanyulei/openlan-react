import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Descriptions } from 'antd';
import { FC, useState } from 'react';
import ModelField from './components/ModelField';
import styles from './details.less';

const ModelDetails: FC = () => {
  const [tab, setTab] = useState('fields');

  return (
    <div
      style={{
        background: '#F5F7FA',
      }}
    >
      <PageContainer
        content={
          <Descriptions column={2} style={{ marginBlockEnd: -16 }}>
            <Descriptions.Item label="创建人">曲丽丽</Descriptions.Item>
            <Descriptions.Item label="关联表单">
              <a>421421</a>
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">2017-01-10</Descriptions.Item>
            <Descriptions.Item label="单据备注">浙江省杭州市西湖区工专路</Descriptions.Item>
          </Descriptions>
        }
      >
        <ProCard
          className={styles.modelDetails}
          style={{
            marginTop: 18,
          }}
          tabs={{
            tabPosition: 'top',
            activeKey: tab,
            items: [
              {
                label: `模型字段`,
                key: 'fields',
                children: <ModelField />,
              },
              // {
              //   label: `产品二`,
              //   key: 'tab2',
              //   children: `内容二`,
              // },
              // {
              //   label: `产品三`,
              //   key: 'tab3',
              //   children: `内容三`,
              // },
            ],
            onChange: (key) => {
              setTab(key);
            },
          }}
        />
      </PageContainer>
    </div>
  );
};

export default ModelDetails;
