import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import maplibregl, { Map } from "!maplibre-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import PaintMode from "mapbox-gl-draw-paint-mode";
import DrawPointWithText from "mapbox-gl-draw-point-with-text-mode";
import jsPDF from "jspdf";
import { Card, Collapse } from "antd";
import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import { useMutation, useQuery } from "@apollo/client";
import * as Query from "../API/AllQueries";
import * as Mutation from "../API/AllMutations";
import StyleButton from "./StyleButton";
import LayerModal from "./LayerModal";
import TrashButton from "./TrashButton";
import ToolBar from "./ToolBar";
import "./CustomMarker.css";
import "./MapComponent.css";
import DrawStyles from "./DrawStyles";
import html2canvas from "html2canvas";

const { Meta } = Card;

const { Panel } = Collapse;

const CountryMap = ({ searchCountry, disasters }) => {
  const { id, long, lat } = useParams();
  const { state } = useLocation();
  const { countryData } = state || {};

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLayers, setCurrentLayers] = useState([]);

  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const mapboxDrawRef = useRef(null);

  const { loading, error, data } = useQuery(Query.GET_PINS, {
    variables: {
      filter: {
        disaster: countryData._id,
      },
    },
  });

  const {
    loading: layersLoading,
    error: layersError,
    data: layersData,
  } = useQuery(Query.GET_DRAWING_LAYERS, {
    variables: {
      filter: {
        disaster: countryData._id,
      },
    },
  });

  const [addPin] = useMutation(Mutation.ADD_PIN);
  const [updatePin] = useMutation(Mutation.UPDATE_PIN);

  const [addDrawingLayer] = useMutation(Mutation.ADD_DRAWING_LAYER);
  const [updateDrawingLayer] = useMutation(Mutation.UPDATE_DRAWING_LAYER);

  const gridStyle: React.CSSProperties = {
    width: "50%",
    textAlign: "center",
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
  };

  function createTextAreaContainer(point, mapRef) {
    var container = document.getElementById(`text-container-${point.id}`);
    if (!container) {
      container = document.createElement("div");
      container.style.position = "absolute";
      container.style.zIndex = "100";
      container.classList.add("text-container");
      container.id = `text-container-${point.id}`;

      mapRef.current.getCanvasContainer().appendChild(container);
    }
    return container;
  }

  function textAreaInput(textarea, mapRef, mapboxDrawRef, container, point) {
    textarea.addEventListener("input", function () {
      console.log("text inputing");
      console.log(point.id);
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
        point.id,
        "text",
        textarea.value
      );

      container.style.left = screenCoordinates.x;
      container.style.top =
        screenCoordinates.y - container.clientHeight / 2 + "px";
    });
  }

  function textAreaZoom(textarea, mapRef, container, point) {
    mapRef.current.on("zoom", function () {
      var zoom = mapRef.current.getZoom();
      var fontSize = 10 + (zoom - 10) * 2;

      textarea.style.fontSize = fontSize + "px";
      textarea.style.height = "auto";
      textarea.style.minHeight = parseInt(textarea.style.fontSize) * 2 + "px";
      textarea.style.maxHeight = "200px"; // Set the maximum height to 200 pixels

      // Adjust position of text area based on font size
      var screenCoordinates = mapRef.current.project(
        point.geometry.coordinates
      );
      container.style.left = screenCoordinates.x;
      container.style.top =
        screenCoordinates.y - textarea.scrollHeight / 2 + "px";

      // Update the textarea height based on its content
      textarea.style.height = textarea.scrollHeight + "px";
    });
  }

  function textAreaMove(textarea, mapRef, container, point) {
    mapRef.current.on("move", () => {
      var screenCoordinates = mapRef.current.project(
        point.geometry.coordinates
      );
      //console.log(screenCoordinates);
      container.style.left =
        screenCoordinates.x + textarea.clientHeight / 5 + "px";
      container.style.top =
        screenCoordinates.y - textarea.clientHeight / 2 + "px";
    });
  }

  function createTextArea(mapboxDrawRef, mapRef, point) {
    console.log("creating text");
    var container = createTextAreaContainer(point, mapRef);
    var textarea = document.createElement("textarea");
    textarea.cols = 1;
    textarea.style.lineHeight = textarea.style.height;
    textarea.style.width = "150px";
    var zoom = mapRef.current.getZoom();

    textarea.style.fontSize = 10 + (zoom - 10) * 1 + "px"; //

    textarea.style.height = "auto";
    textarea.style.resize = "none";
    textarea.style.overflow = "auto";
    textarea.placeholder = "Please enter your text for the marker added... ";
    textarea.style.boxSizing = "border-box";
    textarea.classList.add("custom_text_area");
    textarea.maxLength = 100;

    textarea.value = point.properties.text || "";

    textAreaInput(textarea, mapRef, mapboxDrawRef, container, point);

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

    var saveButton = document.createElement("button");
    saveButton.classList.add("custom_save_button");

    saveButton.textContent = "Save";
    saveButton.style.display = "none";
    saveButton.addEventListener("click", function () {
      console.log(textarea.value);
      updatePinTextData(textarea.value, point.id);

      saveButton.style.display = "none";
    });
    textarea.addEventListener("focus", function () {
      saveButton.style.display = "block";
    });

    textarea.addEventListener("blur", function (event) {
      if (
        event.relatedTarget &&
        event.relatedTarget.classList.contains("custom_save_button")
      ) {
        return;
      }
      saveButton.style.display = "none";
    });

    container.appendChild(saveButton);

    var screenCoordinates = mapRef.current.project(point.geometry.coordinates);
    container.style.top =
      screenCoordinates.y - textarea.offsetHeight / 2 + "px";
    container.style.left =
      screenCoordinates.x + textarea.clientHeight / 5 + "px";
    //textarea.focus();
    textAreaZoom(saveButton, mapRef, container, point);
    textAreaMove(saveButton, mapRef, container, point);
    textAreaZoom(textarea, mapRef, container, point);
    textAreaMove(textarea, mapRef, container, point);
  }

  useEffect(() => {
    if (!loading && data) {
      if (!mapContainer) {
        return;
      }

      mapRef.current = new maplibregl.Map({
        container: mapContainer.current,
        style:
          "https://api.maptiler.com/maps/basic-v2/style.json?key=HMeYX3yPwK7wfZQDqdeC",
        center: [long, lat],
        zoom: 9,
        minZoom: 8,
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
        styles: DrawStyles,
      });

      mapRef.current.addControl(mapboxDrawRef.current);

      mapRef.current.on("draw.create", function (e) {
        if (e.features[0].geometry.type === "Point") {
          addPinData(e.features[0])
            .then((pin_id) => {
              var features = mapboxDrawRef.current.getAll();
              var feature = features.features.find(function (f) {
                return f.id === e.features[0].id;
              });
              feature.id = pin_id;

              mapboxDrawRef.current.delete(e.features[0].id);

              // Add the updated feature to the map
              mapboxDrawRef.current.add(feature);
              e.features[0] = feature;
              createTextArea(mapboxDrawRef, mapRef, e.features[0]);
            })
            .catch((error) => {
              console.error(error);
            });
        } else {
          addDrawingLayerData(e.features[0])
            .then((drawingLayer_id) => {
              console.log(drawingLayer_id);
              console.log(mapboxDrawRef.current.getAll());
              var features = mapboxDrawRef.current.getAll();
              var feature = features.features.find(function (f) {
                return f.id === e.features[0].id;
              });
              feature.id = drawingLayer_id;

              mapboxDrawRef.current.delete(e.features[0].id);

              // Add the updated feature to the map
              mapboxDrawRef.current.add(feature);
              e.features[0] = feature;
              console.log(e.features[0]);
              updateDrawData(e.features[0]);
            })
            .catch((error) => {
              console.error(error);
            });
        }
      });

      mapRef.current.on("draw.update", function (e) {
        if (e.features[0].geometry.type === "Point") {
          updatePinLocData(e.features[0]);
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
              textAreaMove(textarea, mapRef, container, e.features[0]);
            }
            textAreaZoom(textarea, mapRef, container, e.features[0]);

            textAreaInput(
              textarea,
              mapRef,
              mapboxDrawRef,
              container,
              e.features[0]
            );
          }
        } else {
          console.log(e.features[0]);
          updateDrawData(e.features[0]);
        }
      });
    }
  }, [loading, data, long, lat]);

  useEffect(() => {
    if (!mapContainer) {
      return;
    }

    if (!loading && data && !layersLoading && layersData) {
      // reformat the data fetched
      const pinData = data.pinMany.map((item) => ({
        id: item._id,
        // Temporary placeholder
        type: "Feature",
        properties: {
          text: item.pinText,
        },
        geometry: {
          coordinates: item.pinCoordinates.coordinates,
          type: item.pinCoordinates.type,
        },
      }));

      const drawData = layersData.drawingLayerMany.map((item) => ({
        id: item._id,
        type: "Feature",
        properties: {
          type: "Feature",
        },
        geometry: {
          coordinates: item.featureGeoJSON.geometry.coordinates,
          type: item.featureGeoJSON.geometry.type,
          id: item._id,
        },
      }));

      mapRef.current.on("load", function () {
        console.log("loading");
        pinData.forEach((pin) => {
          mapboxDrawRef.current.add(pin);
          createTextArea(mapboxDrawRef, mapRef, pin);
        });
        drawData.forEach((draw) => {
          mapboxDrawRef.current.add(draw);
        });
      });
      // Add the point feature to the map using the "draw_point" mode
    }
  }, [loading, data, layersLoading, layersData]);

  useEffect(() => {
    if (!loading && data) {
      if (!mapContainer) {
        return;
      }
    }
  }, [loading, data]);

  const showModal = () => {
    setIsModalOpen(true);
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

  const handleDownloadButton = () => {
    const maplibreMap = mapRef.current;

    const renderMap = new Map({
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

    renderMap.on("load", function () {
      html2canvas(renderMap.getContainer()).then(function (canvas) {
        const timestamp = new Date();
        const canvasDataURL = canvas.toDataURL();
        const link = document.createElement("a");
        link.href = canvasDataURL;
        link.download = "map-" + timestamp.getTime() + ".png";
        link.click();
        link.remove();
      });
      renderMap.remove();
    });
  };

  const handleExportButtonToJSON = () => {
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
  };

  const addDrawingLayerData = (newDrawingLayer) => {
    const drawingLayerData = {
      disaster: id,
      featureType: newDrawingLayer.geometry.type,
      featureGeoJSON: newDrawingLayer,
      createdBy: "63d10ad4e30540f8a78a183f",
    };
    console.log("afafaf: ", drawingLayerData);
    return addDrawingLayer({ variables: { record: drawingLayerData } })
      .catch((error) => alert(error.message))
      .then((result) => {
        return result.data.drawingLayerCreateOne.recordId;
      });
  };

  const addPinData = (newPin) => {
    const pinData = {
      disaster: id,
      pinText: "",
      pinCoordinates: {
        type: newPin.geometry.type,
        coordinates: newPin.geometry.coordinates,
      },
      createdBy: "63d10ad4e30540f8a78a183f",
    };

    return addPin({ variables: { record: pinData } })
      .catch((error) => alert(error.message))
      .then((result) => {
        return result.data.pinCreateOne.recordId;
      });
  };

  const updatePinLocData = (updatedPinLoc) => {
    const pinUpdatedLoc = {
      pinCoordinates: {
        coordinates: updatedPinLoc.geometry.coordinates,
        type: updatedPinLoc.geometry.type,
      },
    };
    updatePin({
      variables: { id: updatedPinLoc.id, record: pinUpdatedLoc },
    }).catch((error) => alert(error.message));
  };

  const updatePinTextData = (updatedPinText, pointID) => {
    const pinUpdatedText = {
      pinText: updatedPinText,
    };
    updatePin({
      variables: { id: pointID, record: pinUpdatedText },
    }).catch((error) => alert(error.message));
  };

  const updateDrawData = (updatedDrawData) => {
    const drawUpdated = {
      featureGeoJSON: {
        id: updatedDrawData.id,
        type: "Feature",
        geometry: {
          coordinates: updatedDrawData.geometry.coordinates,
          type: updatedDrawData.geometry.type,
        },
      },
    };
    updateDrawingLayer({
      variables: { id: updatedDrawData.id, record: drawUpdated },
    }).catch((error) => alert(error.message));
  };

  return (
    <div className="map-wrap" style={{ position: "relative" }}>
      <div
        ref={mapContainer}
        style={{
          width: "30vw",
          height: "calc(100vh - 64px)",
          position: "absolute",
          top: 0,
          right: 0,
        }}
      >
        <div style={{ position: "absolute", zIndex: 101 }}>
          <Collapse
            expandIconPosition="end"
            style={{ backgroundColor: "white", margin: 20 }}
          >
            <Panel
              header="Layer Information"
              key="2"
              style={{ width: 300, fontSize: 18 }}
            >
              {currentLayers !== [] ? (
                currentLayers.map((layer, index) => (
                  <h4 key={index}>{layer}</h4>
                ))
              ) : (
                <></>
              )}
            </Panel>
          </Collapse>
        </div>
      </div>

      <div
        ref={mapContainer}
        style={{
          width: "100vw",
          height: "calc(100vh - 64px)",
        }}
      >
        <div style={{ position: "absolute", zIndex: 101 }}>
          <Collapse
            expandIconPosition="end"
            style={{ backgroundColor: "white", margin: 20 }}
          >
            <Panel
              header={countryData.location}
              key="1"
              style={{ width: 300, fontSize: 18 }}
            >
              <Card>
                <Card.Grid hoverable={false} style={gridStyle}>
                  <div
                    style={{
                      flexDirection: "row",
                      flex: 1,
                      justifyContent: "space-around",
                    }}
                  >
                    <GiReceiveMoney style={{ color: "red", fontSize: "4em" }} />
                    <Meta
                      title={new Intl.NumberFormat("en-US").format(
                        parseInt(countryData.amount_requested)
                      )}
                      description="Amount Requested (CHF)"
                    />
                  </div>
                </Card.Grid>
                <Card.Grid hoverable={false} style={gridStyle}>
                  <div
                    style={{
                      flexDirection: "row",
                      flex: 1,
                      justifyConxtent: "space-around",
                    }}
                  >
                    <GiPayMoney style={{ color: "red", fontSize: "4em" }} />
                    <Meta
                      title={new Intl.NumberFormat("en-US").format(
                        parseInt(countryData.amount_funded)
                      )}
                      description="Amount Funded (CHF)"
                    />
                  </div>
                </Card.Grid>
              </Card>
              <Card
                title="Emergency Overview"
                style={{
                  textAlign: "center",
                  width: "100%",
                }}
              >
                Information...
              </Card>
            </Panel>
          </Collapse>
        </div>
      </div>

      <TrashButton mapboxDrawRef={mapboxDrawRef} />
      <LayerModal
        mapRef={mapRef}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        currentLayers={currentLayers}
        setCurrentLayers={setCurrentLayers}
      />
      {mapRef ? <StyleButton mapRef={mapRef} /> : <></>}
      <ToolBar
        handlePinButton={handlePinButton}
        showModal={showModal}
        handlePaintButton={handlePaintButton}
        handleLineButton={handleLineButton}
        handlePolygonButton={handlePolygonButton}
        handleDownloadButton={handleDownloadButton}
        handleExportButton={handleExportButtonToJSON}
      />
    </div>
  );
};

export default CountryMap;
