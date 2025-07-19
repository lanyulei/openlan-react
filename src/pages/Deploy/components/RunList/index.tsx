import React, { FC, useEffect, useRef } from 'react';
import { ActionType, PageContainer, ProTable } from '@ant-design/pro-components';
import { resourceList, resourceListByNamespace } from '@/services/deploy/tekton';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Input, Select, Tooltip } from 'antd';
import { getNamespaces } from '@/services/deploy/namespace';
import { formatDate } from '@/utils/tools/tools';
import commonStyles from '@/pages/Resource/Cloud/Account/index.less';
import { useNavigate } from 'react-router-dom';

interface RunsDetailsProps {
  resourceRunsName: string;
  resourceName: string;
  describe: string;
  tableTitle: string;
}

const RunsDetails: FC<RunsDetailsProps> = ({
  resourceRunsName,
  resourceName,
  describe,
  tableTitle,
}) => {
  const resourceValue = resourceName.slice(0, -1);
  const navigate = useNavigate();
  const actionRef = useRef<ActionType>();
  const [query, setQuery] = React.useState<any>({
    name: undefined,
    namespace: undefined,
  });
  const [namespaceList, setNamespaceList] = React.useState<string[]>([]);
  const [resourceDataList, setResourceDataList] = React.useState<any[]>([]);

  const handleReload = async () => {
    await actionRef?.current?.reload();
  };

  const getList = async () => {
    let res = {};
    if (query.namespace && query.namespace !== '') {
      res = await resourceListByNamespace(resourceRunsName, query.namespace, query, {});
    } else {
      res = await resourceList(resourceRunsName, query, {});
    }

    // @ts-ignore
    return (res.data?.items || []).reverse();
  };

  const getResourceList = async () => {
    const resourceRes = await resourceList(resourceName, {}, {});
    setResourceDataList(resourceRes.data?.items);
  };

  useEffect(() => {
    (async () => {
      const nsRes = await getNamespaces({}, {});
      setNamespaceList(nsRes.data?.items || []);

      await getResourceList();
    })();
  }, []);

  // @ts-ignore
  return (
    <>
      <PageContainer content={describe}>
        <ProTable
          className={commonStyles.tableList}
          columns={[
            {
              title: '名称',
              key: 'metadata.name',
              ellipsis: true,
              render: (_, record) => (
                <div>
                  <div
                    className="commonEllipsis"
                    style={{ cursor: 'pointer', color: '#1677ff' }}
                    onClick={() => {
                      navigate(
                        `/deploy/${resourceRunsName}/details/${record.metadata?.namespace}/${record.metadata?.name}`,
                      );
                    }}
                  >
                    <Tooltip placement="top" title={record.metadata?.name}>
                      {record.metadata?.name ? record.metadata.name : '-'}
                    </Tooltip>
                  </div>
                  <div className="commonEllipsis" style={{ color: '#888', fontSize: 12 }}>
                    <Tooltip
                      placement="top"
                      title={record.status?.[resourceValue + 'Spec']?.description}
                    >
                      {record.status?.[resourceValue + 'Spec']?.description || '-'}
                    </Tooltip>
                  </div>
                </div>
              ),
            },
            {
              title: '命名空间',
              dataIndex: ['metadata', 'namespace'],
              key: 'metadata.namespace',
              ellipsis: true,
            },
            {
              title: '状态',
              key: `spec.${resourceValue}Ref.name`,
              render: (_, record) => {
                let condition = record.status?.conditions?.[0] || {};
                let iconResult = undefined as any;
                if (condition?.reason === 'Pending') {
                  iconResult = (
                    <ClockCircleOutlined
                      style={{ color: 'orange', fontSize: 14, marginRight: 5 }}
                    />
                  );
                } else if (condition?.reason === 'Started') {
                  iconResult = (
                    <ClockCircleOutlined
                      style={{ color: 'orange', fontSize: 14, marginRight: 5 }}
                    />
                  );
                } else if (condition?.reason === 'Running') {
                  iconResult = (
                    <ClockCircleOutlined
                      style={{ color: 'orange', fontSize: 14, marginRight: 5 }}
                    />
                  );
                } else if (condition?.reason === 'Succeeded') {
                  iconResult = (
                    <CheckCircleOutlined style={{ color: 'green', fontSize: 14, marginRight: 5 }} />
                  );
                } else {
                  iconResult = (
                    <CloseCircleOutlined style={{ color: 'red', fontSize: 14, marginRight: 5 }} />
                  );
                }

                return (
                  <div>
                    <div className="commonEllipsis">
                      {iconResult}
                      {condition?.reason}
                    </div>
                    <div className="commonEllipsis" style={{ color: '#888', fontSize: 12 }}>
                      {condition?.message || '-'}
                    </div>
                  </div>
                );
              },
            },
            {
              title: tableTitle,
              key: `spec.${resourceValue}Ref.name`,
              render: (_, record) => (
                <div>
                  <div className="commonEllipsis">
                    {record.spec?.[resourceValue + 'Ref']?.name || '-'}
                  </div>
                  <div className="commonEllipsis" style={{ color: '#888', fontSize: 12 }}>
                    {record.status?.[resourceValue + 'Spec']?.displayName || '-'}
                  </div>
                </div>
              ),
            },
            // {
            //   title: '步骤数量',
            //   key: 'status.stepCount',
            //   render: (text, record) => (
            //     <div>{record.status?.steps?.length || record.status?.stepCount || '-'}</div>
            //   ),
            // },
            {
              title: '创建时间',
              dataIndex: ['metadata', 'creationTimestamp'],
              key: 'metadata.creationTimestamp',
              render: (_, record) => (
                <div>
                  <div>{formatDate(record.metadata?.creationTimestamp) || '-'}</div>
                  <div style={{ color: '#888', fontSize: 12 }}>
                    {record.status?.startTime && record.status?.completionTime
                      ? (() => {
                          const duration =
                            (new Date(record.status.completionTime).getTime() -
                              new Date(record.status.startTime).getTime()) /
                            1000;
                          const h = Math.floor(duration / 3600);
                          const m = Math.floor((duration % 3600) / 60);
                          const s = Math.floor(duration % 60);
                          return [h > 0 ? `${h}h` : '', m > 0 ? `${m}m` : '', `${s}s`]
                            .filter(Boolean)
                            .join(' ');
                        })()
                      : '-'}
                  </div>
                </div>
              ),
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
              onChange={async (value) => {
                setQuery({ ...query, namespace: value });
                await handleReload();
              }}
            />,
            <Select
              key="resource"
              style={{ width: 200 }}
              allowClear
              options={resourceDataList.map((resource) => ({
                // @ts-ignore
                label: resource.metadata.name,
                // @ts-ignore
                value: resource.metadata.name,
              }))}
              placeholder="请选择任务"
              onChange={async (value) => {
                const _data = { ...query };
                if (value && value !== '') {
                  _data.labelSelector = 'tekton.dev/resource=' + value;
                } else {
                  delete _data.labelSelector;
                }
                setQuery(_data);
                await handleReload();
              }}
            />,
          ]}
          search={false}
        />
      </PageContainer>
    </>
  );
};

export default RunsDetails;
