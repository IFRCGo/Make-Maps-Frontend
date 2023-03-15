import React from "react";
import { Button, Drawer, Menu } from "antd";
import { useState } from "react";
import { MenuOutlined, HomeOutlined } from "@ant-design/icons";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";
import "./LeftDrawer.css";

const LeftDrawer = () => {
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  function getItem(label, key, icon) {
    return {
      label,
      key,
      icon,
    };
  }

  const items = [
    getItem(
      <Link to="/" onClick={onClose}>
        <p>Home</p>
      </Link>,
      "home",
      <HomeOutlined />
    ),
  ];

  return (
    <>
      <Button
        style={{
          left: 10,
        }}
        size="large"
        type="text"
        onClick={showDrawer}
        icon={<MenuOutlined />}
      ></Button>
      <Drawer
        title="IFRC Go Make Maps"
        placement="left"
        onClose={onClose}
        closable={false}
        open={open}
        width={300}
        extra={
          <button className="close-button" onClick={onClose}>
            <IoClose />
          </button>
        }
      >
        <Menu
          style={{
            width: "100%",
          }}
          mode="inline"
          selectable={false}
          items={items}
        />
      </Drawer>
    </>
  );
};

export default LeftDrawer;
