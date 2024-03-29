import React from "react";
import { Layout as AntdLayout, theme } from "antd";
import HeaderContents from "./HeaderContents";
import { Outlet } from "react-router-dom";

const Layout = ({ disasters }) => {
  const { Header, Content } = AntdLayout;
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <div className="App">
      <AntdLayout className="site-layout">
        <Header
          style={{
            padding: 0,
            position: "sticky",
            top: 0,
            zIndex: 999,
            width: "100%",
            background: colorBgContainer,
          }}
        >
          <HeaderContents disasters={disasters} />
        </Header>
        <Content style={{ background: colorBgContainer }}>
          <Outlet />
        </Content>
      </AntdLayout>
    </div>
  );
};

export default Layout;
