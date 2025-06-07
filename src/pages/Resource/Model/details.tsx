import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Button, Descriptions, Modal, Tag } from 'antd';
import { FC, useEffect, useState } from 'react';
import ModelField from './components/ModelField';
import styles from './details.less';
import { deleteModel, getModelDetails } from '@/services/resource/model';
import { useNavigate, useParams } from 'react-router-dom';
import { formatDate } from '@/utils/tools/tools';
import { IconPicker } from '@ant-design/pro-editor';
import { DeleteOutlined } from '@ant-design/icons';

const ModelDetails: FC = () => {
  const [modal, modalContextHolder] = Modal.useModal();
  const navigate = useNavigate();
  const { id } = useParams();
  const [tab, setTab] = useState('fields');
  const [modelDetails, setModelDetails] = useState<any>();

  useEffect(() => {
    (async () => {
      await getModelDetails(id).then((res) => {
        setModelDetails(res.data);
      });
    })();
  }, []);

  return (
    <>
      {modalContextHolder}
      <div
        style={{
          background: '#F5F7FA',
        }}
      >
        <PageContainer
          header={{
            extra: [
              <Button
                key="2"
                icon={<DeleteOutlined />}
                onClick={() => {
                  modal.confirm({
                    title: '删除模型',
                    content:
                      '删除模型将同步删除对应的字段分组及字段数据，请确认是否进行删除模型操作？',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: async () => {
                      await deleteModel(modelDetails.id);
                      navigate('/resource/model');
                    },
                  });
                }}
              >
                删除
              </Button>,
            ],
          }}
          content={
            <>
              <div className={styles.modelInfo}>
                <div className={styles.modelIcon}>
                  <IconPicker icon={modelDetails?.icon} />
                </div>
                <div className={styles.modelDesc}>{modelDetails?.desc || '暂无描述'}</div>
              </div>
              <Descriptions column={2} style={{ marginBlockEnd: -16 }}>
                <Descriptions.Item label="ID">{modelDetails?.id}</Descriptions.Item>
                <Descriptions.Item label="名称">{modelDetails?.name}</Descriptions.Item>
                <Descriptions.Item label="分组名称">{modelDetails?.group_name}</Descriptions.Item>
                <Descriptions.Item label="状态">
                  {modelDetails === undefined ? (
                    <></>
                  ) : modelDetails?.status ? (
                    <Tag color="geekblue">启用</Tag>
                  ) : (
                    <Tag color="red">禁用</Tag>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="创建时间">
                  {formatDate(modelDetails?.create_time)}
                </Descriptions.Item>
                <Descriptions.Item label="更新时间">
                  {formatDate(modelDetails?.update_time)}
                </Descriptions.Item>
              </Descriptions>
            </>
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
              ],
              onChange: (key) => {
                setTab(key);
              },
            }}
          />
        </PageContainer>
      </div>
    </>
  );
};

export default ModelDetails;
