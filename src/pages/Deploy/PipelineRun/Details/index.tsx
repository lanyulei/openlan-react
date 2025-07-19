import { FC, useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Descriptions, Flex, Tabs, Tree } from 'antd';
import { resourceDetails, resourceListByNamespace } from '@/services/deploy/tekton';
import { useParams } from '@@/exports';
import styles from './index.less';
import { jsonToYaml } from '@/utils/tools/tools';
import MonacoEditor from '@/components/MonacoEditor';
import { podsLog } from '@/services/deploy/pods';

const PipelineRunsName = 'pipelineruns';
const TaskRunsName = 'taskruns';

const PipelineRunsDetails: FC = () => {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();
  const [pipelineRunDetails, setPipelineRunDetails] = useState<any>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [logContent, setLogContent] = useState<string>('');
  const [treeData, setTreeData] = useState<any[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  const getLogContent = async (status: any, stepIndex: any) => {
    const step = status?.steps?.[stepIndex];
    for (let taskRun of status.childReferences || []) {
      let _logRes = await podsLog(
        taskRun?.name + '-pod',
        namespace,
        {
          container: step?.container,
          timestamps: true,
        },
        {},
      );
      console.log(_logRes);
    }
    setLogContent('');
  };

  // @ts-ignore
  const handleStepClick = async (current: number) => {
    setCurrentStep(current);
    await getLogContent(pipelineRunDetails?.status, current);
  };

  const onSelect = async () => {
    await handleStepClick(1);
  };

  useEffect(() => {
    (async () => {
      const _res = await resourceDetails(PipelineRunsName, name, namespace, {});
      setPipelineRunDetails(_res.data || {});

      let _taskRunRes = await resourceListByNamespace(
        TaskRunsName,
        _res.data?.metadata?.namespace,
        {
          labelSelector: `tekton.dev/pipelineRun=${_res.data?.metadata?.name}`,
        },
        {},
      );
      let _treeData: any[] = [];
      let _expandedKeys: any[] = [];
      for (let i = 0; i < _taskRunRes.data?.items?.length; i++) {
        let taskRunName = _taskRunRes.data?.items[i]?.metadata?.name;
        let taskRunNamespace = _taskRunRes.data?.items[i]?.metadata?.namespace;
        let k = `${taskRunName}-${taskRunNamespace}-${i}`;
        let _item: any = {
          key: k,
          title: taskRunName,
          // icon: <TaskIcon style={{ width: 12, height: 12, marginTop: 8 }} />,
          children: [],
        };
        for (let j = 0; j < _taskRunRes.data?.items[i]?.status?.steps?.length; j++) {
          let stepName = _taskRunRes.data?.items[i]?.status?.steps[j]?.name;
          _item.children.push({
            key: `${taskRunName}-${taskRunNamespace}-${i}-${j}`,
            title: stepName,
            // icon: <StepIcon style={{ width: 12, height: 12, marginTop: 8 }} />,
            container: _taskRunRes.data?.items[i]?.status?.steps[j]?.container,
            terminationReason: _taskRunRes.data?.items[i]?.status?.steps[j]?.terminationReason,
          });
        }

        _expandedKeys.push(k);
        _treeData.push(_item);
      }

      setExpandedKeys(_expandedKeys);
      setTreeData(_treeData);

      await getLogContent(_res.data?.status, currentStep);
    })();
  }, []);

  return (
    <>
      <PageContainer content="PipelineRun 的执行详情包括其执行的具体任务序列、输入参数、输出结果、状态、关联的日志以及使用的资源（如工作区、任务引用）等关键信息。">
        <Card
          style={{
            marginBottom: 16,
          }}
          styles={{
            body: {
              padding: 16,
            },
          }}
        >
          <Descriptions
            column={2}
            items={[
              {
                key: '1',
                label: '名称',
                children: pipelineRunDetails.metadata?.name || '',
              },
              {
                key: '2',
                label: '命名空间',
                children: pipelineRunDetails.metadata?.namespace || '',
              },
              {
                key: '3',
                label: '流水线名称',
                children: pipelineRunDetails.spec?.pipelineRef?.name || '',
              },
              {
                key: '4',
                label: '状态',
                children: pipelineRunDetails.status?.conditions?.[0]?.reason || '',
              },
              {
                key: '5',
                label: '状态详情',
                children: pipelineRunDetails.status?.conditions?.[0]?.message || '',
              },
            ]}
          />
        </Card>
        <Card
          styles={{
            body: {
              padding: 16,
            },
          }}
        >
          <Flex gap={16}>
            <div className={styles.stepList}>
              <Tree
                showIcon
                expandedKeys={expandedKeys}
                onExpand={setExpandedKeys}
                onSelect={onSelect}
                treeData={treeData}
                titleRender={(nodeData) => (
                  <span
                    style={{
                      display: 'inline-block',
                      maxWidth: 200,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      verticalAlign: 'middle',
                    }}
                  >
                    {nodeData.title}
                  </span>
                )}
              />
            </div>
            <div style={{ width: 'calc(100% - 250px)' }}>
              <Tabs
                defaultActiveKey="1"
                type="card"
                items={[
                  {
                    key: '1',
                    label: '日志',
                    children: (
                      <div className={styles.logContent}>
                        <div className={styles.logValue}>
                          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                            {logContent}
                          </pre>
                        </div>
                      </div>
                    ),
                  },
                  {
                    key: '2',
                    label: '详情',
                    children: (
                      <MonacoEditor
                        codeType="yaml"
                        readOnly={true}
                        value={
                          jsonToYaml(
                            pipelineRunDetails?.status?.pipelineSpec?.steps?.[currentStep],
                          ) || ''
                        }
                      />
                    ),
                  },
                ]}
              />
            </div>
          </Flex>
        </Card>
      </PageContainer>
    </>
  );
};

export default PipelineRunsDetails;
