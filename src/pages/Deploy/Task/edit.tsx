import React, { FC, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import { useParams } from '@umijs/max';

const CreateTask: FC = () => {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();

  useEffect(() => {
    console.log('CreateTask mounted with namespace:', namespace, 'and name:', name);
  }, []);

  return (
    <>
      <TaskForm status="edit" namespace={namespace} name={name} />
    </>
  );
};

export default CreateTask;
