import { SelectLang as UmiSelectLang } from '@umijs/max';
import React from 'react';

export type SiderTheme = 'light' | 'dark';

export const SelectLang = () => {
  return (
    <UmiSelectLang
      style={{
        padding: 4,
      }}
    />
  );
};

export const Question = () => {
  return (
    // <div
    //   style={{
    //     display: 'flex',
    //     height: 26,
    //   }}
    //   onClick={() => {
    //     window.open('https://pro.ant.design/docs/getting-started');
    //   }}
    // >
    //   <QuestionCircleOutlined />
    // </div>
    <></>
  );
};
