import React, { useState } from "react";
import { FloatButton, Button, Space, Popover } from "antd";
import { HiOutlineMap } from "react-icons/hi";

const StyleButton = ({ mapRef }) => {
  const [select, setSelect] = useState("Default");

  const moveLayer = () => {
    const layers = mapRef.current.getStyle().layers;
    const drawLayers = layers.filter((layer) => layer.id.startsWith("gl-draw"));
    drawLayers.forEach((layer) => {
      mapRef.current.moveLayer(layer.id);
    });
  };

  const removeLayer = () => {
    const layers = mapRef.current.getStyle().layers;
    const StyleLayers = layers
      ? layers.filter((layer) => layer.id.startsWith("IFRC_GO_Make_Maps_Style"))
      : [];

    if (StyleLayers !== []) {
      StyleLayers.forEach((layer) => {
        console.log(layer);
        mapRef.current.removeLayer(layer.id);
        mapRef.current.removeSource(layer.id);
      });
    }
  };

  const createLayer = (layerName, layerURL, opacity = 1) => {
    mapRef.current.addSource(layerName, {
      type: "raster",
      tiles: [layerURL],
      tileSize: 256,
    });
    mapRef.current.addLayer({
      id: layerName,
      type: "raster",
      source: layerName,
      paint: {
        "raster-opacity": opacity,
      },
    });
  };

  const layerContent = (
    <div>
      <Space>
        <Space.Compact direction="vertical">
          <Button
            className="layer-button"
            type={select === "Default" ? "primary" : "text"}
            onClick={() => {
              setSelect("Default");
              removeLayer();
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
              removeLayer();
              createLayer(
                "IFRC_GO_Make_Maps_Style_Street",
                "https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=HMeYX3yPwK7wfZQDqdeC"
              );
              moveLayer();
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
            type={select === "OpenStreet" ? "primary" : "text"}
            onClick={() => {
              removeLayer();
              createLayer(
                "IFRC_GO_Make_Maps_Style_OpenStreet",
                "https://api.maptiler.com/maps/openstreetmap/{z}/{x}/{y}.jpg?key=HMeYX3yPwK7wfZQDqdeC"
              );
              moveLayer();
              setSelect("OpenStreet");
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
              removeLayer();
              createLayer(
                "IFRC_GO_Make_Maps_Style_Satellite",
                "https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=HMeYX3yPwK7wfZQDqdeC",
                0.8
              );
              moveLayer();
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
          <Button
            className="layer-button"
            type={select === "Ocean" ? "primary" : "text"}
            onClick={() => {
              removeLayer();
              createLayer(
                "IFRC_GO_Make_Maps_Style_Ocean",
                "https://api.maptiler.com/maps/ocean/{z}/{x}/{y}.png?key=HMeYX3yPwK7wfZQDqdeC"
              );
              moveLayer();
              setSelect("Ocean");
            }}
          >
            <Space>
              <img
                className="layer-img"
                src="https://cloud.maptiler.com/static/img/maps/ocean.png?t=1677738994"
                width="40"
                height="40"
                alt="basic"
              />
              <p>Ocean</p>
            </Space>
          </Button>
        </Space.Compact>
      </Space>
    </div>
  );

  return (
    <Popover placement="topLeft" content={layerContent} trigger="click">
      <FloatButton
        shape="square"
        style={{
          right: 24,
          marginBottom: 45,
          zIndex: 999,
        }}
        icon={<HiOutlineMap />}
        tooltip={<div>Backgrounds</div>}
      />
    </Popover>
  );
};

export default StyleButton;
