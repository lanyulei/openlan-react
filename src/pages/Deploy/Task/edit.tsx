import React, { FC } from 'react';
import TaskForm from './components/TaskForm';
import { useParams } from '@umijs/max';

const CreateTask: FC = () => {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();

  return (
    <>
      <TaskForm status="edit" namespace={namespace} name={name} />
    </>
  );
};

export default CreateTask;
