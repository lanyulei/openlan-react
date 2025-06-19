import { FC, useState } from 'react';
import styles from './Pipeline.less';
import { Button } from 'antd';

const Pipeline: FC = () => {
  const [active, setActive] = useState('basic');

  return (
    <>
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
            style={active === 'process' ? { background: '#c5e8ff', fontWeight: 500 } : undefined}
          >
            流程配置
          </div>
          <div
            onClick={() => {
              setActive('webhook');
            }}
            style={active === 'webhook' ? { background: '#c5e8ff', fontWeight: 500 } : undefined}
          >
            触发设置
          </div>
          <div
            onClick={() => {
              setActive('variable');
            }}
            style={active === 'variable' ? { background: '#c5e8ff', fontWeight: 500 } : undefined}
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
        {active === 'process' && <div>这里是流程配置内容</div>}
        {active === 'webhook' && <div>这里是触发设置内容</div>}
        {active === 'variable' && <div>这里是变量和缓存内容</div>}
      </div>
    </>
  );
};

export default Pipeline;
