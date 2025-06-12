import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { FooterToolbar, PageContainer, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, useParams } from '@umijs/max';
import { Button } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import { getModelFieldList } from '@/services/resource/field';
import FieldPreview from '../Model/components/FieldPreview';

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async () => {};

const TableList: React.FC = () => {
  const { id } = useParams();
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState([]);

  const [fieldList, setFieldList] = useState<any[]>([]);
  const [fieldGroupList, setFieldGroupList] = useState<any[]>([]);

  interface FieldPreview {
    showDrawer: () => void;
  }

  const fieldPreviewRef = useRef<FieldPreview>(null);

  const columns: ProColumns[] = [
    ...fieldList,
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: () => [
        <a key="config" onClick={() => {}}>
          {/* 配置 */}
          <FormattedMessage id="pages.searchTable.config" defaultMessage="Configuration" />
        </a>,
        <a key="subscribeAlert" href="https://procomponents.ant.design/">
          {/* 订阅警报 */}
          <FormattedMessage
            id="pages.searchTable.subscribeAlert"
            defaultMessage="Subscribe to alerts"
          />
        </a>,
      ],
    },
  ];

  useEffect(() => {
    (async () => {
      const _res = await getModelFieldList(id, {});
      const { data } = _res;
      setFieldGroupList(data);
      let fl = [];
      for (const item of data) {
        for (const field of item.fields) {
          if (field.is_list) {
            fl.push({
              title: field.name,
              dataIndex: field.key,
            });
          }
        }
      }
      setFieldList(fl);
    })();
  }, []);

  return (
    <>
      <PageContainer>
        <ProTable
          className={styles.tableList}
          bordered
          actionRef={actionRef}
          rowKey="key"
          search={{
            labelWidth: 120,
          }}
          toolBarRender={() => [
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                fieldPreviewRef.current?.showDrawer();
              }}
            >
              <PlusOutlined />
              {/* 新建 */}
              <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
            </Button>,
          ]}
          columns={columns}
          rowSelection={{
            onChange: () => {
              console.log(123);
            },
          }}
        />
        {selectedRowsState?.length > 0 && (
          <FooterToolbar
            extra={
              <div>
                {/* 已选择 */}
                <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
                <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> {/* 项 */}
                <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
                &nbsp;&nbsp;
                <span>
                  {/* 服务调用次数总计 */}
                  <FormattedMessage
                    id="pages.searchTable.totalServiceCalls"
                    defaultMessage="Total number of service calls"
                  />{' '}
                  {selectedRowsState.reduce(
                    (pre: number, item: { callNo?: number }) => pre + (item.callNo || 0),
                    0,
                  )}{' '}
                  {/* 万 */}
                  <FormattedMessage id="pages.searchTable.tenThousand" defaultMessage="万" />
                </span>
              </div>
            }
          >
            <Button
              onClick={async () => {
                await handleRemove();
                setSelectedRows([]);
                actionRef.current?.reloadAndRest?.();
              }}
            >
              {/* 批量删除 */}
              <FormattedMessage
                id="pages.searchTable.batchDeletion"
                defaultMessage="Batch deletion"
              />
            </Button>
            <Button type="primary">
              {/* 批量审批 */}
              <FormattedMessage
                id="pages.searchTable.batchApproval"
                defaultMessage="Batch approval"
              />
            </Button>
          </FooterToolbar>
        )}
      </PageContainer>
      <FieldPreview ref={fieldPreviewRef} fieldList={fieldGroupList} />
    </>
  );
};

export default TableList;
