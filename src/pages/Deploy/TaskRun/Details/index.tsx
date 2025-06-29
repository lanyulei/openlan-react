import { FC, useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Flex, Steps } from 'antd';
import { resourceDetails } from '@/services/deploy/tekton';
import { useParams } from '@@/exports';
import styles from './index.less';

const TaskRunsName = 'taskruns';

const TaskRunsDetails: FC = () => {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();
  const [taskRunDetails, setTaskRunDetails] = useState<any>({});
  const [currentStep, setCurrentStep] = useState(0);

  const handleStepClick = (current: number) => {
    setCurrentStep(current);
  };

  useEffect(() => {
    (async () => {
      const _res = await resourceDetails(TaskRunsName, name, namespace, {});
      setTaskRunDetails(_res.data || {});
    })();
  }, []);

  return (
    <>
      <PageContainer content="TaskRun 的执行详情记录了每个 Step 的状态（如等待、运行中、成功或失败），并提供了日志、持续时间等详细信息，方便用户监控和排查问题。">
        <Card
          styles={{
            body: {
              padding: 16,
            },
          }}
        >
          <Flex gap={16}>
            <div className={styles.stepList}>
              <Steps
                rootClassName="custom-steps-ellipsis"
                progressDot
                current={currentStep}
                direction="vertical"
                onChange={handleStepClick}
                items={taskRunDetails?.status?.steps.map((step: any) => ({
                  title: step.name,
                }))}
              />
            </div>
            <div className={styles.logContent}>
              <div className={styles.logValue}></div>
            </div>
          </Flex>
        </Card>
      </PageContainer>
    </>
  );
};

export default TaskRunsDetails;
