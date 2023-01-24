import React from 'react'
import { Drawer, FloatButton, Button, Space } from 'antd';
import { useState } from 'react';
import { ToolOutlined, PushpinOutlined, FormOutlined, LinkOutlined, DownloadOutlined } from '@ant-design/icons';
import './ToolBar.css'

const ToolBar = () => {
  const [open, setOpen] = useState(false);
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
              <Button type="text" size="large" icon={<PushpinOutlined />} />
              <Button type="text" size="large" icon={<FormOutlined />} />
              <Button type="text" size="large" icon={<LinkOutlined />} />
              <Button type="text" size="large" icon={<DownloadOutlined />} />
              <Button type="text" size="large" icon={<img src="https://cloud.maptiler.com/static/img/maps/basic-v2.png?t=1663665773" width="40" height="40" alt='basic'></img>} />
              <Button type="text" size="large" icon={<img src="https://cloud.maptiler.com/static/img/maps/streets-v2.png?t=1663665773" width="40" height="40" alt='basic'></img>} />
              <Button type="text" size="large" icon={<img src="https://cloud.maptiler.com/static/img/maps/openstreetmap.png?t=1663665773" width="40" height="40" alt='basic'></img>} />
              <Button type="text" size="large" icon={<img src="https://cloud.maptiler.com/static/img/maps/hybrid.png?t=1663665773" width="40" height="40" alt='basic'></img>} />
            </Space>
          </div>
        </Drawer>
      </div>
      
    </>
  );
}

export default ToolBar