import React from "react";
import { Space } from "antd";
import LeftDrawer from "./LeftDrawer";
import GoLogo from "../images/goLogo.svg";
import { Link } from "react-router-dom";
import CountrySearch from "./CountrySearch";

const HeaderContents = ({ disasters }) => {
  return (
    <Space
      direction="horizontal"
      size={15}
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <LeftDrawer />
      <Link to="/">
        <div className="logo-wrap">
          <img src={GoLogo} alt="logo" className="logo" />
        </div>
      </Link>
      <CountrySearch disasters={disasters} />
    </Space>
  );
};

export default HeaderContents;
