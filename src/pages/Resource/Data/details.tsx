import { FC, Fragment, useEffect, useState } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { ProDescriptions } from '@ant-design/pro-components';
import { useParams } from '@@/exports';
import { getModelFieldList } from '@/services/resource/field';
import { getDataDetails } from '@/services/resource/data';
import { getUserList } from '@/services/system/user';

const Details: FC = () => {
  const { id, modelId } = useParams();
  const [fieldGroupList, setFieldGroupList] = useState<any[]>([]);
  const [dataDetails, setDataDetails] = useState<any>({});
  const [userList, setUserList] = useState<any[]>([]);

  const getDetails = async () => {
    const _res = await getModelFieldList(modelId, {});
    setFieldGroupList(_res.data);

    const _dataRes = await getDataDetails(id, {});
    setDataDetails(_dataRes.data);
  };

  const groupFieldsBySpan = (fields: any[], column: number) => {
    const groupedFields: any[][] = [];
    let currentRow: any[] = [];
    let currentSpan = 0;

    fields.forEach((field) => {
      const span = field.span || 1;
      if (currentSpan + span > column) {
        groupedFields.push(currentRow);
        currentRow = [field];
        currentSpan = span;
      } else {
        currentRow.push(field);
        currentSpan += span;
      }
    });

    if (currentRow.length > 0) {
      groupedFields.push(currentRow);
    }

    return groupedFields;
  };

  const getUsers = async () => {
    const res = await getUserList({
      not_page: true,
    });
    const { data } = res;
    setUserList(data?.list);
  };

  useEffect(() => {
    (async () => {
      await getUsers();
      await getDetails();
    })();
  }, []);

  return (
    <>
      <PageContainer>
        <ProDescriptions column={2}>
          <ProDescriptions.Item label="数据 ID">{dataDetails.id}</ProDescriptions.Item>
          <ProDescriptions.Item label="资源模型">{dataDetails.model_name}</ProDescriptions.Item>
          <ProDescriptions.Item label="创建时间" valueType="dateTime">
            {dataDetails.create_time}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="更新时间" valueType="dateTime">
            {dataDetails.update_time}
          </ProDescriptions.Item>
        </ProDescriptions>
        {fieldGroupList.map((group) => (
          <Fragment key={group.id}>
            <h3
              style={{
                marginBottom: '12px',
                marginTop: '25px',
              }}
            >
              {group.name}
            </h3>
            {groupFieldsBySpan(group.fields, 2).map((row, rowIndex) => (
              <ProDescriptions key={rowIndex} column={2} style={{ marginBottom: '16px' }}>
                {row.map((field: any) => (
                  <Fragment key={field.id}>
                    {field.type === 'enum' || field.type === 'enumMulti' ? (
                      <ProDescriptions.Item
                        span={field.span || 1}
                        label={field.name}
                        request={async () =>
                          field.options?.options?.map((opt: any) => ({
                            label: opt.value,
                            value: opt.id,
                          })) || []
                        }
                      >
                        {!dataDetails.data?.[field.key] ? '' : dataDetails.data?.[field.key]}
                      </ProDescriptions.Item>
                    ) : field.type === 'user' ? (
                      <ProDescriptions.Item
                        span={field.span || 1}
                        label={field.name}
                        request={async () =>
                          userList.map((user) => ({
                            label: user.username,
                            value: user.id,
                          })) || []
                        }
                      >
                        {!dataDetails.data?.[field.key] ? '' : dataDetails.data?.[field.key]}
                      </ProDescriptions.Item>
                    ) : field.type === 'table' ? (
                      <ProDescriptions.Item span={field.span || 12} label={field.name}>
                        <ProTable
                          columns={(field.options?.columns || []).map((col: any) => ({
                            title: col.label,
                            dataIndex: col.value,
                            key: col.id,
                          }))}
                          dataSource={dataDetails.data?.[field.key] || []}
                          rowKey="id"
                          search={false}
                          pagination={false}
                          options={false}
                          style={{ width: '100%' }}
                        />
                      </ProDescriptions.Item>
                    ) : (
                      <ProDescriptions.Item span={field.span || 1} label={field.name}>
                        {!dataDetails.data?.[field.key]
                          ? ''
                          : String(dataDetails.data?.[field.key])}
                      </ProDescriptions.Item>
                    )}
                  </Fragment>
                ))}
              </ProDescriptions>
            ))}
          </Fragment>
        ))}
      </PageContainer>
    </>
  );
};

export default Details;
