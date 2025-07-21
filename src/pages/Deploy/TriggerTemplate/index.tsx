import React, { FC, useEffect, useRef } from 'react';
import { ActionType, DrawerForm, PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Input, message, Modal, Select } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import styles from '@/pages/Resource/Cloud/Account/index.less';
import { getNamespaces } from '@/services/deploy/namespace';
import {
  createResource,
  deleteResource,
  resourceList,
  resourceListByNamespace,
  updateResource,
} from '@/services/deploy/tekton';
import MonacoEditor from '@/components/MonacoEditor';
import { jsonToYaml, yamlToJson } from '@/utils/tools/tools';

const apiVersion = 'triggers.tekton.dev/v1beta1';
const triggerTemplatesName = 'triggertemplates';
const initTriggerTemplateData = `apiVersion: ${apiVersion}
kind: TriggerTemplate
metadata:
  name: example-trigger-template
  namespace: default
spec:
  params:
    - name: message
      description: 要打印的消息
  resourcetemplates:
  - apiVersion: tekton.dev/v1
    kind: PipelineRun
    metadata:
      generateName: echo-pipeline-
    spec:
      pipelineRef:
        name: echo-pipeline
      params:
        - name: message
          value: $(tt.params.message)
`;

const TriggerTemplate: FC = () => {
  // const navigate = useNavigate();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();
  const [query, setQuery] = React.useState<any>({
    name: undefined,
    namespace: undefined,
  });
  const actionRef = useRef<ActionType>();
  const [namespaceList, setNamespaceList] = React.useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = React.useState<boolean>(false);
  const [drawerStatus, setDrawerStatus] = React.useState<'create' | 'edit'>('create');
  const [triggerTemplateData, setTriggerTemplateData] = React.useState<any>();

  const handleReload = async () => {
    await actionRef?.current?.reload();
  };

  const getList = async () => {
    let res = {};
    if (query.namespace && query.namespace !== '') {
      res = await resourceListByNamespace(
        triggerTemplatesName,
        query.namespace,
        query,
        {},
        apiVersion,
      );
    } else {
      res = await resourceList(triggerTemplatesName, query, {}, apiVersion);
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
      <PageContainer content="触发器模板（TriggerTemplate）是用于定义如何根据传入的事件数据动态生成 PipelineRun 或 TaskRun，从而自动化执行 CI/CD 流水线。">
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
                    //   `/deploy/task/edit/${record.metadata?.namespace}/${record.metadata?.name}`,
                    // );
                    setDrawerStatus('edit');
                    delete record.metadata?.managedFields;
                    setTriggerTemplateData(record);
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
                      content: '确定是否删除此触发器模板？',
                      okText: '确认',
                      cancelText: '取消',
                      onOk: async () => {
                        await deleteResource(
                          triggerTemplatesName,
                          record.metadata?.name,
                          record.metadata?.namespace,
                          {},
                          apiVersion,
                        );
                        await handleReload();
                        messageApi.success('触发器模板删除成功');
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
                // navigate('/deploy/task/create');
                setDrawerStatus('create');
                setTriggerTemplateData(initTriggerTemplateData);
                setDrawerOpen(true);
              }}
              key="addTriggerTemplate"
              type="primary"
              icon={<PlusOutlined />}
            >
              新建触发器模板
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
        title={drawerStatus === 'create' ? '新建触发器模板' : '编辑触发器模板'}
        autoFocusFirstInput
        drawerProps={{
          destroyOnHidden: true,
        }}
        onFinish={async () => {
          const triggerTemplateDetails = yamlToJson(triggerTemplateData);
          if (drawerStatus === 'create') {
            await createResource(
              triggerTemplatesName,
              triggerTemplateDetails.metadata?.namespace,
              triggerTemplateDetails,
              {},
              apiVersion,
            );
            messageApi.success('触发器模板创建成功');
          } else if (drawerStatus === 'edit') {
            await updateResource(
              triggerTemplatesName,
              triggerTemplateDetails.metadata?.name,
              triggerTemplateDetails.metadata?.namespace,
              triggerTemplateDetails,
              {},
              apiVersion,
            );
            messageApi.success('触发器模板更新成功');
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
          codeType="yaml"
          value={jsonToYaml(triggerTemplateData) || ''}
          onChange={(value: string) => {
            setTriggerTemplateData(value);
          }}
        />
      </DrawerForm>
    </>
  );
};

export default TriggerTemplate;
