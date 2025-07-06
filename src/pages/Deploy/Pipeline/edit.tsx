import React, { FC } from 'react';
import Pipeline from './components/Pipeline';
import { useParams } from '@umijs/max';

const CreatePipeline: FC = () => {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();

  return (
    <>
      <Pipeline status="edit" namespace={namespace} name={name} />
    </>
  );
};

export default CreatePipeline;
