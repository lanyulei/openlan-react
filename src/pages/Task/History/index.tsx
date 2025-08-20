import React, { FC, useEffect, useRef } from 'react';
import { ActionType, PageContainer, ProTable } from '@ant-design/pro-components';
import styles from '@/pages/Resource/Cloud/Account/index.less';
import { EyeOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import { taskHistoryList } from '@/services/task/history';
import { templateList } from '@/services/task/template';

const History: FC = () => {
  const actionRef = useRef<ActionType>();
  const [query, setQuery] = React.useState<any>({
    task_template_id: undefined,
  });
  const [selectOptions, setSelectOptions] = React.useState<any[]>([]);

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
              render: () => [
                <a style={{ marginLeft: 10 }} key="view" onClick={() => {}}>
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
    </>
  );
};

export default History;
