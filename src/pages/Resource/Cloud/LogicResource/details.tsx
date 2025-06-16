import React, { FC, useEffect, useRef } from 'react';
import { ActionType, PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { getLogicHandleList } from '@/services/resource/logicHandle';
import { useParams } from '@@/exports';
import { getLogicResourceDetails } from '@/services/resource/logicResource';

const LogicHandle: FC = () => {
  const { id } = useParams();
  const actionRef = useRef<ActionType>();
  const [details, setDetails] = React.useState<any>({});

  useEffect(() => {
    (async () => {
      const _res = await getLogicResourceDetails(id, {});
      setDetails(_res.data || {});
    })();
  }, []);

  return (
    <>
      <PageContainer
        title="资源详情"
        content="云管平台通过将逻辑操作映射到不同云厂商的 API 接口，实现了跨云服务的统一入口和执行标准化，屏蔽底层 API 差异，简化多云环境下的运维操作流程。"
      >
        <ProDescriptions column={2} style={{ marginBottom: 20 }}>
          <ProDescriptions.Item label="标题">{details.title}</ProDescriptions.Item>
          <ProDescriptions.Item label="名称">{details.name}</ProDescriptions.Item>
          <ProDescriptions.Item label="创建时间" valueType="dateTime">
            {details.create_time}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="更新时间" valueType="dateTime">
            {details.update_time}
          </ProDescriptions.Item>
        </ProDescriptions>
        <ProTable
          headerTitle="逻辑操作"
          columns={[
            {
              title: 'ID',
              dataIndex: 'id',
              key: 'id',
              ellipsis: true,
            },
            {
              title: '标题',
              dataIndex: 'title',
              key: 'title',
            },
            {
              title: '名称',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '描述',
              dataIndex: 'remarks',
              key: 'remarks',
              ellipsis: true,
            },
            {
              title: '创建时间',
              dataIndex: 'create_time',
              key: 'create_time',
              valueType: 'dateTime',
            },
            {
              title: '更新时间',
              dataIndex: 'update_time',
              key: 'update_time',
              valueType: 'dateTime',
            },
          ]}
          actionRef={actionRef}
          request={async () => {
            const _res = await getLogicHandleList(
              id,
              {
                not_page: true,
              },
              {},
            );
            return {
              data: _res.data?.list || [],
              success: true,
              total: _res.data?.total || 0,
            };
          }}
          rowKey="id"
          pagination={false}
          bordered
          search={false}
          options={{
            reload: false,
          }}
        />
      </PageContainer>
    </>
  );
};

export default LogicHandle;
