import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import maplibregl, { Map } from "!maplibre-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import PaintMode from "mapbox-gl-draw-paint-mode";
import DrawPointWithText from "mapbox-gl-draw-point-with-text-mode";
import jsPDF from "jspdf";
import { Card, Collapse } from "antd";
import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import { useQuery } from "@apollo/client";
import * as Query from "../API/AllQueries";
import StyleButton from "./StyleButton";
import LayerMoral from "./LayerMoral";
import TrashButton from "./TrashButton";
import ToolBar from "./ToolBar";
import "./CustomMarker.css";
import "./MapComponent.css";

const { Meta } = Card;

const { Panel } = Collapse;

const CountryMap = ({ searchCountry, disasters }) => {
  const { id, long, lat } = useParams();
  const { state } = useLocation();
  const { countryData } = state || {};

  // new from 36 - 43
  const [mapStyle, setMapStyle] = useState(
    "https://api.maptiler.com/maps/basic-v2/style.json?key=HMeYX3yPwK7wfZQDqdeC"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  // console.log(data);

  const gridStyle: React.CSSProperties = {
    width: "50%",
    textAlign: "center",
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
  };

  useEffect(() => {
    if (!loading && data) {
      if (!mapContainer) {
        return;
      }

      mapRef.current = new maplibregl.Map({
        container: mapContainer.current,
        style: mapStyle,
        center: [long, lat],
        zoom: 9,
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
        //styles: DrawStyles,
      });

      mapRef.current.addControl(mapboxDrawRef.current);

      mapRef.current.on("draw.create", function (e) {
        console.log("creating");
        console.log(e.features);

        if (e.features[0].geometry.type === "Point") {
          var pointId = e.features[0].id;
          var container = document.getElementById(`text-container-${pointId}`);
          if (!container) {
            container = document.createElement("div");
            container.style.position = "absolute";
            container.style.zIndex = "100";
            container.classList.add("text-container");
            container.id = `text-container-${pointId}`;
            //console.log(container.id);

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
            console.log("Create Input");

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
            //console.log(screenCoordinates);
            container.style.left =
              screenCoordinates.x + textarea.clientHeight / 5 + "px";
            container.style.top =
              screenCoordinates.y - textarea.clientHeight / 2 + "px";
          });
        }
      });

      mapRef.current.on("draw.update", function (e) {
        console.log("updating");
        if (e.features[0].geometry.type === "Point") {
          //console.log("inside");
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
                //console.log(screenCoordinates);
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
              console.log("Update Input");
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
    }
  }, [loading, data, long, lat, mapStyle]);

  useEffect(() => {
    if (!loading && data) {
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

      console.log("PINDATA", pinData);

      mapRef.current.on("load", function () {
        console.log("loading");
        pinData.forEach((pin) => {
          // Add the point feature to the map using the "draw_point" mode
          var point = pin;
          mapboxDrawRef.current.add(point);
          var pointId = point.id;
          var container = document.getElementById(`text-container-${pointId}`);
          if (!container) {
            container = document.createElement("div");
            container.style.position = "absolute";
            container.style.zIndex = "100";
            container.classList.add("text-container"); // add a CSS class
            container.id = `text-container-${pointId}`;
            // console.log(container.id);

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
              console.log("Load Input");

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

            mapRef.current.on("zoom", () => {
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
              //console.log(screenCoordinates);
              container.style.left =
                screenCoordinates.x + textarea.clientHeight / 5 + "px";
              container.style.top =
                screenCoordinates.y - textarea.clientHeight / 2 + "px";
            });
          }
        });
      });
      // Add the point feature to the map using the "draw_point" mode
    }
  }, [loading, data]);

  useEffect(() => {
    if (!loading && data) {
      if (!mapContainer) {
        return;
      }
      mapRef.current.setStyle(mapStyle);
    }
  }, [mapStyle, loading, data]);

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

  return (
    <div className="map-wrap" style={{ position: "relative" }}>
      <div
        ref={mapContainer}
        style={{
          width: "100vw",
          height: "calc(100vh - 64px)",
        }}
      >
        <div style={{ position: "absolute", zIndex: 1 }}>
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
      <LayerMoral
        mapRef={mapRef}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <StyleButton setMapStyle={setMapStyle} />
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
