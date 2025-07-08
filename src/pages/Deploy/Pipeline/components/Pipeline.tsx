import { FC, useEffect, useState } from 'react';
import styles from './Pipeline.less';
import { Button, Flex } from 'antd';
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
import { Form } from '@ant-design/pro-editor';

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
const drawerCommonWidth = 310;

const Pipeline: FC<PipelineProps> = ({
  status = 'create',
  name = undefined,
  namespace = undefined,
}) => {
  const [form] = Form.useForm();
  const [active, setActive] = useState('process');
  const [pipelineDetails, setPipelineDetails] = useState({});
  const [taskList, setTaskList] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [taskDetails, setTaskDetails] = useState<any>({});

  const handleClick = () => {
    setVisible(!visible);
  };

  const handleTaskDetails = (task: any) => {
    setTaskDetails(task);
    form.setFieldsValue(task);
    setVisible(!visible);
    console.log('taskDetails:', taskDetails);
  };

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
                      onClick={handleClick}
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
                          onClick={handleClick}
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
                                      {/*<div*/}
                                      {/*  className={styles.pipelineJobExtra}*/}
                                      {/*  style={{ marginRight: 14 }}*/}
                                      {/*>*/}
                                      {/*  <PlusFill className={styles.pipelineAddStage} />*/}
                                      {/*</div>*/}
                                      <div className={styles.pipelineJobContent}>
                                        <Button
                                          shape="round"
                                          style={{
                                            width: '100%',
                                            color: '#595c62',
                                            fontSize: '14px',
                                          }}
                                          size="large"
                                          onClick={() => handleTaskDetails(stage)}
                                        >
                                          {stage?.taskRef?.name || '新建阶段'}
                                        </Button>
                                      </div>
                                      {/*<div*/}
                                      {/*  className={styles.pipelineJobExtra}*/}
                                      {/*  style={{ marginLeft: 14 }}*/}
                                      {/*>*/}
                                      {/*  <PlusFill className={styles.pipelineAddStage} />*/}
                                      {/*</div>*/}
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
                                  onClick={handleClick}
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
        form={form}
        title="编辑流水线"
        open={visible}
        onOpenChange={setVisible}
        width={800}
        submitter={{
          searchConfig: { submitText: '保存', resetText: '取消' },
        }}
        className={styles.pipelineDrawerForm}
        onFinish={async (values) => {
          console.log('提交的值:', values);
          // 这里可以添加保存逻辑
          setVisible(false);
          return true;
        }}
      >
        <ProFormText name={['metadata', 'name']} label="名称" rules={[{ required: true }]} />

        <ProFormList
          name={['spec', 'params']}
          label="全局参数"
          creatorButtonProps={{ position: 'top', creatorButtonText: '添加参数' }}
          itemRender={({ listDom, action }) => (
            <div className="commonBackgroundColor">
              <Flex align="center" gap={8}>
                {listDom}
                {action}
              </Flex>
            </div>
          )}
        >
          <ProFormGroup>
            <ProFormText
              width={drawerCommonWidth}
              name="name"
              label="参数名"
              rules={[{ required: true }]}
            />
            <ProFormSelect
              width={drawerCommonWidth}
              name="type"
              label="类型"
              options={paramTypeOptions}
              rules={[{ required: true }]}
            />
            <ProFormText width={drawerCommonWidth} name="description" label="描述" />
            <ProFormText width={drawerCommonWidth} name="default" label="默认值" />
          </ProFormGroup>
        </ProFormList>

        <ProFormList
          name={['spec', 'workspaces']}
          label="工作区"
          creatorButtonProps={{ position: 'top', creatorButtonText: '添加工作区' }}
          itemRender={({ listDom, action }) => (
            <div className="commonBackgroundColor">
              <Flex align="center" gap={8}>
                {listDom}
                {action}
              </Flex>
            </div>
          )}
        >
          <ProFormGroup>
            <ProFormText
              width={drawerCommonWidth}
              name="name"
              label="名称"
              rules={[{ required: true }]}
            />
            <ProFormText width={drawerCommonWidth} name="description" label="描述" />
          </ProFormGroup>
        </ProFormList>

        <ProFormList
          name={['spec', 'tasks']}
          label="任务"
          creatorButtonProps={{ position: 'top', creatorButtonText: '添加任务' }}
          itemRender={({ listDom, action }) => (
            <div className="commonBackgroundColor">
              <Flex align="center" gap={8}>
                {listDom}
                {action}
              </Flex>
            </div>
          )}
        >
          <ProFormGroup>
            <ProFormText
              width={drawerCommonWidth}
              name="name"
              label="任务名"
              rules={[{ required: true }]}
            />
            <ProFormText width={drawerCommonWidth} name="displayName" label="显示名" />
            <ProFormText width={drawerCommonWidth} name="description" label="描述" />
            <ProFormText
              width={drawerCommonWidth}
              name={['taskRef', 'name']}
              label="任务引用"
              rules={[{ required: true }]}
            />
            <ProFormDigit width={drawerCommonWidth} name="retries" label="重试次数" min={0} />
            <ProFormText width={drawerCommonWidth} name="timeout" label="超时时间" />
            <ProFormList
              name="params"
              label="参数"
              creatorButtonProps={{
                creatorButtonText: '添加参数',
                style: { width: drawerCommonWidth * 2 + 16 },
              }}
            >
              <ProFormGroup>
                <ProFormText
                  width={drawerCommonWidth - 36}
                  name="name"
                  placeholder="请输入参数名称"
                />
                <ProFormText
                  width={drawerCommonWidth - 36}
                  name="value"
                  placeholder="请输入参数值"
                />
              </ProFormGroup>
            </ProFormList>
            <ProFormList
              name="workspaces"
              label="工作区"
              creatorButtonProps={{
                creatorButtonText: '添加工作区',
                style: { width: drawerCommonWidth * 2 + 16 },
              }}
            >
              <ProFormGroup>
                <ProFormText width={drawerCommonWidth - 36} name="name" placeholder="请输入名称" />
                <ProFormText
                  width={drawerCommonWidth - 36}
                  name="workspace"
                  placeholder="请输入工作区"
                />
              </ProFormGroup>
            </ProFormList>
            <ProFormList
              name="runAfter"
              label="依赖任务"
              creatorButtonProps={{
                creatorButtonText: '添加依赖任务',
                style: { width: drawerCommonWidth * 2 + 16 },
              }}
            >
              <ProFormText
                width={(drawerCommonWidth - 36) * 2 + 16}
                name=""
                placeholder="请输入任务名称"
              />
            </ProFormList>
            <ProFormList
              name="when"
              label="条件"
              creatorButtonProps={{
                creatorButtonText: '添加条件',
                style: { width: drawerCommonWidth * 2 + 16 },
              }}
            >
              <ProFormGroup>
                <div
                  style={{
                    width: (drawerCommonWidth - 36) * 2 + 16,
                    display: 'inline-flex',
                    flexWrap: 'wrap',
                    columnGap: 16,
                  }}
                >
                  <ProFormText width={drawerCommonWidth - 36} name="input" />
                  <ProFormSelect
                    width={drawerCommonWidth - 36}
                    name="operator"
                    options={operatorOptions}
                  />
                  <ProFormText width={drawerCommonWidth - 36} name="values" />
                </div>
              </ProFormGroup>
            </ProFormList>
          </ProFormGroup>
        </ProFormList>

        <ProFormList
          name={['spec', 'finally']}
          label="最终任务"
          creatorButtonProps={{ position: 'top', creatorButtonText: '添加最终任务' }}
          itemRender={({ listDom, action }) => (
            <div className="commonBackgroundColor">
              <Flex align="center" gap={8}>
                {listDom}
                {action}
              </Flex>
            </div>
          )}
        >
          <ProFormGroup>
            <ProFormText
              width={drawerCommonWidth}
              name="name"
              label="任务名"
              rules={[{ required: true }]}
            />
            <ProFormText width={drawerCommonWidth} name="displayName" label="显示名" />
            <ProFormText width={drawerCommonWidth} name="description" label="描述" />
            <ProFormText
              width={drawerCommonWidth}
              name={['taskRef', 'name']}
              label="任务引用"
              rules={[{ required: true }]}
            />
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
