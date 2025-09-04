import React, { FC, useEffect, useRef } from 'react';
import { ActionType, DrawerForm, PageContainer, ProTable } from '@ant-design/pro-components';
import styles from '@/pages/Resource/Cloud/Account/index.less';
import { EyeOutlined } from '@ant-design/icons';
import { Col, Form, Row, Select } from 'antd';
import { taskHistoryDetails, taskHistoryList } from '@/services/task/history';
import { templateList } from '@/services/task/template';
import dayjs from 'dayjs';

interface HistoryDetails {
  command: string;
  create_time: string;
  executor: string;
  id: string;
  result: string;
  status: string;
  template: string;
  update_time: string;
}

const History: FC = () => {
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();
  const [query, setQuery] = React.useState<any>({
    task_template_id: undefined,
  });
  const [selectOptions, setSelectOptions] = React.useState<any[]>([]);
  const [historyDetails, setHistoryDetails] = React.useState<HistoryDetails>();
  const [visible, setVisible] = React.useState<boolean>(false);

  const handleReload = async () => {
    await actionRef?.current?.reload();
  };

  const onChange = async (value: string) => {
    setQuery({
      task_template_id: value,
    });
    await handleReload();
  };

  const getSelectOptions = async () => {
    const res = await templateList({
      not_page: true,
    });
    setSelectOptions(res.data?.list || []);
  };

  const getList = async () => {
    const res = await taskHistoryList(query);
    return res.data || {};
  };

  useEffect(() => {
    (async () => {
      await getSelectOptions();
    })();
  }, []);

  return (
    <>
      <PageContainer content="执行历史是记录过去每次执行任务或 Playbook 的结果、状态和输出的日志或追踪信息。">
        <ProTable
          className={styles.tableList}
          columns={[
            {
              title: 'ID',
              dataIndex: 'id',
              key: 'id',
              ellipsis: true,
            },
            {
              title: '任务名称',
              dataIndex: 'task_name',
              key: 'task_name',
              ellipsis: true,
            },
            {
              title: '状态',
              dataIndex: 'status',
              key: 'status',
              ellipsis: true,
            },
            {
              title: '执行者',
              dataIndex: 'executor',
              key: 'executor',
              ellipsis: true,
            },
            {
              title: '创建时间',
              dataIndex: 'create_time',
              key: 'create_time',
              valueType: 'dateTime',
            },
            {
              title: '操作',
              dataIndex: 'option',
              valueType: 'option',
              key: 'option',
              align: 'center' as const,
              width: 100,
              render: (_: any, record: any) => [
                <a
                  style={{ marginLeft: 10 }}
                  key="view"
                  onClick={async () => {
                    const res = await taskHistoryDetails(record?.id, {});
                    setHistoryDetails(res.data || {});
                    setVisible(true);
                  }}
                >
                  <EyeOutlined /> 查看
                </a>,
              ],
            },
          ]}
          actionRef={actionRef}
          request={async () => {
            const _res = await getList();
            return {
              data: _res?.list || [],
              success: true,
              total: _res?.total || 0,
            };
          }}
          rowKey={(record) => record.id || record.name}
          pagination={false}
          bordered
          toolBarRender={() => [
            <Select
              key="search"
              showSearch
              allowClear
              style={{ width: 260 }}
              placeholder="请选择任务模板"
              optionFilterProp="label"
              onChange={onChange}
              options={selectOptions.map((item) => ({
                label: item.name,
                value: item.id,
              }))}
            />,
          ]}
          search={false}
        />
      </PageContainer>

      <DrawerForm
        title="执行详情"
        form={form}
        autoFocusFirstInput
        drawerProps={{
          destroyOnHidden: true,
        }}
        onFinish={async (values: any) => {
          console.log(values);
          return true;
        }}
        open={visible}
        onOpenChange={setVisible}
        submitter={false}
      >
        <Row gutter={16}>
          <Col span={12}>
            <div style={{ marginBottom: '15px' }}>
              <span>ID：</span>
              <span style={{ color: '#606266' }}>{historyDetails?.id}</span>
            </div>
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: '15px' }}>
              <span>执行人：</span>
              <span style={{ color: '#606266' }}>{historyDetails?.executor}</span>
            </div>
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: '15px' }}>
              <span>创建时间：</span>
              <span style={{ color: '#606266' }}>
                {historyDetails?.create_time
                  ? dayjs(historyDetails.update_time).format('YYYY-MM-DD HH:mm:ss')
                  : ''}
              </span>
            </div>
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: '15px' }}>
              <span>更新时间：</span>
              <span style={{ color: '#606266' }}>
                {historyDetails?.update_time
                  ? dayjs(historyDetails.update_time).format('YYYY-MM-DD HH:mm:ss')
                  : ''}
              </span>
            </div>
          </Col>
        </Row>
        <Form.Item label="详情：" name="result">
          <div
            style={{
              border: '1px solid #f0f0f0',
              padding: '10px',
              borderRadius: '4px',
              background: '#f5f7fb',
            }}
          >
            <pre style={{ color: '#606266', whiteSpace: 'pre-wrap' }}>{historyDetails?.result}</pre>
          </div>
        </Form.Item>
      </DrawerForm>
    </>
  );
};

export default History;
