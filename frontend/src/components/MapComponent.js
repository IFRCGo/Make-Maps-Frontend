import React, { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "./Map.css";
import Map, { NavigationControl, Marker, Popup } from "react-map-gl";

const MapComponent = () => {
  const MARKER = 0; //usually you can have a seperate file to store this kind of const, but in our cases the number of const is small so i think we don't need do that.
  const POPUP = 1;

  const [pins, setPins] = useState([]);
  const [pinVisible, setPinVisible] = useState(false);

  const [popupList, setPopupList] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupId, setPopupId] = useState(0);

  const handleMapClick = (event, type) => {
    switch (type) {
      case MARKER:
        if (pinVisible) {
          setPins([...pins, [event.lngLat.lng, event.lngLat.lat]]);
          setPinVisible(!pinVisible);
        }
        break;

      case POPUP:
        if (popupVisible) {
          setPopupList([...popupList, [popupId, event.lngLat.lng,  event.lngLat.lat, prompt("xxx", "xxxx")]]);
          setPopupId(popupId + 1);
          setPopupVisible(!popupVisible);
        }

    }

  };

  const popuRemove = (popu) => {
    const newPopupList = popupList.filter((item) => item[0] !== popu[0]);
    //popu.remove(); todo
    setPopupList(newPopupList); 
  }
  
  const handlePinDragEnd = (event, index) => {
    const newPins = [...pins];
    newPins[index] = [event.lngLat.lng, event.lngLat.lat];
    setPins(newPins);
  };

  const handleButton = (event, type) => {
    switch (type) {
      case MARKER:
        setPinVisible(!pinVisible);
        setPopupVisible(false);
        break;

      case POPUP:
        setPopupVisible(!popupVisible);
        setPinVisible(false);
    }

  };

  const getCurrType = () => {
    if(pinVisible) {
      return MARKER;
    }

    if(popupVisible) {
      return POPUP;
    }
  }

  return (
    <div className="map-wrap">
      <button onClick={(e) => handleButton(e, MARKER)}>Marker</button>
      <button onClick={(e) => handleButton(e, POPUP)}>Popup</button>
      <Map
        mapLib={maplibregl}
        initialViewState={{
          longitude: 16.62662018,
          latitude: 49.2125578,
          zoom: 14,
        }}
        onClick={(e) => handleMapClick(e, getCurrType())} //changed: change the style, so i can pass more parameter.
        style={{ width: "100%", height: " calc(100vh - 77px)" }}
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
                <Popup 
                  closeButton={true}
                  closeOnClick={false}
                  key={index}
                  onClose={() => popuRemove(popu)}
                  longitude={popu[1]} 
                  latitude={popu[2]}
                >
                  {popu[3]}
                </Popup>
        ))}
      </Map>
    </div>
  );
};

export default MapComponent;
