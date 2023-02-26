import React, { useState } from "react";
import { Modal } from "antd";
import { LAYERS, LAYER_STATUS } from "./constant";

const LayerCard = ({ 
  mapRef, 
  isModalOpen, 
  setIsModalOpen 
}) => {
  const [layerStatus, setLayerStatus] = useState(() => {
		return LAYERS.reduce((acc, layer) => {
			acc[layer.name] = LAYER_STATUS.NOT_RENDERING;
			return acc;
		}, {});
	});

  const addLayer = (layerName) => {
		const maplibreMap = mapRef.current.getMap();
		const layer = LAYERS.find((layer) => layer.name === layerName);
		maplibreMap.addSource(layerName, {
			type: "raster",
			tiles: [layer.url],
			tileSize: 256,
		});
		maplibreMap.addLayer({
			id: layerName,
			type: "raster",
			source: layerName,
			paint: {
				"raster-opacity": 1,
			},
		});
		updateLayerStatus(layerName, LAYER_STATUS.IS_RENDERING);
	};

  const removeLayer = (layerName) => {
		const maplibreMap = mapRef.current.getMap();
		maplibreMap.removeLayer(layerName);
		maplibreMap.removeSource(layerName);
		updateLayerStatus(layerName, LAYER_STATUS.NOT_RENDERING);
	};

	const changeOpacity = (event, LayerName) => {
		const value = event.target.value;
		const opacity = value / 100;
		const maplibreMap = mapRef.current.getMap();
		maplibreMap.setPaintProperty(LayerName, "raster-opacity", opacity);
	};

  const checkLayerStatus = (layerName) => {
		return layerStatus[layerName];
	};

  const updateLayerStatus = (layerName, status) => {
		setLayerStatus({
			...layerStatus,
			[layerName]: status,
		});
	};

  const handleOk = () => {
		setIsModalOpen(false);
	};

	const handleCancel = () => {
		setIsModalOpen(false);
	};

  return (
    <Modal
      title="Basic Modal"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      {LAYERS.map((item, index) => (
        <div key={index}>
          <div>{item.name}</div>
          {checkLayerStatus(item.name) === LAYER_STATUS.IS_RENDERING ? (
            <>
              <input
                type="range"
                min="0"
                max="100"
                onChange={(e) => changeOpacity(e, item.name)}
              />
              <button onClick={(e) => removeLayer(item.name)}>
                Remove this layer
              </button>
            </>
          ) : (
            <button onClick={(e) => addLayer(item.name)}>
              Add this layer
            </button>
          )}
        </div>
      ))}
    </Modal>
  )
}

export default LayerCard