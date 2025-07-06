import { FC, useEffect, useState } from 'react';
import styles from './Pipeline.less';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ReactComponent as PlusFill } from '@/assets/svg/plusFill.svg';
import { ReactComponent as AutomaticTrigger } from '@/assets/svg/automaticTrigger.svg';
import { PageContainer } from '@ant-design/pro-components';

interface PipelineProps {
  status: 'create' | 'edit';
  namespace?: string | undefined;
  name?: string | undefined;
}

const Pipeline: FC<PipelineProps> = ({
  status = 'create',
  name = undefined,
  namespace = undefined,
}) => {
  const [active, setActive] = useState('process');

  useEffect(() => {
    console.log(status, name, namespace);
  }, []);

  return (
    <>
      <PageContainer>
        <div className={styles.pipelineContainer}>
          <div className={styles.pipelineHeader}>
            <div className={styles.pipelineHeaderLeft}>流水线管理</div>
            <div className={styles.pipelineHeaderCenter}>
              <div
                onClick={() => {
                  setActive('basic');
                }}
                style={active === 'basic' ? { background: '#c5e8ff', fontWeight: 500 } : undefined}
              >
                基本信息
              </div>
              <div
                onClick={() => {
                  setActive('process');
                }}
                style={
                  active === 'process' ? { background: '#c5e8ff', fontWeight: 500 } : undefined
                }
              >
                流程配置
              </div>
              <div
                onClick={() => {
                  setActive('webhook');
                }}
                style={
                  active === 'webhook' ? { background: '#c5e8ff', fontWeight: 500 } : undefined
                }
              >
                触发设置
              </div>
              <div
                onClick={() => {
                  setActive('variable');
                }}
                style={
                  active === 'variable' ? { background: '#c5e8ff', fontWeight: 500 } : undefined
                }
              >
                变量和缓存
              </div>
            </div>
            <div>
              <Button type="primary">保存</Button>
            </div>
          </div>
          <div className={styles.pipelineContent}>
            {active === 'basic' && <div>这里是基本信息内容</div>}
            {active === 'process' && (
              <div style={{ display: 'flex', height: '100%' }}>
                <div className={styles.pipelineSidebar}>
                  <div className={styles.pipelineTitle}>流水线源</div>
                  <div className={styles.pipelineSource}></div>
                  <div>
                    <Button
                      shape="round"
                      icon={<PlusOutlined />}
                      style={{ width: '100%', color: '#595c62', fontSize: '14px' }}
                      size="large"
                    >
                      新建阶段
                    </Button>
                  </div>
                </div>
                <div className={styles.pipelineContentList}>
                  <div className={styles.pipelineGroup}>
                    <div className={styles.pipelineSplitline}>
                      <div className={styles.pipelineButton}>
                        <PlusFill
                          className={`${styles.pipelineButtonPlus} ${styles.pipelineAddStage}`}
                        />
                      </div>
                    </div>
                    <div className={`${styles.pipelineEditable} ${styles.pipelineTitle}`}>
                      <div className={styles.pipelineGroupHeader}>暂无流程</div>
                      <div className={`${styles.pipelineStages}`}>
                        <div className={`${styles.pipelineTaskContainer}`}>
                          <div className={styles.pipelineStagesContainer}>
                            <div className={styles.pipelineJobType}>
                              <AutomaticTrigger className={styles.pipelineAddStage} />
                            </div>
                            <div className={styles.pipelineJob}>
                              <div className={styles.pipelineJobExtra} style={{ marginRight: 14 }}>
                                <PlusFill className={styles.pipelineAddStage} />
                              </div>
                              <div className={styles.pipelineJobContent}>
                                <Button
                                  shape="round"
                                  style={{ width: '100%', color: '#595c62', fontSize: '14px' }}
                                  size="large"
                                >
                                  新建阶段
                                </Button>
                              </div>
                              <div className={styles.pipelineJobExtra} style={{ marginLeft: 14 }}>
                                <PlusFill className={styles.pipelineAddStage} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {active === 'webhook' && <div>这里是触发设置内容</div>}
            {active === 'variable' && <div>这里是变量和缓存内容</div>}
          </div>
        </div>
      </PageContainer>
    </>
  );
};

export default Pipeline;
