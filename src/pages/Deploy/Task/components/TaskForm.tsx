import { FC, useEffect, useState } from 'react';
import {
  PageContainer,
  ProForm,
  ProFormGroup,
  ProFormList,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, Col, Flex, Input, message, Row } from 'antd';
import styles from './TaskForm.less';
import { MinusCircleOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { getNamespaces } from '@/services/deploy/namespace';
import MonacoEditor from '@/components/MonacoEditor';

const initialScript = `#!/bin/bash

#############################################
#                                           #
#          Welcome to the task script.      #
#                                           #
#############################################

`;

const TaskForm: FC = () => {
  const [messageApi, messageContextHolder] = message.useMessage();
  const [namespaceList, setNamespaceList] = useState<string[]>([]);

  const [taskForm, setTaskForm] = useState({
    apiVersion: 'tekton.dev/v1',
    kind: 'Task',
    metadata: {
      name: '',
      namespace: 'default',
      labels: {},
      annotations: {},
    },
    spec: {
      steps: [
        {
          name: 'example-step',
        },
      ],
    },
  });

  const addLabel = () => {
    setTaskForm((prev: any) => {
      const labels = { ...prev.metadata.labels };
      // 生成唯一 key
      let idx = 1;
      let newKey = `key${idx}`;
      while (labels.hasOwnProperty(newKey)) {
        idx += 1;
        newKey = `key${idx}`;
      }
      labels[newKey] = '';
      return {
        ...prev,
        metadata: {
          ...prev.metadata,
          labels,
        },
      };
    });
  };

  const addAnnotations = () => {
    setTaskForm((prev: any) => {
      const annotations = { ...prev.metadata.annotations };
      // 生成唯一 key
      let idx = 1;
      let newKey = `key${idx}`;
      while (annotations.hasOwnProperty(newKey)) {
        idx += 1;
        newKey = `key${idx}`;
      }
      annotations[newKey] = '';
      return {
        ...prev,
        metadata: {
          ...prev.metadata,
          annotations,
        },
      };
    });
  };

  useEffect(() => {
    (async () => {
      const _res = await getNamespaces({}, {});
      setNamespaceList(_res.data?.items || []);
    })();
  }, []);

  return (
    <>
      {messageContextHolder}

      <PageContainer>
        <div className={styles.taskForm}>
          <div className={styles.taskFormContainer}>
            <ProForm
              onFinish={async (values: any) => {
                console.log({
                  ...values,
                  ...taskForm,
                });
                messageApi.success('提交成功');
              }}
              initialValues={taskForm}
              onValuesChange={(_, allValues) => {
                function deepMerge(target: any, source: any): any {
                  if (Array.isArray(source)) {
                    return source; // 数组直接覆盖
                  }
                  if (
                    typeof target !== 'object' ||
                    typeof source !== 'object' ||
                    target === null ||
                    source === null
                  ) {
                    return source;
                  }
                  const result = { ...target };
                  for (const key of Object.keys(source)) {
                    result[key] = deepMerge(target[key], source[key]);
                  }
                  return result;
                }

                setTaskForm((prev) => deepMerge(prev, allValues));
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
                    options={namespaceList.map(
                      (ns) =>
                        ({
                          // @ts-ignore
                          label: ns.metadata.name,
                          // @ts-ignore
                          value: ns.metadata.name,
                        } as any),
                    )}
                  />
                </Col>
              </Row>
              <ProFormText
                name={['spec', 'displayName']}
                tooltip="提供一个更友好、易读的显示名称（用于 UI 或日志），而不影响实际运行逻辑。"
                label="别称"
                placeholder="请输入别称"
              />
              <ProFormTextArea
                name={['spec', 'description']}
                placeholder="请输入任务描述"
                label="描述"
              />
              <ProForm.Item label="标签" name={['metadata', 'labels']}>
                {taskForm.metadata.labels && Object.keys(taskForm.metadata.labels).length > 0 ? (
                  <>
                    {Object.entries(taskForm.metadata.labels).map(([key, value], index, arr) => (
                      <Flex key={key} style={{ marginBottom: index === arr.length - 1 ? 0 : 8 }}>
                        <Row style={{ width: 'calc(100% - 55px)' }}>
                          <Col span={12}>
                            <Input
                              value={key}
                              placeholder="请输入键"
                              onChange={(e) => {
                                const newKey = e.target.value;
                                setTaskForm((prev: any) => {
                                  const labels = { ...prev.metadata.labels } as Record<
                                    string,
                                    string
                                  >;
                                  const entries = Object.entries(labels);
                                  const idx = entries.findIndex(([k]) => k === key);
                                  if (idx === -1) return prev;
                                  entries[idx][0] = newKey;
                                  // 构建保持顺序的新对象
                                  const newLabels: Record<string, string> = {};
                                  entries.forEach(([k, v]) => {
                                    newLabels[k] = v;
                                  });
                                  return {
                                    ...prev,
                                    metadata: {
                                      ...prev.metadata,
                                      labels: newLabels,
                                    },
                                  };
                                });
                              }}
                            />
                          </Col>
                          <Col span={12}>
                            <Input
                              value={typeof value === 'string' ? value : ''}
                              placeholder="请输入值"
                              onChange={(e) => {
                                const newValue = e.target.value;
                                setTaskForm((prev) => {
                                  const labels = { ...prev.metadata.labels, [key]: newValue };
                                  return {
                                    ...prev,
                                    metadata: {
                                      ...prev.metadata,
                                      labels,
                                    },
                                  };
                                });
                              }}
                            />
                          </Col>
                        </Row>
                        <div className={styles.plusMinusIcon}>
                          <PlusCircleOutlined className={styles.plusIcon} onClick={addLabel} />
                          <MinusCircleOutlined
                            className={styles.minusIcon}
                            onClick={() => {
                              setTaskForm((prev: any) => {
                                const labels = { ...prev.metadata.labels };
                                delete labels[key];
                                return {
                                  ...prev,
                                  metadata: {
                                    ...prev.metadata,
                                    labels,
                                  },
                                };
                              });
                            }}
                          />
                        </div>
                      </Flex>
                    ))}
                  </>
                ) : (
                  <Button
                    icon={<PlusOutlined />}
                    style={{ width: '100%' }}
                    type="dashed"
                    onClick={addLabel}
                  >
                    添加标签
                  </Button>
                )}
              </ProForm.Item>
              <ProForm.Item label="注解" name={['metadata', 'annotations']}>
                {taskForm.metadata.annotations &&
                Object.keys(taskForm.metadata.annotations).length > 0 ? (
                  <>
                    {Object.entries(taskForm.metadata.annotations).map(
                      ([key, value], index, arr) => (
                        <Flex key={key} style={{ marginBottom: index === arr.length - 1 ? 0 : 8 }}>
                          <Row style={{ width: 'calc(100% - 55px)' }}>
                            <Col span={12}>
                              <Input
                                value={key}
                                placeholder="请输入键"
                                onChange={(e) => {
                                  const newKey = e.target.value;
                                  setTaskForm((prev: any) => {
                                    const annotations = { ...prev.metadata.annotations };
                                    const entries = Object.entries(annotations);
                                    const idx = entries.findIndex(([k]) => k === key);
                                    if (idx === -1) return prev;
                                    // 保持顺序并修改 key
                                    entries[idx][0] = newKey;
                                    const newAnnotations: any = {};
                                    entries.forEach(([k, v]) => {
                                      newAnnotations[k] = v;
                                    });
                                    return {
                                      ...prev,
                                      metadata: {
                                        ...prev.metadata,
                                        annotations: newAnnotations,
                                      },
                                    };
                                  });
                                }}
                              />
                            </Col>
                            <Col span={12}>
                              <Input
                                value={typeof value === 'string' ? value : ''}
                                placeholder="请输入值"
                                onChange={(e) => {
                                  const newValue = e.target.value;
                                  setTaskForm((prev: any) => {
                                    const annotations = {
                                      ...prev.metadata.annotations,
                                      [key]: newValue,
                                    };
                                    return {
                                      ...prev,
                                      metadata: {
                                        ...prev.metadata,
                                        annotations,
                                      },
                                    };
                                  });
                                }}
                              />
                            </Col>
                          </Row>
                          <div className={styles.plusMinusIcon}>
                            <PlusCircleOutlined
                              className={styles.plusIcon}
                              onClick={addAnnotations}
                            />
                            <MinusCircleOutlined
                              className={styles.minusIcon}
                              onClick={() => {
                                setTaskForm((prev: any) => {
                                  const annotations = { ...prev.metadata.annotations };
                                  delete annotations[key];
                                  return {
                                    ...prev,
                                    metadata: {
                                      ...prev.metadata,
                                      annotations,
                                    },
                                  };
                                });
                              }}
                            />
                          </div>
                        </Flex>
                      ),
                    )}
                  </>
                ) : (
                  <Button
                    icon={<PlusOutlined />}
                    style={{ width: '100%' }}
                    type="dashed"
                    onClick={addAnnotations}
                  >
                    添加注解
                  </Button>
                )}
              </ProForm.Item>
              <div className={styles.taskFormHeader}>
                <span className={styles.verticalDivider} />
                <h3>步骤定义</h3>
              </div>
              <>
                {taskForm.spec.steps?.map((step, idx) => (
                  <div key={idx}>
                    <div style={{ marginBottom: 8, ...(idx > 0 ? { marginTop: 15 } : {}) }}>
                      步骤 {idx + 1}
                    </div>
                    <div className={styles.stepItem}>
                      <ProFormText
                        name={['spec', 'steps', idx, 'name']}
                        label="步骤名称"
                        placeholder="请输入步骤名称"
                        rules={[{ required: true, message: '请输入步骤名称' }]}
                      />
                      <ProFormText
                        name={['spec', 'steps', idx, 'image']}
                        label="容器镜像"
                        placeholder="请输入容器镜像"
                        rules={[{ required: true, message: '请输入容器镜像' }]}
                      />
                      <ProForm.Item label="脚本" name={['spec', 'steps', idx, 'script']}>
                        <MonacoEditor value={initialScript} />
                      </ProForm.Item>
                      <ProFormList
                        name={['spec', 'steps', idx, 'env']}
                        label="环境变量"
                        creatorButtonProps={{
                          position: 'bottom',
                          creatorButtonText: '添加环境变量',
                        }}
                        itemRender={({ listDom, action }) => (
                          <Flex align="center" gap={8}>
                            {listDom}
                            {action}
                          </Flex>
                        )}
                      >
                        <ProFormGroup key="env-group">
                          <ProFormText
                            name="name"
                            placeholder="变量名"
                            rules={[{ required: true, message: '请输入变量名' }]}
                          />
                          <ProFormText
                            name="value"
                            placeholder="变量值"
                            rules={[{ required: true, message: '请输入变量值' }]}
                          />
                        </ProFormGroup>
                      </ProFormList>
                      <ProFormList
                        name={['spec', 'steps', idx, 'volumeMounts']}
                        label="卷挂载"
                        creatorButtonProps={{ position: 'bottom', creatorButtonText: '添加卷挂载' }}
                        itemRender={({ listDom, action }) => (
                          <Flex align="center" gap={8}>
                            {listDom}
                            {action}
                          </Flex>
                        )}
                      >
                        <ProFormGroup key="volume-group">
                          <ProFormText
                            name="name"
                            placeholder="卷名"
                            rules={[{ required: true, message: '请输入卷名' }]}
                          />
                          <ProFormText
                            name="mountPath"
                            placeholder="挂载路径"
                            rules={[{ required: true, message: '请输入挂载路径' }]}
                          />
                        </ProFormGroup>
                      </ProFormList>
                      <Row gutter={16}>
                        <Col span={12}>
                          <ProFormText
                            name={['spec', 'steps', idx, 'workingDir']}
                            label="工作目录"
                            placeholder="请输入工作目录"
                          />
                        </Col>
                        <Col span={12}>
                          <ProFormText
                            name={['spec', 'steps', idx, 'securityContext', 'runAsUser']}
                            label="运行用户ID"
                            placeholder="请输入用户ID"
                          />
                        </Col>
                        <Col span={12}>
                          <ProFormText
                            name={['spec', 'steps', idx, 'timeout']}
                            label="超时时间"
                            placeholder="如 5m，10s"
                          />
                        </Col>
                        <Col span={12}>
                          <ProFormSelect
                            name={['spec', 'steps', idx, 'onError']}
                            label="错误处理"
                            placeholder="请选择错误处理方式"
                            options={[
                              { label: '继续（continue）', value: 'continue' },
                              { label: '停止并失败（stopAndFail）', value: 'stopAndFail' },
                            ]}
                          />
                        </Col>
                        <Col span={12}>
                          <ProFormText
                            name={['spec', 'steps', idx, 'stdoutConfig', 'path']}
                            label="标准输出路径"
                            placeholder="如 /logs/stdout.log"
                          />
                        </Col>
                        <Col span={12}>
                          <ProFormText
                            name={['spec', 'steps', idx, 'stderrConfig', 'path']}
                            label="标准错误路径"
                            placeholder="如 /logs/stderr.log"
                          />
                        </Col>
                      </Row>
                    </div>
                  </div>
                ))}
                <Button
                  icon={<PlusOutlined />}
                  style={{ width: '100%', marginTop: 10, marginBottom: 24 }}
                  type="dashed"
                  onClick={() => {
                    setTaskForm((prev: any) => ({
                      ...prev,
                      spec: {
                        ...prev.spec,
                        steps: [
                          ...prev.spec.steps,
                          {
                            name: '',
                            image: '',
                            script: initialScript,
                            env: [],
                            volumeMounts: [],
                            workingDir: '',
                            securityContext: { runAsUser: '' },
                            timeout: '',
                            onError: '',
                            stdoutConfig: { path: '' },
                            stderrConfig: { path: '' },
                          },
                        ],
                      },
                    }));
                  }}
                >
                  添加步骤
                </Button>
              </>
              <div className={styles.taskFormHeader}>
                <span className={styles.verticalDivider} />
                <h3>参数声明</h3>
              </div>
              <ProFormList
                name={['spec', 'params']}
                creatorButtonProps={{ position: 'bottom', creatorButtonText: '添加参数' }}
                itemRender={({ listDom, action }) => (
                  <Flex align="center" gap={8}>
                    {listDom}
                    {action}
                  </Flex>
                )}
              >
                <ProFormGroup key="param-group">
                  <ProFormText
                    name="name"
                    label="参数名"
                    placeholder="请输入参数名"
                    rules={[{ required: true, message: '请输入参数名' }]}
                  />
                  <ProFormSelect
                    name="type"
                    label="类型"
                    placeholder="请选择类型"
                    options={[
                      { label: 'string', value: 'string' },
                      { label: 'array', value: 'array' },
                    ]}
                    rules={[{ required: true, message: '请选择类型' }]}
                  />
                  <ProFormText name="description" label="描述" placeholder="请输入参数描述" />
                  <ProFormText name="default" label="默认值" placeholder="请输入默认值" />
                </ProFormGroup>
              </ProFormList>
              <div className={styles.taskFormHeader}>
                <span className={styles.verticalDivider} />
                <h3>结果配置</h3>
              </div>
              <ProFormList
                name={['spec', 'results']}
                creatorButtonProps={{ position: 'bottom', creatorButtonText: '添加结果' }}
                itemRender={({ listDom, action }) => (
                  <Flex align="center" gap={8}>
                    {listDom}
                    {action}
                  </Flex>
                )}
              >
                <ProFormGroup key="result-group">
                  <ProFormText
                    name="name"
                    label="结果名"
                    placeholder="请输入结果名"
                    rules={[{ required: true, message: '请输入结果名' }]}
                  />
                  <ProFormText name="description" label="描述" placeholder="请输入结果描述" />
                  <ProFormSelect
                    name="type"
                    label="类型"
                    placeholder="请选择类型"
                    options={[
                      { label: 'string', value: 'string' },
                      { label: 'array', value: 'array' },
                    ]}
                    rules={[{ required: true, message: '请选择类型' }]}
                  />
                  <ProFormText
                    name="value"
                    label="值"
                    placeholder="请输入结果值，如 $(steps.step-name.results.result-name)"
                  />
                </ProFormGroup>
              </ProFormList>
              <div className={styles.taskFormHeader}>
                <span className={styles.verticalDivider} />
                <h3>工作空间</h3>
              </div>
              <ProFormList
                name={['spec', 'workspaces']}
                creatorButtonProps={{ position: 'bottom', creatorButtonText: '添加工作空间' }}
                itemRender={({ listDom, action }) => (
                  <Flex align="center" gap={8}>
                    {listDom}
                    {action}
                  </Flex>
                )}
              >
                <ProFormGroup key="workspace-group">
                  <ProFormText
                    name="name"
                    label="名称"
                    placeholder="请输入工作空间名称"
                    rules={[{ required: true, message: '请输入名称' }]}
                  />
                  <ProFormText name="description" label="描述" placeholder="请输入描述" />
                  <ProFormText
                    name="mountPath"
                    label="挂载路径"
                    placeholder="如 /workspace/source"
                    rules={[{ required: true, message: '请输入挂载路径' }]}
                  />
                  <ProFormSelect
                    name="readOnly"
                    label="只读"
                    placeholder="请选择"
                    options={[
                      { label: '是', value: true },
                      { label: '否', value: false },
                    ]}
                    rules={[{ required: true, message: '请选择是否只读' }]}
                  />
                </ProFormGroup>
              </ProFormList>
              <div className={styles.taskFormHeader}>
                <span className={styles.verticalDivider} />
                <h3>存储卷</h3>
              </div>
              <ProFormList
                name={['spec', 'volumes']}
                creatorButtonProps={{ position: 'bottom', creatorButtonText: '添加存储卷' }}
                itemRender={({ listDom, action }) => (
                  <Flex align="center" gap={8}>
                    {listDom}
                    {action}
                  </Flex>
                )}
              >
                <ProFormGroup key="volume-group">
                  <ProFormText
                    name="name"
                    label="卷名"
                    placeholder="请输入卷名"
                    rules={[{ required: true, message: '请输入卷名' }]}
                  />
                  <ProFormSelect
                    name="type"
                    label="卷类型"
                    placeholder="请选择卷类型"
                    options={[
                      { label: 'emptyDir', value: 'emptyDir' },
                      // 可根据需要扩展更多类型
                    ]}
                    rules={[{ required: true, message: '请选择卷类型' }]}
                  />
                  {/* 仅当类型为 emptyDir 时显示 */}
                  <ProForm.Item
                    noStyle
                    shouldUpdate={(prev: { type: any }, curr: { type: any }) =>
                      prev?.type !== curr?.type
                    }
                  >
                    {({ type }: { type?: string }) =>
                      type === 'emptyDir' ? (
                        <ProFormText
                          name={['emptyDir', 'medium']}
                          label="介质类型"
                          placeholder="可选，留空为默认"
                        />
                      ) : null
                    }
                  </ProForm.Item>
                </ProFormGroup>
              </ProFormList>
              <div className={styles.taskFormHeader}>
                <span className={styles.verticalDivider} />
                <h3>步骤模版</h3>
              </div>
              <ProFormList
                name={['spec', 'stepTemplate', 'env']}
                label="环境变量"
                creatorButtonProps={{ position: 'bottom', creatorButtonText: '添加环境变量' }}
                itemRender={({ listDom, action }) => (
                  <Flex align="center" gap={8}>
                    {listDom}
                    {action}
                  </Flex>
                )}
              >
                <ProFormGroup key="step-template-env-group">
                  <ProFormText
                    name="name"
                    label="变量名"
                    placeholder="请输入变量名"
                    rules={[{ required: true, message: '请输入变量名' }]}
                  />
                  <ProFormText
                    name="value"
                    label="变量值"
                    placeholder="请输入变量值"
                    rules={[{ required: true, message: '请输入变量值' }]}
                  />
                </ProFormGroup>
              </ProFormList>
              <ProFormGroup title="安全上下文">
                <ProFormSelect
                  name={['spec', 'stepTemplate', 'securityContext', 'runAsNonRoot']}
                  label="以非 root 用户运行"
                  placeholder="请选择"
                  options={[
                    { label: '是', value: true },
                    { label: '否', value: false },
                  ]}
                  rules={[{ required: true, message: '请选择是否以非 root 用户运行' }]}
                />
              </ProFormGroup>
              <div className={styles.taskFormHeader}>
                <span className={styles.verticalDivider} />
                <h3>辅助容器</h3>
              </div>
              <ProFormList
                name={['spec', 'sidecars']}
                creatorButtonProps={{ position: 'bottom', creatorButtonText: '添加辅助容器' }}
                itemRender={({ listDom, action }) => (
                  <Flex align="center" gap={8}>
                    {listDom}
                    {action}
                  </Flex>
                )}
              >
                <ProFormGroup key="sidecar-group">
                  <ProFormText
                    name="name"
                    label="名称"
                    placeholder="请输入辅助容器名称"
                    rules={[{ required: true, message: '请输入名称' }]}
                  />
                  <ProFormText
                    name="image"
                    label="镜像"
                    placeholder="请输入镜像"
                    rules={[{ required: true, message: '请输入镜像' }]}
                  />
                  <ProFormText
                    name="command"
                    label="命令"
                    placeholder='如 ["tail"]，多个用英文逗号分隔'
                    tooltip="可填写多个命令，如 tail"
                    transform={(value) =>
                      value ? value.split(',').map((v: string) => v.trim()) : undefined
                    }
                  />
                  <ProFormText
                    name="args"
                    label="参数"
                    placeholder='如 ["-f", "/dev/null"]，多个用英文逗号分隔'
                    tooltip="可填写多个参数，如 -f,/dev/null"
                    transform={(value) =>
                      value ? value.split(',').map((v: string) => v.trim()) : undefined
                    }
                  />
                </ProFormGroup>
              </ProFormList>
            </ProForm>
          </div>
        </div>
      </PageContainer>
    </>
  );
};

export default TaskForm;
