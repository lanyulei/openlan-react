import { useNavigate } from 'react-router-dom';
import { FC, useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { CaretDownOutlined, SearchOutlined } from '@ant-design/icons';
import styles from '../common.less';
import indexStyles from './index.less';
import { Input } from 'antd';

import { getModels } from '@/services/resource/model';
import { IconPicker } from '@ant-design/pro-editor';

type Data = {
  list: any[];
  page: number;
  size: number;
};

const Models: FC = () => {
  const navigate = useNavigate();
  const [modelName, setModelName] = useState('');
  const [data, setData] = useState<Data>({
    list: [],
    page: 1,
    size: 10,
  });

  const getList = async () => {
    const res = await getModels({
      name: modelName,
    });
    setData((prevData) => ({
      ...prevData,
      list: res.data || [],
    }));
  };

  const handleDetails = (id: string) => {
    navigate('/resource/model-details/' + id);
  };

  useEffect(() => {
    (async () => {
      await getList();
    })();
  }, []);

  return (
    <>
      <PageContainer
        header={{
          extra: [
            <Input
              key="2"
              placeholder="请输入模型名称"
              style={{ width: '300px' }}
              suffix={<SearchOutlined />}
              onChange={(e) => {
                setModelName(e.target.value);
              }}
              onPressEnter={() => {
                getList();
              }}
            />,
          ],
        }}
      >
        {data.list.map((item) => (
          <>
            {item.models && item.models.length > 0 && (
              <div key={item.id} style={{ marginBottom: '15px' }}>
                <div className={styles.modelGroup}>
                  <CaretDownOutlined />
                  <span className={styles.modelGroupName}>
                    {item.name} ( {item.models?.length || 0} )
                  </span>
                </div>
                <div className={styles.modelItem}>
                  {item.models?.map((modelItem: any) => (
                    <div
                      className={`${styles.modelValue} ${indexStyles.modelValue}`}
                      key={modelItem.id}
                    >
                      <div
                        className={styles.modelInfo}
                        onClick={() => {
                          handleDetails(modelItem.id);
                        }}
                      >
                        <div className={styles.modelIcon}>
                          <IconPicker icon={modelItem.icon} />
                        </div>
                        <div className={styles.modelDetails}>
                          <div className={styles.modelName}>{modelItem.name}</div>
                          <div className={styles.modelDescription}>
                            {modelItem.desc !== '' ? modelItem.desc : '暂无描述'}
                          </div>
                        </div>
                      </div>
                      <div className={indexStyles.modelInstanceCount}>10</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ))}
      </PageContainer>
    </>
  );
};

export default Models;
