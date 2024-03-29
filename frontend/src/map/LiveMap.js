import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import maplibregl, { Map } from "!maplibre-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import PaintMode from "mapbox-gl-draw-paint-mode";
import DrawPointWithText from "mapbox-gl-draw-point-with-text-mode";
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
  const [livePin, setLivePin] = useState({});
  const [livePinRemove, setLivePinRemove] = useState({});
  const [liveDraw, setLiveDraw] = useState({});
  const [liveDrawRemove, setLiveDrawRemove] = useState({});

  const subscriptionVariables = {
    variables: {
      disasterId: id,
    },
  };

  const showLayerModal = () => {
    setIsLayerModalOpen(true);
  };

  const showLinkModal = () => {
    setIsLinkModalOpen(true);
  };

  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const mapboxDrawRef = useRef(null);

  const { loading: countryDisasterLoading, data: countryDisaster } = useQuery(
    Query.GET_DISASTERS_BY_ID,
    {
      variables: {
        id: id,
      },
    }
  );
  const { loading: pinsLoading, data: pinsData } = useQuery(Query.GET_PINS, {
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
  const { data: pinCreateSub } = useSubscription(
    Subscription.PIN_ADDED_SUBSCRIPTION,
    subscriptionVariables
  );
  const { data: pinUpdateSub } = useSubscription(
    Subscription.PIN_UPDATED_SUBSCRIPTION,
    subscriptionVariables
  );
  const { data: pinRemoveSub } = useSubscription(
    Subscription.PIN_REMOVED_SUBSCRIPTION,
    subscriptionVariables
  );
  const { data: drawUpdateSub } = useSubscription(
    Subscription.DRAWING_LAYER_UPDATED_SUBSCRIPTION,
    subscriptionVariables
  );
  const { data: drawRemoveSub } = useSubscription(
    Subscription.DRAWING_LAYER_REMOVED_SUBSCRIPTION,
    subscriptionVariables
  );

  // Fetch the selected country data
  useEffect(() => {
    if (!countryDisasterLoading && countryDisaster) {
      setCountryData(countryDisaster.disasterById);
    }
  }, [countryDisasterLoading, countryDisaster]);

  // Fetch the map data from db and update the state
  useEffect(() => {
    if (!pinsLoading && pinsData && !layersLoading && layersData) {
      // reformat the data fetched
      const pinData = pinsData.pinMany.map((item) => ({
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
      setPins(pinData);

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
      setDrawLayers(drawData);
    }
  }, [pinsLoading, pinsData, layersLoading, layersData]);

  // Create the map
  useEffect(() => {
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
  }, [long, lat]);

  // Loading the components
  useEffect(() => {
    mapRef.current.on("load", function () {
      pins.forEach((pin) => {
        if (!createdPins.includes(pin.id)) {
          mapboxDrawRef.current.add(pin);
          createTextArea(mapboxDrawRef, mapRef, pin);
          setCreatedPins([...createdPins, pin.id]);
          // createdPins.push(pin.id);
        }
      });
      drawLayers.forEach((draw) => {
        mapboxDrawRef.current.add(draw);
      });
    });
  }, [pins, drawLayers]);

  // Create and update components
  useEffect(() => {
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
      console.log("updating");
      if (e.features[0]) {
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
      }
    });
  }, []);

  // Real time create, update and remove pins
  useEffect(() => {
    if (pinCreateSub) {
      const newPinData = {
        id: pinCreateSub.pinAdded._id,
        type: "Feature",
        properties: {
          text: pinCreateSub.pinAdded.pinText,
        },
        geometry: {
          coordinates: pinCreateSub.pinAdded.pinCoordinates.coordinates,
          type: pinCreateSub.pinAdded.pinCoordinates.type,
          id: pinCreateSub.pinAdded._id,
        },
      };
      setLivePin(newPinData);
    }
  }, [pinCreateSub]);
  useEffect(() => {
    if (pinUpdateSub) {
      console.log("updating pin");
      const newPinData = {
        id: pinUpdateSub.pinUpdated._id,
        type: "Feature",
        properties: {
          text: pinUpdateSub.pinUpdated.pinText,
        },
        geometry: {
          coordinates: pinUpdateSub.pinUpdated.pinCoordinates.coordinates,
          type: pinUpdateSub.pinUpdated.pinCoordinates.type,
          id: pinUpdateSub.pinUpdated._id,
        },
      };
      setLivePin(newPinData);
    }
  }, [pinUpdateSub]);
  useEffect(() => {
    if (livePin.id) {
      const changedObject = mapboxDrawRef.current
        .getAll()
        .features.find((obj) => obj.id === livePin.id);
      if (changedObject) {
        mapboxDrawRef.current.delete(changedObject.id);
        mapboxDrawRef.current.add(livePin);
        var pointId = livePin.id;
        var container = document.getElementById(`text-container-${pointId}`);
        if (container) {
          var textarea = container.querySelector("textarea");
          if (textarea) {
            textarea.value = livePin.properties.text;
            var screenCoordinates = mapRef.current.project(
              livePin.geometry.coordinates
            );
            container.style.top =
              screenCoordinates.y - textarea.clientHeight / 2 + "px";
            container.style.left =
              screenCoordinates.x + textarea.clientHeight / 4 + "px";
            textAreaMove(textarea, mapRef, container, livePin);
          }
          textAreaZoom(textarea, mapRef, container, livePin);
          textAreaInput(textarea, mapRef, mapboxDrawRef, container, livePin);
        }
      } else {
        if (!createdPins.includes(livePin.id)) {
          mapboxDrawRef.current.add(livePin);
          console.log("creating text area");
          createTextArea(mapboxDrawRef, mapRef, livePin);
          setCreatedPins([...createdPins, livePin.id]);
          // createdPins.push(livePin.id);
        }
      }
    }
  }, [livePin]);
  useEffect(() => {
    if (pinRemoveSub) {
      const removedPinData = {
        id: pinRemoveSub.pinRemoved._id,
      };
      setLivePinRemove(removedPinData);
    }
  }, [pinRemoveSub]);
  useEffect(() => {
    if (livePinRemove.id) {
      const changedObject = mapboxDrawRef.current
        .getAll()
        .features.find((obj) => obj.id === livePinRemove.id);
      if (changedObject) {
        mapboxDrawRef.current.delete(changedObject.id);
        let container = document.getElementById(
          `text-container-${changedObject.id}`
        );
        if (container) {
          setTimeout(() => {
            container.remove();
          }, 0);
        } else {
          console.log(
            `Could not find container with ID 'text-container-${changedObject.id}'`
          );
        }
      }
    }
  }, [livePinRemove]);

  // Real time create, update and remove draws
  useEffect(() => {
    if (drawUpdateSub) {
      const newDrawLayerData = {
        id: drawUpdateSub.drawingLayerUpdated._id,
        type: "Feature",
        properties: {
          type: "Feature",
        },
        geometry: {
          coordinates:
            drawUpdateSub.drawingLayerUpdated.featureGeoJSON.geometry
              .coordinates,
          type: drawUpdateSub.drawingLayerUpdated.featureGeoJSON.geometry.type,
          id: drawUpdateSub.drawingLayerUpdated._id,
        },
      };
      setLiveDraw(newDrawLayerData);
      const newDrawLayers = [...drawLayers, newDrawLayerData];
      setDrawLayers(newDrawLayers);
    }
  }, [drawUpdateSub]);
  useEffect(() => {
    if (liveDraw.id) {
      const changedObject = mapboxDrawRef.current
        .getAll()
        .features.find((obj) => obj.id === liveDraw.id);
      if (changedObject) {
        mapboxDrawRef.current.delete(changedObject.id);
        mapboxDrawRef.current.add(liveDraw);
      } else {
        mapboxDrawRef.current.add(liveDraw);
      }
    }
  }, [liveDraw]);
  useEffect(() => {
    if (drawRemoveSub) {
      const removedDrawLayerData = {
        id: drawRemoveSub.drawingLayerRemoved._id,
      };
      setLiveDrawRemove(removedDrawLayerData);
    }
  }, [drawRemoveSub]);
  useEffect(() => {
    if (liveDrawRemove.id) {
      const changedObject = mapboxDrawRef.current
        .getAll()
        .features.find((obj) => obj.id === liveDrawRemove.id);
      if (changedObject) {
        mapboxDrawRef.current.delete(changedObject.id);
      }
    }
  }, [liveDrawRemove]);

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
