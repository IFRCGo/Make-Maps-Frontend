import React, { useState } from "react";
import maplibregl from "maplibre-gl";
import "./Map.css";
import Map, { NavigationControl, Marker } from "react-map-gl";
import ToolBar from "./ToolBar"

const MapComponent = () => {
  const ADD_PIN = 1;
  const ADD_POPUP = 2;
  const DO_NOTHING = 0;

  const [pins, setPins] = useState([]);
  const [status, setStatus] = useState(DO_NOTHING);
  const [popupList, setPopupList] = useState([]);

  const handleMapClick = (event) => {
    if (status === ADD_PIN) {
      setPins([...pins, [event.lngLat.lng, event.lngLat.lat]]);
      setStatus(DO_NOTHING);
    }

    if (status === ADD_POPUP) {
      setPopupList([...popupList, [event.lngLat.lng, event.lngLat.lat, prompt("Your input", "My Text Data")]]);
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
        {popupList.map((popu, index) => (
          <Marker
            key={index}
            draggable={true}
            onDragEnd={(e) => handlePinDragEnd(e, index)}
            longitude={popu[0]}
            latitude={popu[1]}
          >
            <div><button>{popu[2]}</button></div>
          </Marker>
        ))}
      </Map>
      <ToolBar 
        handlePinButton={handlePinButton} 
        handleTextButton={handleTextButton}/>
    </div>
  );
};

export default MapComponent;