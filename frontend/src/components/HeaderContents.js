import React from 'react'
import { Input, Space } from 'antd';
import LeftDrawer from './LeftDrawer';
import GoLogo from '../images/goLogo.svg';

const { Search } = Input;
const onSearch = (value: string) => console.log(value);

const HeaderContents = () => {

  return (
    <>
      <Space> 
        <LeftDrawer />
        <img src={GoLogo} alt="logo" className="logo"/>
        <Search 
          placeholder="Search for places..." 
          allowClear 
          onSearch={onSearch} 
          style={{ width: 300 }} 
        />
      </Space>
    </>
  )
}

export default HeaderContents