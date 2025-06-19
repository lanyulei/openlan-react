import React from 'react';
import { Input, Tag } from 'antd';
import { useIntl } from '@umijs/max';
import { searchData } from '@/services/resource/search';
import styles from './Search.less';
import { formatDate } from '@/utils/tools/tools';
import { useNavigate } from 'react-router-dom';

const { Search: AntdSearch } = Input;

const Search: React.FC = () => {
  const navigate = useNavigate();
  const intl = useIntl();
  const [searchText, setSearchText] = React.useState('');
  const [dataList, setDataList] = React.useState<any[]>([]);
  const [countStatus, setCountStatus] = React.useState(false);

  const SearchHandler = async (searchText: string) => {
    if (!searchText || searchText === '') {
      setDataList([]);
      return;
    }
    setCountStatus(true);
    const _res = await searchData({ query: searchText }, {});
    setDataList(_res.data);
  };

  return (
    <div>
      <div style={{ width: '50%', marginLeft: '25%', marginTop: '100px' }}>
        <AntdSearch
          value={searchText}
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={async () => {
            await SearchHandler(searchText);
          }}
          placeholder={intl.formatMessage({
            id: 'resource.searchPlaceholder',
            defaultMessage: '请输入内容',
          })}
          enterButton={intl.formatMessage({ id: 'resource.searchButton', defaultMessage: '搜索' })}
          size="large"
        />
      </div>
      {countStatus && (
        <div className={styles.searchResultCount}>
          共 {dataList?.length || 0} 条搜索结果，最多展示最近的 50 条数据
        </div>
      )}
      {dataList?.length > 0 && (
        <div className={styles.searchResultList}>
          {dataList?.map((item, index) => (
            <div
              style={{ cursor: 'pointer' }}
              key={index}
              className={styles.searchResultItem}
              onClick={() => {
                navigate(`/resource/data/details/${item.model_id}/${item.id}`);
              }}
            >
              <div
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  display: '-webkit-box',
                }}
              >
                {item?.data &&
                  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                  Object.entries(item.data).map(([_, value], dataIndex) => (
                    <Tag key={dataIndex} style={{ marginBottom: 8 }}>{`${value}`}</Tag>
                  ))}
              </div>
              <div className={styles.searchResultModel}>
                <div>模型：{item.model_name}</div>
                <div>数据 ID：{item.id}</div>
                <div>创建时间：{formatDate(item.create_time)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
