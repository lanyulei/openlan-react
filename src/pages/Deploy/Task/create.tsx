import React, { FC } from 'react';
import TaskForm from './components/TaskForm';

const CreateTask: FC = () => {
  return (
    <>
      <TaskForm status="create" />
    </>
  );
};

export default CreateTask;
