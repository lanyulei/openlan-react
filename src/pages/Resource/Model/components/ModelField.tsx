import { SearchOutlined } from '@ant-design/icons';
import { Button, Flex, Input } from 'antd';
import { FC } from 'react';

const ModelField: FC = () => {
  return (
    <div>
      <Flex gap={10} wrap>
        <Button type="primary">新建字段</Button>
        <Button>新建分组</Button>
        <Button>字段预览</Button>
        <Input placeholder="请输入字段名" style={{ width: '300px' }} suffix={<SearchOutlined />} />
      </Flex>
    </div>
  );
};

export default ModelField;
