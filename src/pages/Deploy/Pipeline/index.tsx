import React, { FC, useEffect, useRef } from 'react';
import { ActionType, DrawerForm, PageContainer, ProTable } from '@ant-design/pro-components';
import styles from '@/pages/Resource/Cloud/Account/index.less';
import {
  createResource,
  deleteResource,
  resourceList,
  resourceListByNamespace,
  updateResource,
} from '@/services/deploy/tekton';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal, Select } from 'antd';
import { getNamespaces } from '@/services/deploy/namespace';
import MonacoEditor from '@/components/MonacoEditor';
import { jsonToYaml, yamlToJson } from '@/utils/tools/tools';

const pipelinesName = 'pipelines';
const initPipeline = `apiVersion: tekton.dev/v1
kind: Pipeline
metadata:
  name: demo-pipeline
  namespace: default
spec:
  tasks:
    - name: demo-task
      params:
        - name: url
          value: https://github.com/lanyulei/lanyulei.git
      taskRef:
        kind: Task
        name: git-clone
`;

const PipelineList: FC = () => {
  const [form] = Form.useForm();
  // const navigate = useNavigate();
  const [modal, modalContextHolder] = Modal.useModal();
  const [messageApi, messageContextHolder] = message.useMessage();
  const actionRef = useRef<ActionType>();
  const [query, setQuery] = React.useState<any>({
    name: undefined,
    namespace: undefined,
  });
  const [namespaceList, setNamespaceList] = React.useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = React.useState<boolean>(false);
  const [drawerStatus, setDrawerStatus] = React.useState<'create' | 'edit'>('create');
  const [pipelineDetails, setPipelineDetails] = React.useState<any>({});

  const handleReload = async () => {
    await actionRef?.current?.reload();
  };

  const getList = async () => {
    let res = {};
    if (query.namespace && query.namespace !== '') {
      res = await resourceListByNamespace(pipelinesName, query.namespace, query, {});
    } else {
      res = await resourceList(pipelinesName, query, {});
    }

    // @ts-ignore
    return (res.data?.items || []).reverse();
  };

  useEffect(() => {
    (async () => {
      const nsRes = await getNamespaces({}, {});
      setNamespaceList(nsRes.data?.items || []);
    })();
  }, []);

  return (
    <>
      {modalContextHolder}
      {messageContextHolder}
      <PageContainer content="流水线（Pipeline）是由多个任务（Task）组成的自动化工作流，用于定义和执行 CI/CD 中的各个步骤及其依赖关系。">
        <ProTable
          className={styles.tableList}
          columns={[
            {
              title: '名称',
              dataIndex: ['metadata', 'name'],
              key: 'metadata.name',
              ellipsis: true,
            },
            {
              title: '命名空间',
              dataIndex: ['metadata', 'namespace'],
              key: 'metadata.namespace',
            },
            {
              title: '创建时间',
              dataIndex: ['metadata', 'creationTimestamp'],
              key: 'metadata.creationTimestamp',
              valueType: 'dateTime',
            },
            {
              title: '操作',
              dataIndex: 'option',
              valueType: 'option',
              key: 'option',
              align: 'center' as const,
              width: 150,
              render: (_: any, record: any) => [
                <a
                  style={{ marginLeft: 10 }}
                  key="edit"
                  onClick={() => {
                    // navigate(
                    //   `/deploy/pipeline/edit/${record.metadata?.namespace}/${record.metadata?.name}`,
                    // );
                    setDrawerStatus('edit');
                    setPipelineDetails(record);
                    setDrawerOpen(true);
                  }}
                >
                  <EditOutlined /> 编辑
                </a>,
                <a
                  style={{ marginLeft: 10 }}
                  key="delete"
                  onClick={() => {
                    modal.confirm({
                      title: '提示',
                      content: '确定是否删除此任务？',
                      okText: '确认',
                      cancelText: '取消',
                      onOk: async () => {
                        await deleteResource(
                          pipelinesName,
                          record.metadata?.name,
                          record.metadata?.namespace,
                          {},
                        );
                        await handleReload();
                        messageApi.success('任务删除成功');
                        return true;
                      },
                    });
                  }}
                >
                  <DeleteOutlined /> 删除
                </a>,
              ],
            },
          ]}
          actionRef={actionRef}
          request={async () => {
            const _res = await getList();
            return {
              data: _res || [],
              success: true,
              total: _res?.length || 0,
            };
          }}
          rowKey={(record) => record.metadata?.name}
          pagination={false}
          bordered
          toolBarRender={() => [
            <Button
              onClick={() => {
                // navigate('/deploy/pipeline/create');
                setDrawerStatus('create');
                setPipelineDetails(initPipeline);
                setDrawerOpen(true);
              }}
              key="addTask"
              type="primary"
              icon={<PlusOutlined />}
            >
              新建流水线
            </Button>,
            <Input
              key="search"
              placeholder="请输入名称"
              allowClear
              style={{ width: 260 }}
              onChange={(e) => {
                if (e.target.value === '') {
                  setQuery({ ...query, fieldSelector: undefined });
                } else {
                  setQuery({ ...query, fieldSelector: 'metadata.name=' + e.target.value });
                }
              }}
              onPressEnter={handleReload}
              suffix={<SearchOutlined />}
            />,
            <Select
              key="namespace"
              style={{ width: 200 }}
              allowClear
              value={query.namespace}
              options={namespaceList.map((ns) => ({
                // @ts-ignore
                label: ns.metadata.name,
                // @ts-ignore
                value: ns.metadata.name,
              }))}
              placeholder="请选择命名空间"
              onChange={(value) => {
                setQuery({ ...query, namespace: value });
                setTimeout(async () => {
                  await handleReload();
                });
              }}
            />,
          ]}
          search={false}
        />
      </PageContainer>
      <DrawerForm
        title={drawerStatus === 'create' ? '新建流水线' : '编辑流水线'}
        form={form}
        autoFocusFirstInput
        drawerProps={{
          destroyOnHidden: true,
        }}
        onFinish={async () => {
          const pipelineData = yamlToJson(pipelineDetails);
          if (drawerStatus === 'create') {
            await createResource(pipelinesName, pipelineData.metadata?.namespace, pipelineData, {});
            messageApi.success('任务创建成功');
          } else if (drawerStatus === 'edit') {
            await updateResource(
              pipelinesName,
              pipelineData.metadata?.name,
              pipelineData.metadata?.namespace,
              pipelineData,
              {},
            );
            messageApi.success('任务更新成功');
          }
          await handleReload();
          return true;
        }}
        width={800}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        submitter={{
          searchConfig: { submitText: '保存', resetText: '取消' },
        }}
      >
        <MonacoEditor
          height={Math.max(200, ((jsonToYaml(pipelineDetails) || '').split('\n').length + 1) * 20)}
          codeType="yaml"
          value={jsonToYaml(pipelineDetails) || ''}
          onChange={(value) => {
            setPipelineDetails(value);
          }}
        />
      </DrawerForm>
    </>
  );
};

export default PipelineList;
