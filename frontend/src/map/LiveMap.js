import React, { useEffect, useState, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import maplibregl, { Map } from "!maplibre-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import PaintMode from "mapbox-gl-draw-paint-mode";
import DrawPointWithText from "mapbox-gl-draw-point-with-text-mode";
import jsPDF from "jspdf";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import * as Query from "../API/AllQueries";
import * as Mutation from "../API/AllMutations";
import * as Subscription from "../API/AllSubscriptions";
import StyleButton from "./StyleButton";
import LayerModal from "./LayerModal";
import TrashButton from "./TrashButton";
import ToolBar from "./ToolBar";
import "./CustomMarker.css";
import "./CountryMap.css";
import DrawStyles from "./DrawStyles";
import html2canvas from "html2canvas";
import DisasterInfoCard from "./DisasterInfoCard";
import ChosenLayerCard from "./ChosenLayerCard";
import LinkModal from "./LinkModal";

const LiveMap = ({ disasters }) => {
  const { id, long, lat } = useParams();
  const [countryData, setCountryData] = useState({});
  const [isLayerModalOpen, setIsLayerModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [currentLayers, setCurrentLayers] = useState([]);
  const [createdPins, setCreatedPins] = useState([]);
  const [pins, setPins] = useState([]);
  const [drawLayers, setDrawLayers] = useState([]);
  const [livePins, setLivePins] = useState([]);

  const showLayerModal = () => {
    setIsLayerModalOpen(true);
  };

  const showLinkModal = () => {
    setIsLinkModalOpen(true);
  };

  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const mapboxDrawRef = useRef(null);

  const { data: countryDisaster } = useQuery(Query.GET_DISASTERS_BY_ID, {
    variables: {
      id: id,
    },
  });

  useMemo(() => {
    if (countryDisaster) {
      setCountryData(countryDisaster.disasterById);
    }
  }, [countryDisaster]);

  const { loading, data } = useQuery(Query.GET_PINS, {
    variables: {
      filter: {
        disaster: id,
      },
    },
  });

  const { loading: layersLoading, data: layersData } = useQuery(
    Query.GET_DRAWING_LAYERS,
    {
      variables: {
        filter: {
          disaster: id,
        },
      },
    }
  );

  const [addPin] = useMutation(Mutation.ADD_PIN);
  const [updatePin] = useMutation(Mutation.UPDATE_PIN);

  const [addDrawingLayer] = useMutation(Mutation.ADD_DRAWING_LAYER);
  const [updateDrawingLayer] = useMutation(Mutation.UPDATE_DRAWING_LAYER);

  const dataTest = useSubscription(
    Subscription.DRAWING_LAYER_ADDED_SUBSCRIPTION,
    {
      variables: {
        disasterId: id,
      },
    }
  );

  console.log(dataTest);

  // if (drawAddSub) {
  //   console.log(drawAddSub);
  // }

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
      container.style.left =
        screenCoordinates.x + textarea.clientHeight / 5 + "px";
      container.style.top =
        screenCoordinates.y - textarea.clientHeight / 2 + "px";
    });
  }

  function createTextArea(mapboxDrawRef, mapRef, point) {
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
              var features = mapboxDrawRef.current.getAll();
              var feature = features.features.find(function (f) {
                return f.id === e.features[0].id;
              });
              feature.id = drawingLayer_id;
              mapboxDrawRef.current.delete(e.features[0].id);
              // Add the updated feature to the map
              mapboxDrawRef.current.add(feature);
              e.features[0] = feature;
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
          updateDrawData(e.features[0]);
        }
      });
    }
  }, [data, long, lat]);

  useEffect(() => {
    if (!mapContainer) {
      return;
    }

    if (data && layersData) {
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
        pinData.forEach((pin) => {
          if (!createdPins.includes(pin.id)) {
            mapboxDrawRef.current.add(pin);
            createTextArea(mapboxDrawRef, mapRef, pin);
            createdPins.push(pin.id);
          }
        });
        drawData.forEach((draw) => {
          mapboxDrawRef.current.add(draw);
        });
      });
    }
  }, [data, layersData]);

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
        const link = document.createElement("a");

        // create a new canvas element
        const titleCanvas = document.createElement("canvas");
        titleCanvas.width = canvas.width + 200; // add 200 pixels for the legend
        titleCanvas.height = canvas.height + 100; // add 100 pixels for the title and legend
        const titleCtx = titleCanvas.getContext("2d");

        titleCtx.fillStyle = "#f6343f";
        titleCtx.fillRect(0, 0, titleCanvas.width, titleCanvas.height);

        titleCtx.drawImage(canvas, 0, 100);

        // draw title text on top of red background
        titleCtx.fillStyle = "white";
        titleCtx.font = "bold 50px Poppins";
        titleCtx.textAlign = "center";
        titleCtx.fillText(countryData.location, titleCanvas.width / 2, 50);

        titleCtx.fillStyle = "white";
        titleCtx.font = "24px Poppins";
        titleCtx.textAlign = "left";
        titleCtx.fillStyle = "black";
        titleCtx.fillText("Layers:", canvas.width + 10, 150);

        if (currentLayers !== []) {
          var y = 160;
          currentLayers.forEach((layer) => {
            titleCtx.fillRect(canvas.width + 10, y, 20, 20); // draw legend box
            titleCtx.fillText(layer, canvas.width + 50, y + 15);
            y += 30;
          });
        }

        link.href = titleCanvas.toDataURL();
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
    return addDrawingLayer({ variables: { record: drawingLayerData } })
      .catch((error) => alert(error.message))
      .then((result) => {
        return result.data.drawingLayerCreateOneCustom.record._id;
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
        return result.data.pinCreateOneCustom.record._id;
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
        style={{ width: "100vw", height: "calc(100vh - 64px)" }}
      >
        <div style={{ position: "absolute", zIndex: 101 }}>
          <DisasterInfoCard countryData={countryData} />
        </div>
        <div style={{ position: "absolute", zIndex: 101, right: 80 }}>
          <ChosenLayerCard currentLayers={currentLayers} />
        </div>
      </div>
      <TrashButton mapboxDrawRef={mapboxDrawRef} />
      <LayerModal
        mapRef={mapRef}
        isLayerModalOpen={isLayerModalOpen}
        setIsLayerModalOpen={setIsLayerModalOpen}
        currentLayers={currentLayers}
        setCurrentLayers={setCurrentLayers}
      />
      <LinkModal
        isLinkModalOpen={isLinkModalOpen}
        setIsLinkModalOpen={setIsLinkModalOpen}
      />
      {mapRef ? (
        <StyleButton mapRef={mapRef} currentLayers={currentLayers} />
      ) : (
        <></>
      )}
      <ToolBar
        handlePinButton={handlePinButton}
        showLayerModal={showLayerModal}
        showLinkModal={showLinkModal}
        handlePaintButton={handlePaintButton}
        handleLineButton={handleLineButton}
        handlePolygonButton={handlePolygonButton}
        handleDownloadButton={handleDownloadButton}
        handleExportButton={handleExportButtonToJSON}
      />
    </div>
  );
};

export default LiveMap;
