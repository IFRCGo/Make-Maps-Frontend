import React, { useEffect, useRef, useState } from "react";
import maplibregl, { Map as map1 } from "maplibre-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import PaintMode from "mapbox-gl-draw-paint-mode";
import DrawPointWithText from "mapbox-gl-draw-point-with-text-mode";
import "./CustomMarker.css";

import "./MapComponent.css";
import ToolBar from "./ToolBar";
import { useParams } from "react-router-dom";
import { FloatButton, Modal } from "antd";

import { LAYERS, API_KEY, MAP_STATUS, LAYER_STATUS } from "./constant";

import "maplibre-gl/dist/maplibre-gl.css";
import jsPDF from "jspdf";
import { CgToolbox } from "react-icons/cg";
import { CgTrash } from "react-icons/cg";

const MapComponent = ({ searchCountry, props }) => {
  // Destructuring
  const [layerStatus, setLayerStatus] = useState(() => {
    return LAYERS.reduce((acc, layer) => {
      acc[layer.name] = LAYER_STATUS.NOT_RENDERING;
      return acc;
    }, {});
  });
  const { long, lat } = useParams();
  const location = {
    longitude: typeof long != "undefined" ? long : 16.62662018,
    latitude: typeof lat != "undefined" ? lat : 49.2125578,
    zoom: typeof long != "undefined" ? 9 : 0,
  };

  const [mapStyle, setMapStyle] = useState(
    "https://api.maptiler.com/maps/basic-v2/style.json?key=HMeYX3yPwK7wfZQDqdeC"
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const mapboxDrawRef = useRef(null);

  const [selectedLayer, setSelectedLayer] = useState(null);
  const [showTrash, setShowTrash] = useState(false);

  useEffect(() => {
    if (!mapContainer) {
      return;
    }
    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [16.62662018, 49.2125578],
      zoom: 14,
    });

    mapboxDrawRef.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: false,
        line_string: false,
        trash: false,
      },
      modes: {
        ...MapboxDraw.modes,
        draw_paint_mode: PaintMode,
        draw_point_with_text_mode: DrawPointWithText,
      },
    });

    mapRef.current.addControl(mapboxDrawRef.current);

    mapRef.current.on("draw.create", function (e) {
      if (e.features[0].geometry.type === "Point") {
        var pointId = e.features[0].id;
        var container = document.getElementById(`text-container-${pointId}`);
        if (!container) {
          container = document.createElement("div");
          container.style.position = "absolute";
          container.style.zIndex = "100";
          container.classList.add("text-container");
          container.id = `text-container-${pointId}`;
          console.log(container.id);

          mapRef.current.getCanvasContainer().appendChild(container);
        }
        var textarea = document.createElement("textarea");
        textarea.cols = 1;
        textarea.style.lineHeight = textarea.style.height;
        textarea.style.width = "180px";
        var zoom = mapRef.current.getZoom();

        textarea.style.fontSize = 5 + (zoom - 10) * 1 + "px"; //

        textarea.style.height = "auto";
        textarea.style.resize = "none";
        textarea.style.overflow = "auto";
        textarea.placeholder =
          "Please enter your text for the marker added... ";
        textarea.style.boxSizing = "border-box";
        textarea.classList.add("custom_text_area");
        textarea.maxLength = 100;

        textarea.value = e.features[0].properties.text || "";

        textarea.addEventListener("input", function () {
          textarea.style.height = "auto";
          textarea.style.height = textarea.scrollHeight + "px";
          textarea.setAttribute("contenteditable", true);

          var screenCoordinates = mapRef.current.project(
            e.features[0].geometry.coordinates
          );
          container.style.left = screenCoordinates.x;
          container.style.top =
            screenCoordinates.y - textarea.clientHeight / 2 + "px";

          mapboxDrawRef.current.setFeatureProperty(
            pointId,
            "text",
            textarea.value
          );

          container.style.left = screenCoordinates.x;
          container.style.top =
            screenCoordinates.y - container.clientHeight / 2 + "px";
        });

        textarea.addEventListener("keyup", function () {
          textarea.dispatchEvent(new Event("input"));
        });
        const MAX_LINES = 2;

        textarea.addEventListener("keydown", function (event) {
          if (event.key === "Enter") {
            const lines = textarea.value.split(/\r*\n/).length;
            if (lines >= MAX_LINES) {
              event.preventDefault();
            }
          }
        });

        container.appendChild(textarea);

        var screenCoordinates = mapRef.current.project(
          e.features[0].geometry.coordinates
        );
        container.style.top =
          screenCoordinates.y - textarea.offsetHeight / 2 + "px";
        container.style.left =
          screenCoordinates.x + textarea.clientHeight / 5 + "px";
        textarea.focus();

        mapRef.current.on("zoom", function () {
          var zoom = mapRef.current.getZoom();
          var fontSize = 5 + (zoom - 10) * 1;

          textarea.style.fontSize = fontSize + "px";
          textarea.style.height = "auto";
          textarea.style.minHeight =
            parseInt(textarea.style.fontSize) * 2 + "px";
          textarea.style.maxHeight = "200px"; // Set the maximum height to 200 pixels

          // Adjust position of text area based on font size
          var screenCoordinates = mapRef.current.project(
            e.features[0].geometry.coordinates
          );
          container.style.left = screenCoordinates.x;
          container.style.top =
            screenCoordinates.y - textarea.clientHeight / 2 + "px";
        });
        mapRef.current.on("move", () => {
          var screenCoordinates = mapRef.current.project(
            e.features[0].geometry.coordinates
          );
          console.log(screenCoordinates);
          container.style.left =
            screenCoordinates.x + textarea.clientHeight / 5 + "px";
          container.style.top =
            screenCoordinates.y - textarea.clientHeight / 2 + "px";
        });
      }
    });

    mapRef.current.on("draw.update", function (e) {
      if (e.features[0].geometry.type === "Point") {
        console.log("inside");
        var pointId = e.features[0].id;
        var container = document.getElementById(`text-container-${pointId}`);
        if (container) {
          var textarea = container.querySelector("textarea");
          if (textarea) {
            var screenCoordinates = mapRef.current.project(
              e.features[0].geometry.coordinates
            );
            container.style.top =
              screenCoordinates.y - textarea.clientHeight / 2 + "px";
            container.style.left =
              screenCoordinates.x + textarea.clientHeight / 4 + "px";

            mapRef.current.on("move", () => {
              var screenCoordinates = mapRef.current.project(
                e.features[0].geometry.coordinates
              );
              console.log(screenCoordinates);
              container.style.left =
                screenCoordinates.x + textarea.clientHeight / 5 + "px";
              container.style.top =
                screenCoordinates.y - textarea.clientHeight / 2 + "px";
            });
          }
          mapRef.current.on("zoom", function () {
            var zoom = mapRef.current.getZoom();
            var fontSize = 5 + (zoom - 10) * 1;
            textarea.style.fontSize = fontSize + "px";
            textarea.style.height = "auto";
            textarea.style.minHeight =
              parseInt(textarea.style.fontSize) * 2 + "px";
            textarea.style.maxHeight = "200px"; // Set the maximum height to 200 pixels

            // Adjust position of text area based on font size
            var screenCoordinates = mapRef.current.project(
              e.features[0].geometry.coordinates
            );
            container.style.left = screenCoordinates.x;
            container.style.top =
              screenCoordinates.y - textarea.clientHeight / 2 + "px";
          });

          textarea.addEventListener("input", function () {
            textarea.style.height = "auto";
            textarea.style.height = textarea.scrollHeight + "px";
            textarea.setAttribute("contenteditable", true);

            var screenCoordinates = mapRef.current.project(
              e.features[0].geometry.coordinates
            );
            container.style.left = screenCoordinates.x;
            container.style.top =
              screenCoordinates.y - textarea.clientHeight / 2 + "px";

            mapboxDrawRef.current.setFeatureProperty(
              pointId,
              "text",
              textarea.value
            );

            container.style.left = screenCoordinates.x;
            container.style.top =
              screenCoordinates.y - container.clientHeight / 2 + "px";
          });
        }
      }
    });
  }, []);

  useEffect(() => {
    mapRef.current.on("load", function () {
      var point = {
        id: "5a4e96f71cb30de68d56cdcddf0d7674",
        type: "Feature",
        properties: {
          text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy",
        },
        geometry: {
          coordinates: [16.623707510200177, 49.21385178384901],
          type: "Point",
        },
      };
      // Add the point feature to the map using the "draw_point" mode
      mapboxDrawRef.current.add(point);

      var pointId = point.id;
      var container = document.getElementById(`text-container-${pointId}`);
      if (!container) {
        container = document.createElement("div");
        container.style.position = "absolute";
        container.style.zIndex = "100";
        container.classList.add("text-container"); // add a CSS class
        container.id = `text-container-${pointId}`;
        console.log(container.id);

        mapRef.current.getCanvasContainer().appendChild(container);
        var textarea = document.createElement("textarea");
        textarea.cols = 1;
        var zoom = mapRef.current.getZoom();
        textarea.style.fontSize = 5 + (zoom - 10) * 1 + "px"; //
        textarea.style.lineHeight = textarea.style.height; // set line height to match height
        textarea.style.width = "180px";
        textarea.style.height = "auto";
        textarea.style.height = "100px"; // or any other maximum height that you want

        textarea.style.height = "auto";
        textarea.style.resize = "none";
        textarea.style.overflow = "auto";
        textarea.placeholder =
          "Please enter your text for the marker added... ";

        textarea.style.boxSizing = "border-box";
        textarea.classList.add("custom_text_area"); // add a CSS class
        textarea.maxLength = 100;

        // Set initial value of textarea to feature's property.text
        textarea.value = point.properties.text || "";

        // handle textarea input events
        textarea.addEventListener("input", function () {
          textarea.style.height = "auto";
          textarea.style.height = textarea.scrollHeight + "px";
          textarea.setAttribute("contenteditable", true);

          var screenCoordinates = mapRef.current.project(
            point.geometry.coordinates
          );
          container.style.left = screenCoordinates.x;
          container.style.top =
            screenCoordinates.y - textarea.clientHeight / 2 + "px";

          mapboxDrawRef.current.setFeatureProperty(
            pointId,
            "text",
            textarea.value
          );

          container.style.left = screenCoordinates.x;
          container.style.top =
            screenCoordinates.y - container.clientHeight / 2 + "px";
        });

        textarea.addEventListener("keyup", function () {
          textarea.dispatchEvent(new Event("input"));
        });
        const MAX_LINES = 2;

        textarea.addEventListener("keydown", function (event) {
          if (event.key === "Enter") {
            const lines = textarea.value.split(/\r*\n/).length;
            if (lines >= MAX_LINES) {
              event.preventDefault();
            }
          }
        });

        container.appendChild(textarea);

        var screenCoordinates = mapRef.current.project(
          point.geometry.coordinates
        );
        container.style.top =
          screenCoordinates.y - textarea.offsetHeight / 2 + "px";
        container.style.left =
          screenCoordinates.x + textarea.clientHeight / 5 + "px";
        textarea.focus();

        mapRef.current.on("zoom", function () {
          var zoom = mapRef.current.getZoom();
          var fontSize = 5 + (zoom - 10) * 1;
          textarea.style.fontSize = fontSize + "px";
          textarea.style.height = "auto";
          textarea.style.minHeight =
            parseInt(textarea.style.fontSize) * 2 + "px";
          textarea.style.maxHeight = "200px"; // Set the maximum height to 200 pixels

          // Adjust position of text area based on font size
          var screenCoordinates = mapRef.current.project(
            point.geometry.coordinates
          );
          container.style.left = screenCoordinates.x;
          container.style.top =
            screenCoordinates.y - textarea.clientHeight / 2 + "px";
        });
        mapRef.current.on("move", () => {
          var screenCoordinates = mapRef.current.project(
            point.geometry.coordinates
          );
          console.log(screenCoordinates);
          container.style.left =
            screenCoordinates.x + textarea.clientHeight / 5 + "px";
          container.style.top =
            screenCoordinates.y - textarea.clientHeight / 2 + "px";
        });
      }
    });
  }, []);

  useEffect(() => {
    if (!mapContainer) {
      return;
    }
    mapRef.current.setStyle(mapStyle);
  }, [mapStyle]);
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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

  const handlePinButton = () => {
    mapboxDrawRef.current.changeMode("draw_point_with_text_mode");
  };
  const handlePaintButton = () => {
    mapboxDrawRef.current.changeMode("draw_paint_mode");
  };

  const handleLineButton = () => {
    mapboxDrawRef.current.changeMode("draw_line_string");
  };
  const handlePolygonButton = () => {
    mapboxDrawRef.current.changeMode("draw_polygon");
  };

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

  const handleDownloadButton = () => {
    const maplibreMap = mapRef.current.getMap();

    const renderMap = new map1({
      container: maplibreMap.getContainer(),
      style: maplibreMap.getStyle(),
      center: maplibreMap.getCenter(),
      zoom: maplibreMap.getZoom(),
      bearing: maplibreMap.getBearing(),
      pitch: maplibreMap.getPitch(),
      interactive: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
      attributionControl: false,
    });

    renderMap.once("idle", () => {
      setTimeout(() => {
        const canvasDataURL = renderMap.getCanvas().toDataURL();
        const link = document.createElement("a");
        link.href = canvasDataURL;
        link.download = "map-export.png";
        const pdf = new jsPDF("l", "mm", "a4");

        // Add the map image to the PDF document
        pdf.addImage(
          canvasDataURL,
          "PNG",
          0,
          0,
          pdf.internal.pageSize.getWidth(),
          pdf.internal.pageSize.getHeight()
        );

        // Save the PDF file
        pdf.save("map-export.pdf");
        link.click();
        link.remove();
      }, 1000);
    });

    renderMap.once("idle", () => {
      setTimeout(() => {
        renderMap.remove();
      }, 1000);
    });
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

  return (
    <div className="map-wrap">
      <FloatButton
        shape="square"
        style={{ right: 100, marginBottom: -10 }}
        icon={<CgTrash />}
        onClick={() => {
          const selectedFeatures = mapboxDrawRef.current.getSelected().features;
          selectedFeatures.forEach((feature) => {
            let state = feature;
            if (state.geometry.type === "Point") {
              let container = document.getElementById(
                `text-container-${state.id}`
              );
              if (container) {
                console.log("Found container element:", container);
                setTimeout(() => {
                  container.remove();
                }, 0);
              } else {
                console.log(
                  `Could not find container with ID 'text-container-${state.id}'`
                );
              }
              mapboxDrawRef.current.trash();
            } else {
              mapboxDrawRef.current.trash();
            }
          });
        }}
      />

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
      <div ref={mapContainer} style={{ width: "100vw", height: "100vh" }} />
      <ToolBar
        handlePinButton={handlePinButton}
        setMapStyle={setMapStyle}
        handlePaintButton={handlePaintButton}
        handleLineButton={handleLineButton}
        handlePolygonButton={handlePolygonButton}
        handleDownloadButton={handleDownloadButton}
        handleExportButton={() => {
          const json = mapboxDrawRef.current.getAll();

          const filename = "data.json";

          const blob = new Blob([JSON.stringify(json, null, 2)], {
            type: "application/json",
          });

          const url = URL.createObjectURL(blob);

          const link = document.createElement("a");
          link.setAttribute("download", filename);
          link.setAttribute("href", url);

          link.click();
        }}
      />
    </div>
  );
};

export default MapComponent;
