import React from "react";
import { Button, Space } from "antd";
import LeftDrawer from "./LeftDrawer";
import GoLogo from "../images/goLogo.svg";
import { Link } from "react-router-dom";
import CountrySearch from "./CountrySearch";

const HeaderContents = ({ disasters }) => {
  return (
    <>
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
        <Button
          danger
          href="https://www.youtube.com/watch?v=DSyl1Z1y9Pw"
          target="_blank"
          style={{ width: "auto" }}
        >
          Demo Video
        </Button>
      </Space>
    </>
  );
};

export default HeaderContents;
