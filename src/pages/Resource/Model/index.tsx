import { useNavigate } from 'react-router-dom';
import { FC, useEffect, useRef, useState } from 'react';
import {
  ModalForm,
  PageContainer,
  ProFormDigit,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import {
  CaretDownOutlined,
  EditOutlined,
  MoreOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import styles from './index.less';
import { Button, Dropdown, Input, message, Modal } from 'antd';
import type { MenuProps } from 'antd';
import CreateModel from './components/CreateModel';

import { getModels } from '@/services/resource/model';
import {
  createModelGroup,
  deleteModelGroup,
  updateModelGroup,
} from '@/services/resource/modelGroup';
import { IconPicker } from '@ant-design/pro-editor';

type Data = {
  list: any[];
  page: number;
  size: number;
};

const Models: FC = () => {
  const [modal, modalContextHolder] = Modal.useModal();
  const [messageApi, messageContextHolder] = message.useMessage();
  const navigate = useNavigate();

  interface CreateModelRef {
    showModal: (status: string, groupId: string, data: object | undefined) => void;
  }

  const createModelRef = useRef<CreateModelRef>(null);
  const [modalVisit, setModalVisit] = useState(false);
  const [modalStatus, setModalStatus] = useState('create');
  const [groupForm, setGroupForm] = useState({
    id: undefined,
    name: '',
    desc: '',
    order: 1,
  });
  const [modelName, setModelName] = useState('');

  const [data, setData] = useState<Data>({
    list: [],
    page: 1,
    size: 10,
  });

  const getList = async () => {
    const res = await getModels({
      name: modelName,
    });
    setData((prevData) => ({
      ...prevData,
      list: res.data || [],
    }));
  };

  const getItems = (item: any): MenuProps['items'] => [
    {
      label: <div>编辑分组</div>,
      key: '0',
      onClick: () => {
        setGroupForm({
          id: item.id,
          name: item.name,
          desc: item.desc,
          order: item.order,
        });
        setModalStatus('edit');
        setModalVisit(true);
      },
    },
    {
      label: <div>删除分组</div>,
      key: '1',
      onClick: () => {
        modal.confirm({
          title: '删除分组',
          content: '确定要删除此分组吗？',
          okText: '确认',
          cancelText: '取消',
          onOk: async () => {
            await deleteModelGroup(item.id);
            await getList();
            messageApi.success('分组删除成功');
          },
        });
      },
    },
  ];

  const handleModelAdd = (item: any) => {
    createModelRef.current?.showModal('create', item.id, undefined);
  };

  const handleDetails = (id: string) => {
    navigate('/resource/model-details/' + id);
  };

  useEffect(() => {
    (async () => {
      await getList();
    })();
  }, []);

  return (
    <>
      {modalContextHolder}
      {messageContextHolder}
      <PageContainer
        header={{
          extra: [
            <Button
              type="primary"
              key="1"
              icon={<PlusCircleOutlined />}
              onClick={() => {
                setGroupForm({
                  id: undefined,
                  name: '',
                  desc: '',
                  order: 1,
                });
                setModalStatus('create');
                setModalVisit(true);
              }}
            >
              新建分组
            </Button>,
            <Input
              key="2"
              placeholder="请输入模型名称"
              style={{ width: '300px' }}
              suffix={<SearchOutlined />}
              onChange={(e) => {
                setModelName(e.target.value);
              }}
              onPressEnter={() => {
                getList();
              }}
            />,
          ],
        }}
      >
        {data.list.map((item) => (
          <div key={item.id} style={{ marginBottom: '15px' }}>
            <div className={styles.modelGroup}>
              <CaretDownOutlined />
              <span className={styles.modelGroupName}>
                {item.name} ( {item.models?.length || 0} )
              </span>
              <Dropdown menu={{ items: getItems(item) }} trigger={['click']}>
                <MoreOutlined className={styles.modelGroupMoreIcon} />
              </Dropdown>
            </div>
            {!item.models || item.models?.length === 0 ? (
              <div className={styles.modelItem}>
                <div
                  className={styles.modelAdd}
                  style={{ display: 'block' }}
                  onClick={() => {
                    handleModelAdd(item);
                  }}
                >
                  <PlusOutlined />
                  <span style={{ marginLeft: '5px' }}>新建模型</span>
                </div>
              </div>
            ) : (
              <div className={styles.modelItem}>
                {item.models?.map((modelItem: any) => (
                  <div className={styles.modelValue} key={modelItem.id}>
                    <div
                      className={styles.modelInfo}
                      onClick={() => {
                        handleDetails(modelItem.id);
                      }}
                    >
                      <div className={styles.modelIcon}>
                        <IconPicker icon={modelItem.icon} />
                      </div>
                      <div className={styles.modelDetails}>
                        <div className={styles.modelName}>{modelItem.name}</div>
                        <div className={styles.modelDescription}>
                          {modelItem.desc !== '' ? modelItem.desc : '暂无描述'}
                        </div>
                      </div>
                    </div>
                    <div
                      className={styles.modelEdit}
                      onClick={() => {
                        createModelRef.current?.showModal('edit', item.id, modelItem);
                      }}
                    >
                      <EditOutlined />
                    </div>
                  </div>
                ))}
                <div
                  className={styles.modelAdd}
                  onClick={() => {
                    handleModelAdd(item);
                  }}
                >
                  <PlusOutlined />
                  <span style={{ marginLeft: '5px' }}>新建模型</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </PageContainer>

      <ModalForm<{
        name: string;
        desc: string;
        order: number;
      }>
        width={500}
        title={modalStatus === 'create' ? '新建模型分组' : '编辑模型分组'}
        open={modalVisit}
        modalProps={{
          destroyOnHidden: true,
        }}
        onFinish={async (values) => {
          if (modalStatus === 'create') {
            await createModelGroup({
              name: values.name,
              desc: values.desc,
              order: values.order,
            });
            await getList();
            messageApi.success('模型分组创建成功');
          } else if (modalStatus === 'edit') {
            if (!groupForm.id) {
              messageApi.error('模型分组创建失败');
              return false;
            }

            await updateModelGroup(groupForm.id, {
              name: values.name,
              desc: values.desc,
              order: values.order,
            });
            await getList();
            messageApi.success('模型分组更新成功');
          }
        }}
        initialValues={groupForm}
        onValuesChange={(_, values) => {
          setGroupForm((prev) => ({ ...prev, ...values }));
        }}
        onOpenChange={setModalVisit}
      >
        <ProFormText
          name="name"
          label="名称："
          placeholder="请输入名称"
          rules={[{ required: true, message: '名称不能为空' }]}
        />
        <ProFormTextArea name="desc" label="备注：" placeholder="请输入备注" />
        <ProFormDigit
          name="order"
          label="顺序："
          min={1}
          placeholder="请输入顺序"
          rules={[{ required: true, message: '顺序不能为空' }]}
        />
      </ModalForm>
      <CreateModel ref={createModelRef} getList={getList} />
    </>
  );
};

export default Models;
