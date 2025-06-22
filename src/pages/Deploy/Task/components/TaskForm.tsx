import { FC, useState } from 'react';
import { PageContainer, ProForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { Button, Col, Flex, Input, message, Row } from 'antd';
import styles from './TaskForm.less';
import { MinusCircleOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const TaskForm: FC = () => {
  const [messageApi, messageContextHolder] = message.useMessage();

  const [taskForm, setTaskForm] = useState({
    apiVersion: 'tekton.dev/v1',
    kind: 'Task',
    metadata: {
      name: '',
      namespace: 'default',
      labels: {
        'app.kubernetes.io/name': 'task',
        'app.kubernetes.io/instance': 'task-instance',
      },
      annotations: {
        'tekton.dev/description': 'This is a sample task',
      },
    },
  });

  return (
    <>
      {messageContextHolder}

      <PageContainer>
        <div className={styles.taskForm}>
          <div className={styles.taskFormContainer}>
            <ProForm
              onFinish={async (values: any) => {
                console.log(values);
                messageApi.success('提交成功');
              }}
              initialValues={{
                name: '蚂蚁设计有限公司',
              }}
              onValuesChange={(values) => {
                setTaskForm((prev) => ({
                  ...prev,
                  ...values,
                }));
              }}
            >
              <div className={styles.taskFormHeader}>
                <span className={styles.verticalDivider} />
                <h3>基本信息</h3>
              </div>
              <Row gutter={16}>
                <Col span={12}>
                  <ProFormText
                    name={['metadata', 'name']}
                    label="名称"
                    placeholder="请输入名称"
                    rules={[
                      { required: true, message: '请输入名称' },
                      {
                        pattern: /^[a-zA-Z][a-zA-Z0-9-]*$/,
                        message: '只能输入字母、数字、横线，且以字母开头',
                      },
                    ]}
                  />
                </Col>
                <Col span={12}>
                  <ProFormSelect
                    label="命名空间"
                    name={['metadata', 'namespace']}
                    placeholder="请选择命名空间"
                    rules={[{ required: true, message: '请选择命名空间' }]}
                  />
                </Col>
              </Row>
              <ProForm.Item label="标签" name={['metadata', 'labels']}>
                {taskForm.metadata.labels && Object.keys(taskForm.metadata.labels).length > 0 ? (
                  <>
                    {Object.entries(taskForm.metadata.labels).map(([key, value]) => (
                      <Flex key={key} style={{ marginBottom: 8 }}>
                        <Row style={{ width: 'calc(100% - 55px)' }}>
                          <Col span={12}>
                            <Input value={key} placeholder="请输入键" />
                          </Col>
                          <Col span={12}>
                            <Input value={value} placeholder="请输入值" />
                          </Col>
                        </Row>
                        <div className={styles.plusMinusIcon}>
                          <PlusCircleOutlined className={styles.plusIcon} />
                          <MinusCircleOutlined className={styles.minusIcon} />
                        </div>
                      </Flex>
                    ))}
                  </>
                ) : (
                  <Button icon={<PlusOutlined />} style={{ width: '100%' }} type="dashed">
                    添加标签
                  </Button>
                )}
              </ProForm.Item>
              <ProForm.Item label="注解" name={['metadata', 'annotations']}>
                {taskForm.metadata.annotations &&
                Object.keys(taskForm.metadata.annotations).length > 0 ? (
                  <>
                    {Object.entries(taskForm.metadata.annotations).map(([key, value]) => (
                      <Flex key={key} style={{ marginBottom: 8 }}>
                        <Row style={{ width: 'calc(100% - 55px)' }}>
                          <Col span={12}>
                            <Input value={key} placeholder="请输入键" />
                          </Col>
                          <Col span={12}>
                            <Input value={value} placeholder="请输入值" />
                          </Col>
                        </Row>
                        <div className={styles.plusMinusIcon}>
                          <PlusCircleOutlined className={styles.plusIcon} />
                          <MinusCircleOutlined className={styles.minusIcon} />
                        </div>
                      </Flex>
                    ))}
                  </>
                ) : (
                  <Button icon={<PlusOutlined />} style={{ width: '100%' }} type="dashed">
                    添加注解
                  </Button>
                )}
              </ProForm.Item>
            </ProForm>
          </div>
        </div>
      </PageContainer>
    </>
  );
};

export default TaskForm;
