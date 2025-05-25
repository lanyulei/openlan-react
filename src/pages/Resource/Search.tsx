import React from 'react';
import { Input } from 'antd';
import { useIntl } from '@umijs/max';

const { Search: AntdSearch } = Input;

const SearchHandler = (searchText: string) => {
  console.log(searchText);
};

const Search: React.FC = () => {
  const intl = useIntl();
  const [searchText, setSearchText] = React.useState('');
  return (
    <div>
      <div style={{ width: '50%', marginLeft: '25%', marginTop: '100px' }}>
        <AntdSearch
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={() => {
            SearchHandler(searchText);
          }}
          placeholder={intl.formatMessage({
            id: 'resource.searchPlaceholder',
            defaultMessage: '请输入内容',
          })}
          enterButton={intl.formatMessage({ id: 'resource.searchButton', defaultMessage: '搜索' })}
          size="large"
        />
      </div>
    </div>
  );
};

export default Search;
