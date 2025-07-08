import { FC, useEffect, useState } from 'react';
import styles from './Pipeline.less';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ReactComponent as PlusFill } from '@/assets/svg/plusFill.svg';
import {
  DrawerForm,
  PageContainer,
  ProFormDigit,
  ProFormGroup,
  ProFormList,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { resourceDetails } from '@/services/deploy/tekton';

interface PipelineProps {
  status: 'create' | 'edit';
  namespace?: string | undefined;
  name?: string | undefined;
}

const paramTypeOptions = [
  { label: 'string', value: 'string' },
  { label: 'array', value: 'array' },
];

const operatorOptions = [
  { label: 'in', value: 'in' },
  { label: 'notin', value: 'notin' },
];

const pipelinesName = 'pipelines';

const Pipeline: FC<PipelineProps> = ({
  status = 'create',
  name = undefined,
  namespace = undefined,
}) => {
  const [active, setActive] = useState('process');
  const [pipelineDetails, setPipelineDetails] = useState({});
  const [taskList, setTaskList] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (status === 'create') {
    } else if (status === 'edit') {
      (async () => {
        const res = await resourceDetails(pipelinesName, name, namespace, {});
        const _data = res.data || {};
        setPipelineDetails(_data);
        console.log(_data.spec.tasks, pipelineDetails);
        setTaskList(_data.spec.tasks || []);
      })();
    }
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
                    <div className={`${styles.pipelineSplitline}`}>
                      <div
                        className={`${styles.pipelineButton} ${
                          Array.isArray(taskList) && taskList.length > 0
                            ? styles.pipelineButtonAfter
                            : ''
                        }`}
                      >
                        <PlusFill
                          className={`${styles.pipelineButtonPlus} ${styles.pipelineAddStage}`}
                        />
                      </div>
                    </div>
                    {Array.isArray(taskList) && taskList.length > 0
                      ? taskList.map((stage: any, idx: number) => (
                          <div key={idx}>
                            <div className={`${styles.pipelineEditable} ${styles.pipelineTitle}`}>
                              <div className={styles.pipelineGroupHeader}>
                                {stage.name || `阶段${idx + 1}`}
                              </div>
                              <div className={`${styles.pipelineStages}`}>
                                <div className={`${styles.pipelineTaskContainer}`}>
                                  <div className={styles.pipelineStagesContainer}>
                                    {/*<div className={styles.pipelineJobType}>*/}
                                    {/*  <AutomaticTrigger className={styles.pipelineAddStage} />*/}
                                    {/*</div>*/}
                                    <div className={styles.pipelineJob}>
                                      <div
                                        className={styles.pipelineJobExtra}
                                        style={{ marginRight: 14 }}
                                      >
                                        <PlusFill className={styles.pipelineAddStage} />
                                      </div>
                                      <div className={styles.pipelineJobContent}>
                                        <Button
                                          shape="round"
                                          style={{
                                            width: '100%',
                                            color: '#595c62',
                                            fontSize: '14px',
                                          }}
                                          size="large"
                                        >
                                          {stage?.taskRef?.name || '新建阶段'}
                                        </Button>
                                      </div>
                                      <div
                                        className={styles.pipelineJobExtra}
                                        style={{ marginLeft: 14 }}
                                      >
                                        <PlusFill className={styles.pipelineAddStage} />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className={styles.pipelineSplitline}>
                              <div
                                className={`${styles.pipelineButton} ${
                                  Array.isArray(taskList) &&
                                  taskList.length > 0 &&
                                  idx !== taskList.length - 1
                                    ? styles.pipelineButtonAfter
                                    : ''
                                }`}
                              >
                                <PlusFill
                                  className={`${styles.pipelineButtonPlus} ${styles.pipelineAddStage}`}
                                />
                              </div>
                            </div>
                          </div>
                        ))
                      : null}
                  </div>
                </div>
              </div>
            )}
            {active === 'webhook' && <div>这里是触发设置内容</div>}
            {active === 'variable' && <div>这里是变量和缓存内容</div>}
          </div>
        </div>
      </PageContainer>
      <DrawerForm
        title="编辑 Pipeline"
        open={visible}
        onOpenChange={setVisible}
        width={800}
        submitter={{
          searchConfig: { submitText: '保存', resetText: '重置' },
          render: (props, doms) => <div style={{ textAlign: 'right' }}>{doms}</div>,
        }}
      >
        <ProFormGroup title="基础信息">
          <ProFormText name={['metadata', 'name']} label="名称" rules={[{ required: true }]} />
        </ProFormGroup>

        <ProFormList
          name={['spec', 'params']}
          label="全局参数"
          creatorButtonProps={{ position: 'top', creatorButtonText: '添加参数' }}
          itemRender={({ listDom, action }) => (
            <div
              style={{ marginBottom: 16, border: '1px solid #eee', padding: 16, borderRadius: 4 }}
            >
              {listDom}
              {action}
            </div>
          )}
        >
          <ProFormGroup>
            <ProFormText name="name" label="参数名" rules={[{ required: true }]} />
            <ProFormSelect
              name="type"
              label="类型"
              options={paramTypeOptions}
              rules={[{ required: true }]}
            />
            <ProFormText name="description" label="描述" />
            <ProFormText name="default" label="默认值" />
          </ProFormGroup>
        </ProFormList>

        <ProFormList
          name={['spec', 'workspaces']}
          label="工作区"
          creatorButtonProps={{ position: 'top', creatorButtonText: '添加工作区' }}
          itemRender={({ listDom, action }) => (
            <div
              style={{ marginBottom: 16, border: '1px solid #eee', padding: 16, borderRadius: 4 }}
            >
              {listDom}
              {action}
            </div>
          )}
        >
          <ProFormGroup>
            <ProFormText name="name" label="名称" rules={[{ required: true }]} />
            <ProFormText name="description" label="描述" />
          </ProFormGroup>
        </ProFormList>

        <ProFormList
          name={['spec', 'tasks']}
          label="任务"
          creatorButtonProps={{ position: 'top', creatorButtonText: '添加任务' }}
          itemRender={({ listDom, action }) => (
            <div
              style={{ marginBottom: 16, border: '1px solid #eee', padding: 16, borderRadius: 4 }}
            >
              {listDom}
              {action}
            </div>
          )}
        >
          <ProFormGroup>
            <ProFormText name="name" label="任务名" rules={[{ required: true }]} />
            <ProFormText name="displayName" label="显示名" />
            <ProFormText name="description" label="描述" />
            <ProFormText name={['taskRef', 'name']} label="任务引用" rules={[{ required: true }]} />
            <ProFormList
              name="params"
              label="参数"
              creatorButtonProps={{ creatorButtonText: '添加参数' }}
            >
              <ProFormGroup>
                <ProFormText name="name" label="参数名" />
                <ProFormText name="value" label="值" />
              </ProFormGroup>
            </ProFormList>
            <ProFormList
              name="workspaces"
              label="工作区"
              creatorButtonProps={{ creatorButtonText: '添加工作区' }}
            >
              <ProFormGroup>
                <ProFormText name="name" label="名称" />
                <ProFormText name="workspace" label="工作区" />
              </ProFormGroup>
            </ProFormList>
            <ProFormDigit name="retries" label="重试次数" min={0} />
            <ProFormList
              name="runAfter"
              label="依赖任务"
              creatorButtonProps={{ creatorButtonText: '添加依赖' }}
            >
              <ProFormText name="" label="任务名" />
            </ProFormList>
            <ProFormList
              name="when"
              label="条件"
              creatorButtonProps={{ creatorButtonText: '添加条件' }}
            >
              <ProFormGroup>
                <ProFormText name="input" label="输入" />
                <ProFormSelect name="operator" label="操作符" options={operatorOptions} />
                <ProFormText name="values" label="值（逗号分隔）" />
              </ProFormGroup>
            </ProFormList>
            <ProFormText name="timeout" label="超时时间" />
          </ProFormGroup>
        </ProFormList>

        <ProFormList
          name={['spec', 'finally']}
          label="最终任务"
          creatorButtonProps={{ position: 'top', creatorButtonText: '添加最终任务' }}
          itemRender={({ listDom, action }) => (
            <div
              style={{ marginBottom: 16, border: '1px solid #eee', padding: 16, borderRadius: 4 }}
            >
              {listDom}
              {action}
            </div>
          )}
        >
          <ProFormGroup>
            <ProFormText name="name" label="任务名" rules={[{ required: true }]} />
            <ProFormText name="displayName" label="显示名" />
            <ProFormText name="description" label="描述" />
            <ProFormText name={['taskRef', 'name']} label="任务引用" rules={[{ required: true }]} />
            <ProFormList
              name="params"
              label="参数"
              creatorButtonProps={{ creatorButtonText: '添加参数' }}
            >
              <ProFormGroup>
                <ProFormText name="name" label="参数名" />
                <ProFormText name="value" label="值" />
              </ProFormGroup>
            </ProFormList>
            <ProFormList
              name="workspaces"
              label="工作区"
              creatorButtonProps={{ creatorButtonText: '添加工作区' }}
            >
              <ProFormGroup>
                <ProFormText name="name" label="名称" />
                <ProFormText name="workspace" label="工作区" />
              </ProFormGroup>
            </ProFormList>
            <ProFormDigit name="retries" label="重试次数" min={0} />
            <ProFormList
              name="when"
              label="条件"
              creatorButtonProps={{ creatorButtonText: '添加条件' }}
            >
              <ProFormGroup>
                <ProFormText name="input" label="输入" />
                <ProFormSelect name="operator" label="操作符" options={operatorOptions} />
                <ProFormText name="values" label="值（逗号分隔）" />
              </ProFormGroup>
            </ProFormList>
          </ProFormGroup>
        </ProFormList>
      </DrawerForm>
    </>
  );
};

export default Pipeline;
