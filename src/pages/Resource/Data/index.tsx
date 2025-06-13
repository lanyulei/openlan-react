import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { FooterToolbar, PageContainer, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, useParams } from '@umijs/max';
import { Button, Modal } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import { getModelFieldList } from '@/services/resource/field';
import FieldPreview from '../Model/components/FieldPreview';
import { batchDeleteData, getDataList } from '@/services/resource/data';

const TableList: React.FC = () => {
  const { id } = useParams();
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<string[]>([]);

  const [fieldList, setFieldList] = useState<any[]>([]);
  const [fieldGroupList, setFieldGroupList] = useState<any[]>([]);
  const [list, setList] = useState<any[]>([]);
  // const [total, setTotal] = useState<number>(0);
  const [modal, modalContextHolder] = Modal.useModal();

  interface FieldPreview {
    showDrawer: (modelId: string | undefined, status: string | undefined) => void;
  }

  const fieldPreviewRef = useRef<FieldPreview>(null);

  const columns: ProColumns[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    ...fieldList,
    {
      title: '创建时间',
      dataIndex: 'create_time',
      valueType: 'dateTime',
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: () => [
        <a key="details" onClick={() => {}}>
          详情
        </a>,
        <a style={{ marginLeft: '12px' }} key="edit" onClick={() => {}}>
          编辑
        </a>,
      ],
    },
  ];

  const getList = async () => {
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
    // 获取数据列表
    const dataRes = await getDataList(id, {}, {});
    setList(dataRes.data?.list || []);
    // setTotal(dataRes.data?.total || 0);
  };

  useEffect(() => {
    (async () => {
      await getList();
    })();
  }, []);

  return (
    <>
      {modalContextHolder}
      <PageContainer>
        <ProTable
          className={styles.tableList}
          bordered
          actionRef={actionRef}
          rowKey="id"
          search={false}
          dataSource={list}
          toolBarRender={() => [
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                fieldPreviewRef.current?.showDrawer(id, 'create');
              }}
            >
              <PlusOutlined />
              {/* 新建 */}
              <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
            </Button>,
          ]}
          columns={columns}
          rowSelection={{
            onChange: (value) => {
              setSelectedRows(value as string[]);
            },
          }}
        />
        {selectedRowsState?.length > 0 && (
          <FooterToolbar
            extra={
              <div>
                <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
                <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>
                <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
              </div>
            }
          >
            <Button
              onClick={async () => {
                modal.confirm({
                  title: '删除资源',
                  content: '请确认是否删除这些资源？',
                  okText: '确认',
                  cancelText: '取消',
                  onOk: async () => {
                    await batchDeleteData(selectedRowsState, {});
                    setSelectedRows([]);
                    await getList();
                  },
                });
              }}
            >
              <FormattedMessage
                id="pages.searchTable.batchDeletion"
                defaultMessage="Batch deletion"
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
