import { FC } from 'react';
import RunList from '@/pages/Deploy/components/RunList';

const PipelineRun: FC = () => {
  return (
    <>
      <RunList
        resourceName="pipelines"
        resourceRunsName="pipelineruns"
        describe="流水线运行（PipelineRun）是流水线（Pipeline）在被触发执行的一个具体实例，它包含了流水线（Pipeline）执行的状态、使用的参数、产生的日志和最终结果等运行时信息。"
        tableTitle="流水线名称"
      />
    </>
  );
};

export default PipelineRun;
