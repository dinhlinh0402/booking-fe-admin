import React, { useEffect, useRef, useState, Fragment } from 'react';
import { Card, Checkbox, Divider, Dropdown, Empty, Input, Space, Typography } from 'antd';
import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import { change_alias } from '../../utils/regex';
import './FilterObjDropDown.scss';

const { Text } = Typography;

const FilterObjDropDown = ({
  checkAll = true,
  isSearch = true,
  plainOptions,
  checkedList,
  keyFilter,
  placeholder,
  displayName,
  handleCheckAll,
  handleCheck,
}) => {
  const [search, setSearch] = useState('');
  const typingSearch = useRef(null);
  const [listOptions, setListOptions] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);

  useEffect(() => {
    setListOptions(plainOptions);
  }, [plainOptions]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    if (typingSearch.current) {
      clearTimeout(typingSearch.current);
    }

    typingSearch.current = setTimeout(() => {
      const searchLike = new RegExp(change_alias(e.target.value), 'gi');
      const data = plainOptions.filter((i) => searchLike.test(change_alias(i.name)));
      setListOptions(data);
    }, 500);
  };

  const onCheckAllChange = (e) => {
    handleCheckAll(keyFilter, e.target.checked ? listOptions.map((i) => i.key) : []);
    setIndeterminate(false);
  };

  const onChange = (list) => {
    handleCheck(keyFilter, list);
    setIndeterminate(!!list.length && list.length < listOptions.length);
  };

  const menu = () => {
    return (
      <Card size='small' id='card__dropdown'>
        {isSearch && (
          <>
            <Input
              allowClear
              className='input__drop'
              prefix={<SearchOutlined />}
              placeholder={`${placeholder}`}
              value={search}
              onChange={handleSearch}
            />
            <br />
          </>
        )}
        <div id='card__content'>
          {plainOptions.length && listOptions.length ? (
            <>
              {checkAll && (
                <>
                  <Checkbox
                    className='check__all'
                    indeterminate={indeterminate}
                    checked={checkedList.length === listOptions.length}
                    onChange={onCheckAllChange}
                  >
                    Chọn tất cả
                  </Checkbox>
                  <br />
                </>
              )}
              <Checkbox.Group value={checkedList} onChange={onChange}>
                {listOptions.map((i, index) => (
                  <Fragment key={`check_boc_item_${index}`}>
                    <Checkbox
                      className={`${checkAll ? 'check__item' : 'style_check__noAll'}`}
                      value={i.key}
                    >
                      {i.name}
                    </Checkbox>
                    <br />
                  </Fragment>
                ))}
              </Checkbox.Group>
            </>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </div>
        <Divider style={{ marginBottom: 8 }} />
        <Text id='txt__count'>Đã chọn: {checkedList.length}</Text>
      </Card>
    );
  };

  return (
    <Dropdown
      className='filter__dropdown'
      overlay={menu} trigger={['click']}
      getPopupContainer={(trigger) => trigger.parentElement}
    >
      <Space
        size={3}
        style={{ color: `${checkedList && checkedList.length > 0 ? 'rgba(17, 17, 17, 0.75)' : ''}` }}
      >
        {displayName} {checkedList && checkedList.length > 0 ? <span>({checkedList.length})</span> : ''}
        <DownOutlined style={{ fontSize: '12px' }} />
        {checkedList && checkedList.length > 0 && <span id='dot__active' />}
      </Space>
    </Dropdown>
  );
};

export default FilterObjDropDown;
