import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "./Map.css";
import Map, { NavigationControl, Marker } from "react-map-gl";
import ToolBar from "./ToolBar";
import { IoLocationSharp } from "react-icons/io5";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import PaintMode from "mapbox-gl-draw-paint-mode";
import "maplibre-gl/dist/maplibre-gl.css";

const MapComponent = () => {
  const ADD_PIN = 1;
  const ADD_POPUP = 2;
  const DO_NOTHING = 0;

  const [pins, setPins] = useState([]);
  const [status, setStatus] = useState(DO_NOTHING);
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

    if (status === ADD_POPUP) {
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
  };

  const handlePinDragEnd = (event, index) => {
    const newPins = [...pins];
    newPins[index] = [event.lngLat.lng, event.lngLat.lat];
    setPins(newPins);
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
        style={{ width: "100%", height: " calc(100vh - 94px)" }}
        mapStyle={mapType}
      >
        <NavigationControl position="top-left" />
        {pins.map((pin, index) => (
          <Marker
            key={index}
            draggable={true}
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
            key={index}
            draggable={true}
            onDragEnd={(e) => handlePinDragEnd(e, index)}
            longitude={popu[0]}
            latitude={popu[1]}
          >
            <div>
              <button>{popu[2]}</button>
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
