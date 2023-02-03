import React from "react";
import { Layout as AntdLayout, theme } from "antd";
import HeaderContents from "./HeaderContents";
import { Outlet } from 'react-router-dom';

const Layout = () => {

  const { Header, Content, Footer } = AntdLayout;
  const { token: { colorBgContainer } } = theme.useToken();

  return (
    <div className="App">
      <AntdLayout className="site-layout">
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <HeaderContents />
        </Header>
        <Content style={{ background: colorBgContainer }}>
          <Outlet />
        </Content>
        <Footer
          style={{
            textAlign: "center",
            background: colorBgContainer,
          }}
        >
          IFRC GO MAKE MAPS ©2023
        </Footer>
      </AntdLayout>
    </div>
  )
}

export default Layout;