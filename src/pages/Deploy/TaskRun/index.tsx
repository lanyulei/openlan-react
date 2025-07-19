import { FC } from 'react';
import RunList from '@/pages/Deploy/components/RunList';

const TaskRun: FC = () => {
  return (
    <>
      <RunList
        resourceName="tasks"
        resourceRunsName="taskruns"
        describe="任务运行（TaskRun）是 Tekton 中用于实例化并执行一个 Task 的具体运行实例，负责管理 Task 中定义步骤（Steps）的实际执行过程及资源。"
        tableTitle="任务名称"
      />
    </>
  );
};

export default TaskRun;
