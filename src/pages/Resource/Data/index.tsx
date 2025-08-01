import { PlusOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { FooterToolbar, PageContainer, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, useParams } from '@umijs/max';
import { Button, Modal } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import { getModelFieldList } from '@/services/resource/field';
import FieldPreview from '../Model/components/FieldPreview';
import { batchDeleteData, getDataList } from '@/services/resource/data';
import { useNavigate } from 'react-router-dom';

const TableList: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedRowsState, setSelectedRows] = useState<string[]>([]);

  const [fieldList, setFieldList] = useState<any[]>([]);
  const [fieldGroupList, setFieldGroupList] = useState<any[]>([]);
  const [list, setList] = useState<any[]>([]);
  // const [total, setTotal] = useState<number>(0);
  const [modal, modalContextHolder] = Modal.useModal();

  interface FieldPreview {
    showDrawer: (resource: object | undefined, status: string | undefined) => void;
  }

  const fieldPreviewRef = useRef<FieldPreview>(null);

  const columns: ProColumns[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    ...fieldList,
    {
      title: '创建时间',
      dataIndex: 'create_time',
      valueType: 'dateTime',
      key: 'create_time',
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
      valueType: 'dateTime',
      key: 'update_time',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      key: 'option',
      render: (_, record) => [
        <a
          key="details"
          onClick={() => {
            navigate(`/resource/data/details/${record.model_id}/${record.id}`, {});
          }}
        >
          详情
        </a>,
        <a
          style={{ marginLeft: '12px' }}
          key="edit"
          onClick={() => {
            fieldPreviewRef.current?.showDrawer(record, 'edit');
          }}
        >
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
            dataIndex: ['data', field.key],
          });
        }
      }
    }
    setFieldList(fl);
    // 获取数据列表
    const dataRes = await getDataList(id, {}, {});
    setList(dataRes.data?.list || []);
    // setTotal(dataRes.data?.total || 0); // todo 列表总数统计待完善
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
          rowKey="id"
          search={false}
          dataSource={list}
          toolBarRender={() => [
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                fieldPreviewRef.current?.showDrawer({ model_id: id }, 'create');
              }}
            >
              <PlusOutlined />
              <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
            </Button>,
          ]}
          columns={columns}
          rowSelection={{
            onChange: (value) => {
              setSelectedRows(value as string[]);
            },
          }}
          options={{
            reload: false,
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
      <FieldPreview ref={fieldPreviewRef} fieldList={fieldGroupList} getList={getList} />
    </>
  );
};

export default TableList;
