import React, { useState } from "react";
import { Drawer, FloatButton, Button, Space, Tooltip, Divider } from "antd";
import {
  PushpinOutlined,
  LinkOutlined,
  DownloadOutlined,
  LineOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import { CgToolbox } from "react-icons/cg";
import { BiShapePolygon, BiPaint, BiLayer } from "react-icons/bi";
import "./ToolBar.css";

const ToolBar = ({
  handlePinButton,
  showLayerModal,
  showLinkModal,
  handlePaintButton,
  handleLineButton,
  handlePolygonButton,
  handleDownloadButton,
  handleExportButton,
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
        style={{ right: 24, marginBottom: -10, zIndex: 999 }}
        icon={<CgToolbox />}
        tooltip={<div>Tool Bar</div>}
        onClick={showDrawer}
      />
      <div
        className="tool-area"
        style={{ display: visual === false ? "none" : "initial", zIndex: 999 }}
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
              <Tooltip placement="top" title={<span>Layer</span>}>
                <Button
                  type="text"
                  size="large"
                  icon={<BiLayer onClick={showLayerModal} />}
                />
              </Tooltip>
              <Tooltip placement="top" title={<span>Draw</span>}>
                <Button
                  type="text"
                  size="large"
                  icon={<BiPaint onClick={handlePaintButton} />}
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
                  icon={<BiShapePolygon onClick={handlePolygonButton} />}
                />
              </Tooltip>
              <Divider type="vertical" style={{ height: "2em" }} />
              <Tooltip placement="top" title={<span>Link</span>}>
                <Button
                  type="text"
                  size="large"
                  icon={<LinkOutlined onClick={showLinkModal} />}
                />
              </Tooltip>
              <Tooltip placement="top" title={<span>Download</span>}>
                <Button
                  type="text"
                  size="large"
                  icon={<DownloadOutlined onClick={handleDownloadButton} />}
                />
              </Tooltip>
              <Tooltip placement="top" title={<span>Export GeoJson</span>}>
                <Button
                  type="text"
                  size="large"
                  icon={<ExportOutlined onClick={handleExportButton} />}
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
