import React, { useState } from "react";
import maplibregl from "maplibre-gl";
import "./Map.css";
import Map, { NavigationControl, Marker } from "react-map-gl";
import ToolBar from "./ToolBar"

const MapComponent = () => {
  const [pins, setPins] = useState([]);
  const [pinVisible, setPinVisible] = useState(false);

  const handleMapClick = (event) => {
    if (pinVisible) {
      setPins([...pins, [event.lngLat.lng, event.lngLat.lat]]);
      setPinVisible(!pinVisible);
    }
  };

  const handlePinDragEnd = (event, index) => {
    const newPins = [...pins];
    newPins[index] = [event.lngLat.lng, event.lngLat.lat];
    setPins(newPins);
  };
  const handlePinButton = () => {
    setPinVisible(!pinVisible);
  };

  return (
    <div className="map-wrap">
      <Map 
        // className="map"
        mapLib={maplibregl}
        initialViewState={{
          longitude: 16.62662018,
          latitude: 49.2125578,
          zoom: 14,
        }}
        onClick={handleMapClick}
        style={{ width: "100%", height: " calc(100vh - 94px)" }}
        mapStyle="https://api.maptiler.com/maps/basic-v2/style.json?key=HMeYX3yPwK7wfZQDqdeC"
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
            <div>Your Pin icon here</div>
          </Marker>
        ))}
      </Map>
      <ToolBar handlePinButton={handlePinButton} />
    </div>
  );
};

export default MapComponent;
