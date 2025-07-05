import { FC, useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Descriptions, Flex, Tabs } from 'antd';
import { resourceDetails } from '@/services/deploy/tekton';
import { useParams } from '@@/exports';
import styles from './index.less';
import { podsLog } from '@/services/deploy/pods';
import { jsonToYaml } from '@/utils/tools/tools';
import MonacoEditor from '@/components/MonacoEditor';

const TaskRunsName = 'taskruns';

const TaskRunsDetails: FC = () => {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();
  const [taskRunDetails, setTaskRunDetails] = useState<any>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [logContent, setLogContent] = useState<string>('');

  const getLogContent = async (status: any, stepIndex: any) => {
    const step = status?.steps?.[stepIndex];
    const _logRes = await podsLog(
      status?.podName,
      namespace,
      {
        container: step?.container,
        timestamps: true,
      },
      {},
    );
    setLogContent(_logRes.data?.content || '');
  };

  const handleStepClick = async (current: number) => {
    setCurrentStep(current);
    await getLogContent(taskRunDetails?.status, current);
  };

  useEffect(() => {
    (async () => {
      const _res = await resourceDetails(TaskRunsName, name, namespace, {});
      setTaskRunDetails(_res.data || {});

      await getLogContent(_res.data?.status, currentStep);
    })();
  }, []);

  return (
    <>
      <PageContainer content="TaskRun 的执行详情记录了每个 Step 的状态（如等待、运行中、成功或失败），并提供了日志、持续时间等详细信息，方便用户监控和排查问题。">
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
                children: taskRunDetails.metadata?.name || '',
              },
              {
                key: '2',
                label: '命名空间',
                children: taskRunDetails.metadata?.namespace || '',
              },
              {
                key: '3',
                label: '任务名称',
                children: taskRunDetails.spec?.taskRef?.name || '',
              },
              {
                key: '4',
                label: '状态',
                children: taskRunDetails.status?.conditions?.[0]?.reason || '',
              },
              {
                key: '5',
                label: '状态详情',
                children: taskRunDetails.status?.conditions?.[0]?.message || '',
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
              {taskRunDetails?.status?.steps?.map((step: any, idx: number) => (
                <Flex
                  key={step.name || idx}
                  style={{ marginBottom: idx === taskRunDetails.status.steps.length - 1 ? 0 : 6 }}
                >
                  <div></div>
                  <div
                    className={styles.stepItem}
                    style={currentStep === idx ? { background: '#f5f5f5' } : {}}
                    onClick={() => handleStepClick(idx)}
                  >
                    <div className={styles.stepName}>{step.name}</div>
                    <div className={styles.stepTerminationReason}>{step.terminationReason}</div>
                  </div>
                </Flex>
              ))}
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
                        height={Math.max(
                          200,
                          ((
                            jsonToYaml(taskRunDetails?.status?.taskSpec?.steps?.[currentStep]) || ''
                          ).split('\n').length +
                            1) *
                            20,
                        )}
                        codeType="yaml"
                        readOnly={true}
                        value={
                          jsonToYaml(taskRunDetails?.status?.taskSpec?.steps?.[currentStep]) || ''
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

export default TaskRunsDetails;
