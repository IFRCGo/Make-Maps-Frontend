import React from 'react'
import { Drawer, FloatButton, Button, Space } from 'antd';
import { useState } from 'react';
import { ToolOutlined, PushpinOutlined, FormOutlined, LinkOutlined, DownloadOutlined } from '@ant-design/icons';
import './ToolBar.css'

const ToolBar = ({ handlePinButton , handleTextButton}) => {
  const [open, setOpen] = useState(true);
  const showDrawer = () => {
    open === false ? setOpen(true) : setOpen(false);
  };
  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <FloatButton
        shape="square"
        style={{ right: 24, marginBottom: 20 }}
        icon={<ToolOutlined />}
        onClick={showDrawer}
      />
      <div className="tool-area">
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
              <Button type="text" size="large" icon={<PushpinOutlined onClick={handlePinButton} />} />
              <Button type="text" size="large" icon={<FormOutlined onClick={handleTextButton}/>} />
              <Button type="text" size="large" icon={<LinkOutlined />} />
              <Button type="text" size="large" icon={<DownloadOutlined />} />
            </Space>
          </div>
        </Drawer>
      </div>
      
    </>
  );
}

export default ToolBar