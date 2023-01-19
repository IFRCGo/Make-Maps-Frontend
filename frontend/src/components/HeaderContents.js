import React from 'react'
import { Input, Space } from 'antd';
import LeftDrawer from './LeftDrawer';

const { Search } = Input;
const onSearch = (value: string) => console.log(value);

const HeaderContents = () => {

  return (
    <>
      <LeftDrawer />
      <Space direction="horizontal" style={{position: 'fixed', width: '100%', top: '14px', justifyContent: 'center', alignContent: 'center'}}> 
        <Search 
          placeholder="input search text" 
          allowClear 
          onSearch={onSearch} 
          style={{ width: 500 }} 
        />
      </Space>
    </>
  )
}

export default HeaderContents