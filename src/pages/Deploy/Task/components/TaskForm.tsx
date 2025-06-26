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
import {
  DeleteOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { getNamespaces } from '@/services/deploy/namespace';
import MonacoEditor from '@/components/MonacoEditor';
import { createTask, updateTask } from '@/services/deploy/tasks';

interface TaskFormProps {
  status: 'create' | 'edit';
}

const initialScript = `#!/bin/bash

#############################################
#                                           #
#          Welcome to the task script.      #
#                                           #
#############################################

`;

const TaskForm: FC<TaskFormProps> = ({ status = 'create' }) => {
  const [form] = ProForm.useForm();
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
      steps: [],
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
              form={form}
              onFinish={async (values: any) => {
                // @ts-ignore
                for (let param of taskForm.spec?.params || []) {
                  if (param.type === 'object' && param.properties) {
                    let properties = JSON.parse(JSON.stringify(param.properties));
                    param.properties = {};

                    for (let prop of properties) {
                      param.properties[prop.key] = prop.value;
                    }
                  }
                }

                // @ts-ignore
                for (let result of taskForm.spec?.results || []) {
                  if (result.type === 'object' && result.properties) {
                    let properties = JSON.parse(JSON.stringify(result.properties));
                    result.properties = {};

                    for (let prop of properties) {
                      result.properties[prop.key] = prop.value;
                    }
                  }
                }

                const _data = {
                  ...values,
                  ...taskForm,
                };

                if (status === 'create') {
                  console.log(_data);
                  await createTask(_data.metadata.namespace, _data, {});
                  messageApi.success('任务创建成功');
                } else {
                  await updateTask(_data.metadata.name, _data.metadata.namespace, _data, {});
                  messageApi.success('任务更新成功');
                }
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
                    <div
                      className={styles.stepHeader}
                      style={{
                        marginBottom: 8,
                        ...(idx > 0 ? { marginTop: 15 } : {}),
                      }}
                    >
                      <div>步骤 {idx + 1}</div>
                      <div>
                        <DeleteOutlined
                          className={styles.stepDeleteIcon}
                          onClick={() => {
                            setTaskForm((prev: any) => {
                              const steps = [...prev.spec.steps];
                              steps.splice(idx, 1);
                              return {
                                ...prev,
                                spec: {
                                  ...prev.spec,
                                  steps,
                                },
                              };
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div className={styles.commonBackgroundColor}>
                      <Row gutter={16}>
                        <Col span={12}>
                          <ProFormText
                            name={['spec', 'steps', idx, 'name']}
                            label="步骤名称"
                            placeholder="请输入步骤名称"
                            rules={[{ required: true, message: '请输入步骤名称' }]}
                          />
                        </Col>
                        <Col span={12}>
                          <ProFormText
                            name={['spec', 'steps', idx, 'image']}
                            label="容器镜像"
                            placeholder="请输入容器镜像"
                            rules={[{ required: true, message: '请输入容器镜像' }]}
                          />
                        </Col>
                      </Row>
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
                            width={360}
                            name="name"
                            placeholder="变量名"
                            rules={[{ required: true, message: '请输入变量名' }]}
                          />
                          <ProFormText
                            width={360}
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
                            width={360}
                            name="name"
                            placeholder="卷名"
                            rules={[{ required: true, message: '请输入卷名' }]}
                          />
                          <ProFormText
                            width={360}
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
                            name={['spec', 'steps', idx, 'computeResources', 'requests', 'cpu']}
                            label="请求 CPU"
                            placeholder="如 500m"
                          />
                        </Col>
                        <Col span={12}>
                          <ProFormText
                            name={['spec', 'steps', idx, 'computeResources', 'requests', 'memory']}
                            label="请求 内存"
                            placeholder="如 1Gi"
                          />
                        </Col>
                        <Col span={12}>
                          <ProFormText
                            name={['spec', 'steps', idx, 'computeResources', 'limits', 'cpu']}
                            label="限制 CPU"
                            placeholder="如 800m"
                          />
                        </Col>
                        <Col span={12}>
                          <ProFormText
                            name={['spec', 'steps', idx, 'computeResources', 'limits', 'memory']}
                            label="限制 内存"
                            placeholder="如 2Gi"
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
                {(_, idx) => (
                  <div>
                    <div style={{ marginBottom: 8, ...(idx > 0 ? { marginTop: 15 } : {}) }}>
                      参数 {idx + 1}
                    </div>
                    <div
                      className={styles.commonBackgroundColor}
                      style={{ paddingBottom: 0, marginBottom: 10 }}
                    >
                      <ProFormGroup key="param-group">
                        <ProFormText
                          width={241}
                          name="name"
                          label="参数名"
                          placeholder="请输入参数名"
                          rules={[{ required: true, message: '请输入参数名' }]}
                        />
                        <ProFormSelect
                          width={241}
                          name="type"
                          label="类型"
                          placeholder="请选择类型"
                          options={[
                            { label: '字符串', value: 'string' },
                            { label: '数组', value: 'array' },
                            { label: '对象', value: 'object' },
                          ]}
                          rules={[{ required: true, message: '请选择类型' }]}
                        />
                        {(() => {
                          const params = (taskForm as any)?.spec?.params;
                          const type = Array.isArray(params) ? params[idx]?.type : undefined;
                          if (type === 'string') {
                            return (
                              <>
                                <ProFormText
                                  width={241}
                                  name="default"
                                  label="默认值"
                                  placeholder="请输入默认值"
                                />
                                <ProFormSelect
                                  width={756}
                                  name="enum"
                                  label="枚举值"
                                  placeholder="请输入枚举值"
                                  mode="tags"
                                />
                              </>
                            );
                          }
                          if (type === 'array') {
                            return (
                              <ProFormSelect
                                width={756}
                                name="default"
                                label="默认值"
                                placeholder="请输入默认值"
                                mode="tags"
                              />
                            );
                          }
                          if (type === 'object') {
                            return (
                              <ProFormList
                                label="属性"
                                name="properties"
                                creatorButtonProps={{
                                  position: 'bottom',
                                  creatorButtonText: '添加属性',
                                  style: { width: 550 },
                                }}
                                itemRender={({ listDom, action }) => (
                                  <Flex align="center" gap={8}>
                                    {listDom}
                                    {action}
                                  </Flex>
                                )}
                              >
                                {(_, propIdx) => (
                                  <ProFormGroup key={`object-prop-group-${propIdx}`}>
                                    <ProFormText
                                      width={241}
                                      name="key"
                                      placeholder="请输入属性名"
                                      rules={[{ required: true, message: '请输入属性名' }]}
                                    />
                                    <ProFormSelect
                                      width={241}
                                      name={['value', 'type']}
                                      placeholder="请选择类型"
                                      options={[
                                        { label: '字符串', value: 'string' },
                                        // 可扩展更多类型
                                      ]}
                                      rules={[{ required: true, message: '请选择类型' }]}
                                    />
                                  </ProFormGroup>
                                )}
                              </ProFormList>
                            );
                          }
                          return null;
                        })()}
                        <ProFormTextArea
                          width={756}
                          name="description"
                          label="描述"
                          placeholder="请输入参数描述"
                        />
                      </ProFormGroup>
                    </div>
                  </div>
                )}
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
                {(_, idx) => (
                  <div>
                    <div style={{ marginBottom: 8, ...(idx > 0 ? { marginTop: 15 } : {}) }}>
                      结果 {idx + 1}
                    </div>
                    <div
                      className={styles.commonBackgroundColor}
                      style={{ paddingBottom: 0, marginBottom: 10 }}
                    >
                      <ProFormGroup key="result-group">
                        <ProFormText
                          width={370}
                          name="name"
                          label="结果名"
                          placeholder="请输入结果名"
                          rules={[{ required: true, message: '请输入结果名' }]}
                        />
                        <ProFormSelect
                          width={370}
                          name="type"
                          label="类型"
                          placeholder="请选择类型"
                          options={[
                            { label: '字符串', value: 'string' },
                            { label: '数组', value: 'array' },
                            { label: '对象', value: 'object' },
                          ]}
                          rules={[{ required: true, message: '请选择类型' }]}
                        />
                        {(() => {
                          const result = (taskForm as any)?.spec?.results;
                          const type = Array.isArray(result) ? result[idx]?.type : undefined;
                          if (type === 'object') {
                            return (
                              <ProFormList
                                label="属性"
                                name="properties"
                                creatorButtonProps={{
                                  position: 'bottom',
                                  creatorButtonText: '添加属性',
                                  style: { width: 756 },
                                }}
                                itemRender={({ listDom, action }) => (
                                  <Flex align="center" gap={8}>
                                    {listDom}
                                    {action}
                                  </Flex>
                                )}
                              >
                                {(_, propIdx) => (
                                  <ProFormGroup key={`object-prop-group-${propIdx}`}>
                                    <ProFormText
                                      width={340}
                                      name="key"
                                      placeholder="请输入属性名"
                                      rules={[{ required: true, message: '请输入属性名' }]}
                                    />
                                    <ProFormSelect
                                      width={340}
                                      name={['value', 'type']}
                                      placeholder="请选择类型"
                                      options={[
                                        { label: '字符串', value: 'string' },
                                        // 可扩展更多类型
                                      ]}
                                      rules={[{ required: true, message: '请选择类型' }]}
                                    />
                                  </ProFormGroup>
                                )}
                              </ProFormList>
                            );
                          }
                          return null;
                        })()}
                        <ProFormTextArea
                          name="description"
                          label="描述"
                          width={756}
                          placeholder="请输入结果描述"
                        />
                      </ProFormGroup>
                    </div>
                  </div>
                )}
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
                {(_, idx) => (
                  <div>
                    <div style={{ marginBottom: 8, ...(idx > 0 ? { marginTop: 15 } : {}) }}>
                      工作空间 {idx + 1}
                    </div>
                    <div
                      className={styles.commonBackgroundColor}
                      style={{ paddingBottom: 0, marginBottom: 10 }}
                    >
                      <ProFormGroup key="workspace-group">
                        <ProFormText
                          width={370}
                          name="name"
                          label="名称"
                          placeholder="请输入工作空间名称"
                          rules={[{ required: true, message: '请输入名称' }]}
                        />
                        <ProFormText
                          width={370}
                          name="mountPath"
                          label="挂载路径"
                          placeholder="如 /workspace/source"
                          rules={[{ required: true, message: '请输入挂载路径' }]}
                        />
                        <ProFormSelect
                          width={370}
                          name="readOnly"
                          label="是否只读"
                          placeholder="请选择"
                          options={[
                            { label: '是', value: true },
                            { label: '否', value: false },
                          ]}
                          rules={[{ required: true, message: '请选择是否只读' }]}
                        />
                        <ProFormSelect
                          width={370}
                          name="optional"
                          label="是否省略工作区"
                          placeholder="请选择"
                          options={[
                            { label: '是', value: true },
                            { label: '否', value: false },
                          ]}
                          rules={[{ required: true, message: '请选择是否省略工作区' }]}
                        />
                        <ProFormTextArea
                          width={756}
                          name="description"
                          label="描述"
                          placeholder="请输入描述"
                        />
                      </ProFormGroup>
                    </div>
                  </div>
                )}
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
                {(_, idx) => (
                  <div>
                    <div style={{ marginBottom: 8, ...(idx > 0 ? { marginTop: 15 } : {}) }}>
                      存储卷 {idx + 1}
                    </div>
                    <div
                      className={styles.commonBackgroundColor}
                      style={{ paddingBottom: 0, marginBottom: 10 }}
                    >
                      <ProFormGroup key="volume-group">
                        <ProFormText
                          width={362}
                          name="name"
                          label="卷名"
                          placeholder="请输入卷名"
                          rules={[{ required: true, message: '请输入卷名' }]}
                        />
                        <ProFormSelect
                          width={362}
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
                    </div>
                  </div>
                )}
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
                {(_, idx) => (
                  <div>
                    <div style={{ marginBottom: 8, ...(idx > 0 ? { marginTop: 15 } : {}) }}>
                      环境变量 {idx + 1}
                    </div>
                    <div
                      className={styles.commonBackgroundColor}
                      style={{ paddingBottom: 0, marginBottom: 10 }}
                    >
                      <ProFormGroup key="step-template-env-group">
                        <ProFormText
                          width={362}
                          name="name"
                          label="变量名"
                          placeholder="请输入变量名"
                          rules={[{ required: true, message: '请输入变量名' }]}
                        />
                        <ProFormText
                          width={362}
                          name="value"
                          label="变量值"
                          placeholder="请输入变量值"
                          rules={[{ required: true, message: '请输入变量值' }]}
                        />
                      </ProFormGroup>
                    </div>
                  </div>
                )}
              </ProFormList>
              <ProFormSelect
                name={['spec', 'stepTemplate', 'securityContext', 'runAsNonRoot']}
                label="以非 root 用户运行"
                placeholder="请选择"
                options={[
                  { label: '是', value: true },
                  { label: '否', value: false },
                ]}
              />
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
                {(_, idx) => (
                  <div>
                    <div style={{ marginBottom: 8, ...(idx > 0 ? { marginTop: 15 } : {}) }}>
                      辅助容器 {idx + 1}
                    </div>
                    <div
                      className={styles.commonBackgroundColor}
                      style={{ paddingBottom: 0, marginBottom: 10 }}
                    >
                      <ProFormGroup key="sidecar-group">
                        <ProFormText
                          width={370}
                          name="name"
                          label="名称"
                          placeholder="请输入辅助容器名称"
                          rules={[{ required: true, message: '请输入名称' }]}
                        />
                        <ProFormText
                          width={370}
                          name="image"
                          label="镜像"
                          placeholder="请输入镜像"
                          rules={[{ required: true, message: '请输入镜像' }]}
                        />
                        <ProForm.Item label="脚本" name="script">
                          <MonacoEditor width={756} value={initialScript} />
                        </ProForm.Item>
                        <ProFormList
                          name="volumeMounts"
                          label="卷挂载"
                          creatorButtonProps={{
                            position: 'bottom',
                            creatorButtonText: '添加卷挂载',
                            style: { width: 756 },
                          }}
                          itemRender={({ listDom, action }) => (
                            <Flex align="center" gap={8}>
                              {listDom}
                              {action}
                            </Flex>
                          )}
                        >
                          <ProFormGroup key="sidecar-volume-group">
                            <ProFormText
                              width={340}
                              name="name"
                              placeholder="请输入卷名"
                              rules={[{ required: true, message: '请输入卷名' }]}
                            />
                            <ProFormText
                              width={340}
                              name="mountPath"
                              placeholder="请输入挂载路径"
                              rules={[{ required: true, message: '请输入挂载路径' }]}
                            />
                          </ProFormGroup>
                        </ProFormList>
                        <ProFormGroup key="sidecar-security-group">
                          <ProFormSelect
                            width={756}
                            name={['securityContext', 'privileged']}
                            label="特权模式"
                            placeholder="请选择"
                            options={[
                              { label: '是', value: true },
                              { label: '否', value: false },
                            ]}
                          />
                        </ProFormGroup>
                      </ProFormGroup>
                    </div>
                  </div>
                )}
              </ProFormList>
            </ProForm>
          </div>
        </div>
      </PageContainer>
    </>
  );
};

export default TaskForm;
