import React from "react";
import { Drawer, FloatButton, Button, Space, Tooltip } from "antd";
import { useState } from "react";
import {
  PushpinOutlined,
  FormOutlined,
  LinkOutlined,
  DownloadOutlined,
  FormatPainterOutlined,
  LineOutlined,
  LineChartOutlined,
  ControlOutlined,
} from "@ant-design/icons";
import { CgToolbox } from "react-icons/cg";
import { FiLayers } from "react-icons/fi";
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
              <Tooltip placement="top" title={<span>Pin</span>}>
                <Button
                  type="text"
                  size="large"
                  icon={<PushpinOutlined onClick={handlePinButton} />}
                />
              </Tooltip>
              <Tooltip placement="top" title={<span>Text</span>}>
                <Button
                  type="text"
                  size="large"
                  icon={<FormOutlined onClick={handleTextButton} />}
                />
              </Tooltip>
              <Tooltip placement="top" title={<span>Layer</span>}>
                <Button
                  type="text"
                  size="large"
                  icon={<ControlOutlined />}
                />
              </Tooltip>
              <Tooltip placement="top" title={<span>Draw</span>}>
                <Button
                  type="text"
                  size="large"
                  icon={<FormatPainterOutlined onClick={handlePaintButton} />}
                />
              </Tooltip>
              <Tooltip placement="top" title={<span>Line</span>}>
                <Button
                  type="text"
                  size="large"
                  icon={<LineOutlined onClick={handleLineButton} />}
                />
              </Tooltip>
              <Tooltip placement="top" title={<span>Polygon</span>}>
                <Button
                  type="text"
                  size="large"
                  icon={<LineChartOutlined onClick={handlePolygonButton} />}
                />
              </Tooltip>
              <Tooltip placement="top" title={<span>Link</span>}>
                <Button type="text" size="large" icon={<LinkOutlined />} />
              </Tooltip>
              <Tooltip placement="top" title={<span>Download</span>}>
                <Button
                  type="text"
                  size="large"
                  icon={<DownloadOutlined onClick={handleDownloadButton} />} 
                />
              </Tooltip>
            </Space>
          </div>
        </Drawer>
      </div>
    </>
  );
};

export default ToolBar;
