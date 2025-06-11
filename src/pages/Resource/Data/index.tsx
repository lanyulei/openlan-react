import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { FooterToolbar, PageContainer, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, useParams } from '@umijs/max';
import { Button } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import { getModelFieldList } from '@/services/resource/field';

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

  // 原代码中 fieldList.map 返回的是一个数组，不能直接放在 columns 数组里，需要使用扩展运算符展开
  const columns: ProColumns[] = [
    ...fieldList,
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: () => [
        <a key="config" onClick={() => {}}>
          <FormattedMessage id="pages.searchTable.config" defaultMessage="Configuration" />
        </a>,
        <a key="subscribeAlert" href="https://procomponents.ant.design/">
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
          <Button type="primary" key="primary" onClick={() => {}}>
            <PlusOutlined />
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
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
              &nbsp;&nbsp;
              <span>
                <FormattedMessage
                  id="pages.searchTable.totalServiceCalls"
                  defaultMessage="Total number of service calls"
                />{' '}
                {selectedRowsState.reduce(
                  (pre: number, item: { callNo?: number }) => pre + (item.callNo || 0),
                  0,
                )}{' '}
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
            <FormattedMessage
              id="pages.searchTable.batchDeletion"
              defaultMessage="Batch deletion"
            />
          </Button>
          <Button type="primary">
            <FormattedMessage
              id="pages.searchTable.batchApproval"
              defaultMessage="Batch approval"
            />
          </Button>
        </FooterToolbar>
      )}
    </PageContainer>
  );
};

export default TableList;
