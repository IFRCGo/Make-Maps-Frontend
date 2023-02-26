import React from "react";
import { Drawer, FloatButton, Button, Space } from "antd";
import { useState } from "react";
import {
  PushpinOutlined,
  FormOutlined,
  LinkOutlined,
  DownloadOutlined,
  FormatPainterOutlined,
  LineOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import { CgToolbox } from "react-icons/cg";
import "./ToolBar.css";

const ToolBar = ({
  handlePinButton,
  handleTextButton,
  handlePaintButton,
  handleLineButton,
  handlePolygonButton,
  handleDownloadButton,
}) => {
  const [open, setOpen] = useState(true);
  const [visual, setVisual] = useState(true);

  const showDrawer = () => {
    open === false ? setOpen(true) : setOpen(false);
    visual === false
      ? setVisual(true)
      : setTimeout(() => {
        setVisual(false);
      }, 300);
  };
  const onClose = () => {
    setOpen(false);
    setVisual(false);
  };

  return (
    <>
      <FloatButton
        shape="square"
        style={{ right: 24, marginBottom: -10 }}
        icon={<CgToolbox />}
        tooltip={<div>Tool Bar</div>}
        onClick={showDrawer}
      />
      <div
        className="tool-area"
        style={{ display: visual === false ? "none" : "initial" }}
      >
        <Drawer
          autoFocus={false}
          height={100}
          mask={false}
          placement="bottom"
          closable={false}
          onClose={onClose}
          open={open}
          getContainer={false}
        >
          <div className="tool-button">
            <Space>
              <Button
                type="text"
                size="large"
                icon={<PushpinOutlined onClick={handlePinButton} />}
              />
              <Button
                type="text"
                size="large"
                icon={<FormOutlined onClick={handleTextButton} />}
              />
              <Button
                type="text"
                size="large"
                icon={<FormatPainterOutlined onClick={handlePaintButton} />}
              />
              <Button
                type="text"
                size="large"
                icon={<LineOutlined onClick={handleLineButton} />}
              />
              <Button
                type="text"
                size="large"
                icon={<LineChartOutlined onClick={handlePolygonButton} />}
              />
              <Button type="text" size="large" icon={<LinkOutlined />} />
              <Button
                type="text"
                size="large"
                icon={<DownloadOutlined onClick={handleDownloadButton} />} />
            </Space>
          </div>
        </Drawer>
      </div>
    </>
  );
};

export default ToolBar;
