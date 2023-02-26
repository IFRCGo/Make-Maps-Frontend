import React, { useState } from "react";
import { FloatButton, Button, Space, Popover } from "antd";
import { HiOutlineMap } from "react-icons/hi";

const StyleButton = ({ setMapType }) => {
  const [select, setSelect] = useState("Default")

  const layerContent = (
    <div>
      <Space>
        <Space.Compact direction="vertical">
          <Button
            className="layer-button"
            type={select === "Default" ? "primary" : "text"}
            onClick={() => {
              setMapType(
                "https://api.maptiler.com/maps/basic-v2/style.json?key=HMeYX3yPwK7wfZQDqdeC"
              );
              setSelect("Default");
            }}
          >
            <Space>
              <img
                className="layer-img"
                src="https://cloud.maptiler.com/static/img/maps/basic-v2.png?t=1663665773"
                width="40"
                height="40"
                alt="basic"
              />
              <p>Default</p>
            </Space>
          </Button>
          <Button
            className="layer-button"
            type={select === "Street" ? "primary" : "text"}
            onClick={() => {
              setMapType(
                "https://api.maptiler.com/maps/streets-v2/style.json?key=HMeYX3yPwK7wfZQDqdeC"
              );
              setSelect("Street");
            }}
          >
            <Space>
              <img
                className="layer-img"
                src="https://cloud.maptiler.com/static/img/maps/streets-v2.png?t=1663665773"
                width="40"
                height="40"
                alt="basic"
              />
              <p>Street</p>
            </Space>
          </Button>
          <Button
            className="layer-button"
            type={select === "Open" ? "primary" : "text"}
            onClick={() => {
              setMapType(
                "https://api.maptiler.com/maps/openstreetmap/style.json?key=HMeYX3yPwK7wfZQDqdeC"
              );
              setSelect("Open");
            }}
          >
            <Space>
              <img
                className="layer-img"
                src="https://cloud.maptiler.com/static/img/maps/openstreetmap.png?t=1663665773"
                width="40"
                height="40"
                alt="basic"
              />
              <p>Open Street</p>
            </Space>
          </Button>
          <Button
            className="layer-button"
            type={select === "Satellite" ? "primary" : "text"}
            onClick={() => {
              setMapType(
                "https://api.maptiler.com/maps/hybrid/style.json?key=HMeYX3yPwK7wfZQDqdeC"
              );
              setSelect("Satellite");
            }}
          >
            <Space>
              <img
                className="layer-img"
                src="https://cloud.maptiler.com/static/img/maps/hybrid.png?t=1663665773"
                width="40"
                height="40"
                alt="basic"
              />
              <p>Satellite</p>
            </Space>
          </Button>
        </Space.Compact>
      </Space>
    </div>
  );

  return (
    <Popover
      placement="topLeft"
      content={layerContent}
      trigger="click"
    >
      <FloatButton
        shape="square"
        style={{
          right: 24,
          marginBottom: 45,
        }}
        icon={<HiOutlineMap />}
        tooltip={<div>Backgrounds</div>}
      />
    </Popover>
  )
}

export default StyleButton