import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "./MapComponent.css";
import { Tag } from "antd";
import Map, { NavigationControl, Marker } from "react-map-gl";
import ToolBar from "./ToolBar";
import { IoLocationSharp } from "react-icons/io5";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import PaintMode from "mapbox-gl-draw-paint-mode";
import "maplibre-gl/dist/maplibre-gl.css";
import ToolDetail from "./ToolDetail";

const MapComponent = () => {
  const ADD_PIN = 1;
  const ADD_POPUP = 2;
  const CHOSEN = 3;
  const DO_NOTHING = 0;

  const [pins, setPins] = useState([]);
  const [status, setStatus] = useState(DO_NOTHING);
  const [cardOpen, setCardOpen] = useState(false);
  const [drag, setDrag] = useState(false);
  const [popupList, setPopupList] = useState([]);
  const [mapType, setMapType] = useState(
    "https://api.maptiler.com/maps/basic-v2/style.json?key=HMeYX3yPwK7wfZQDqdeC"
  );

  const mapRef = useRef(null);
  const mapboxDrawRef = useRef(null);

  const handleMapClick = (event) => {
    if (status === ADD_PIN) {
      setPins([...pins, [event.lngLat.lng, event.lngLat.lat]]);
      setStatus(DO_NOTHING);
    }
    else if (status === ADD_POPUP) {
      setPopupList([
        ...popupList,
        [
          event.lngLat.lng,
          event.lngLat.lat,
          prompt("Your input", "My Text Data"),
        ],
      ]);
      setStatus(DO_NOTHING);
    }
    else if (status === CHOSEN) {
      setCardOpen(true)
      setDrag(true)
      setStatus(DO_NOTHING)
    }
    else {
      setCardOpen(false)
      setDrag(false)
    }
  };

  const handlePinDragEnd = (event, index) => {
    const newPins = [...pins];
    newPins[index] = [event.lngLat.lng, event.lngLat.lat];
    setPins(newPins);
  };
  const handlePopupDragEnd = (event, index) => {
    const newPopupList = [...popupList];
    newPopupList[index] = [event.lngLat.lng, event.lngLat.lat, newPopupList[index][2]];
    setPopupList(newPopupList);
  };

  const handlePinButton = () => {
    setStatus(ADD_PIN);
  };
  const handleTextButton = () => {
    setStatus(ADD_POPUP);
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

  const onMapLoad = React.useCallback(() => {
    console.log(mapRef.current);
    if (!mapRef.current) {
      return;
    }

    mapboxDrawRef.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: false,
        trash: false,
      },
      modes: {
        ...MapboxDraw.modes,
        draw_paint_mode: PaintMode,
      },
    });

    mapRef.current.addControl(mapboxDrawRef.current);
    // do something
  }, []);

  return (
    <div className="map-wrap">
      <Map
        mapLib={maplibregl}
        onLoad={onMapLoad}
        ref={mapRef}
        initialViewState={{
          longitude: 16.62662018,
          latitude: 49.2125578,
          zoom: 0,
        }}
        onClick={handleMapClick}
        style={{ width: "100%", height: " calc(100vh - 64px)" }}
        mapStyle={mapType}
      >
        <NavigationControl position="top-left" />
        <ToolDetail cardOpen={cardOpen}/>
        {pins.map((pin, index) => (
          <Marker
            style={{ cursor: "pointer" }}
            key={index}
            draggable={drag}
            onClick={() => {
              setStatus(CHOSEN)
            }}
            onDragEnd={(e) => handlePinDragEnd(e, index)}
            longitude={pin[0]}
            latitude={pin[1]}
          >
            <div>
              <IoLocationSharp style={{ color: "red", fontSize: "2em" }} />
            </div>
          </Marker>
        ))}
        {popupList.map((popu, index) => (
          <Marker
            style={{ cursor: "pointer" }}
            key={index}
            draggable={drag}
            onClick={() => {
              setStatus(CHOSEN)
            }}
            onDragEnd={(e) => handlePopupDragEnd(e, index)}
            longitude={popu[0]}
            latitude={popu[1]}
          >
            <div>
              <Tag color="magenta">{popu[2]}</Tag>
            </div>
          </Marker>
        ))}
      </Map>
      <ToolBar
        handlePinButton={handlePinButton}
        handleTextButton={handleTextButton}
        setMapType={setMapType}
        handlePaintButton={handlePaintButton}
        handleLineButton={handleLineButton}
        handlePolygonButton={handlePolygonButton}
      />
    </div>
  );
};

export default MapComponent;
