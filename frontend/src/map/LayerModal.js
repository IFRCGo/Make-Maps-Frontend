import React, { useState } from "react";
import { Modal } from "antd";
import { LAYERS, LAYER_STATUS } from "./constant";
import IFRCPointModal from "./IFRCPointModal";

const LayerModal = ({
  mapRef,
  isModalOpen,
  setIsModalOpen,
  currentLayers,
  setCurrentLayers,
}) => {


  const [IFRCModalOpen, setIFRCModalOpen] = useState(false);
  const [reloadID, setReloadID] = useState();

  const [layerStatus, setLayerStatus] = useState(() => {
    return LAYERS.reduce((acc, layer) => {
      acc[layer.name] = LAYER_STATUS.NOT_RENDERING;
      return acc;
    }, {});
  });

  const addLayer = (layerName) => {
    setCurrentLayers([...currentLayers, layerName]);
    const maplibreMap = mapRef.current;
    const layer = LAYERS.find((layer) => layer.name === layerName);
    if (layer.type === "TMS") {
      addTMSLayer(maplibreMap, layer);
    } else if (layer.type === "geojson") {
      addGeoJsonLayer(maplibreMap, layer);
    };

    const layers = mapRef.current.getStyle().layers;

    const drawLayers = layers.filter((layer) => layer.id.startsWith("gl-draw"));

    drawLayers.forEach((layer) => {
      mapRef.current.moveLayer(layer.id);
    });
    updateLayerStatus(layerName, LAYER_STATUS.IS_RENDERING);
  };

  const addTMSLayer = (map, layer) => {
    map.addSource(layer.name, {
      type: "raster",
      tiles: [layer.url],
      tileSize: 256,
    });
    map.addLayer({
      id: layer.name,
      type: "raster",
      source: layer.name,
      paint: {
        "raster-opacity": 1,
      },
    });
  };

  const addGeoJsonLayer = (map, layer) => {
    map.loadImage(
      require("./../images/IFRC.jpeg"),
      function (error, image) {
        if (error) throw error;
        map.addImage("custom-marker", image);
        // Add a GeoJSON source with 15 points
        map.addSource(layer.name, {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: layer.data,
          },
        });

        // Add a symbol layer
        map.addLayer({
          id: layer.name,
          type: "symbol",
          source: layer.name,
          layout: {
            "icon-image": "custom-marker",
            "icon-size": 0.1,
          },
          interactive: true
        });
      }
    );

    if (layer.name === 'IFRC Points') {
      map.on('dblclick', layer.name, function (e) {
        const features = map.queryRenderedFeatures(e.point, { layers: ['IFRC Points'] });
        const clickedFeature = features[0];
        console.log(clickedFeature.geometry.coordinates);
        const clickedFeatureId = clickedFeature.properties.id;
        setReloadID(clickedFeatureId);
        setIFRCModalOpen(true);
      })
    }
  };

  const updateFeatureGeometry = (layer, featureId, newCoordinates) => {
    const feature = layer.data.find(f => f.properties.id === featureId);
    console.log(featureId);
    feature.geometry.coordinates = newCoordinates;
    const updatedFeatures = [...layer.data];
    updatedFeatures[featureId] = feature;
    layer.data = updatedFeatures;
  };

  const reloadLayer = (layer) => {
    removeLayer(layer.name);
    addLayer(layer.name);
  };



  const removeLayer = (layerName) => {
    setCurrentLayers(currentLayers.filter((layer) => layer !== layerName));
    const maplibreMap = mapRef.current;
    maplibreMap.removeLayer(layerName);
    maplibreMap.removeSource(layerName);
    if (maplibreMap.hasImage("custom-marker")) {
      maplibreMap.removeImage("custom-marker");
    }
    updateLayerStatus(layerName, LAYER_STATUS.NOT_RENDERING);
  };

  const changeOpacity = (event, layerName) => {
    const value = event.target.value;
    const opacity = value / 100;
    const maplibreMap = mapRef.current;
    const layer = LAYERS.find((layer) => layer.name === layerName);
    if (layer.type === "TMS") {
      maplibreMap.setPaintProperty(layerName, "raster-opacity", opacity);
    } else {
      maplibreMap.setPaintProperty(layerName, "icon-opacity", opacity);
    }
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
    <>
    <Modal
      title="Basic Modal"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      style={{ maxHeight: "300px" }}
    >
      {LAYERS.map((item, index) => (
        <div
          key={index}
          style={{
            border: "2px ",
            borderRadius: "5px",
            padding: "10px",
          }}
        >
          <div
            style={{
              fontWeight: "bold",
            }}
          >
            {item.name}
          </div>
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
            <button onClick={(e) => addLayer(item.name)}>Add this layer</button>
          )}
        </div>
      ))}
    </Modal>
    <IFRCPointModal
        IFRCModalOpen={IFRCModalOpen}
        setIFRCModalOpen={setIFRCModalOpen}
        reloadLayer={reloadLayer}
        reloadedLayer={LAYERS.find((layer) => layer.name === "IFRC Points")}
        featureID={reloadID}
        updateFeatureGeometry={updateFeatureGeometry}
      />
    </>
  );
};

export default LayerModal;
