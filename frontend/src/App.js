import React from "react";
import { Route, Routes } from 'react-router-dom';
import "maplibre-gl/dist/maplibre-gl.css";
import MapComponent from "./map/MapComponent";
import Layout from "./components/Layout";
import Home from "./home/Home";
import CountryMap from "./map/CountryMap";

function App() {
  const locations = [
    {
      id: 1,
      country: "venezuela",
      latitude: 6.4141070000000004,
      longitude: 66.5789265,
      zoom: 2,
      // Disasterlocation: { x: 6.4141070000000004, y: 66.5789265 },
    },
  ];

  return (
    <Routes>
      <Route path="/" element={<Layout locations={locations} />}>
        <Route index element={<Home locations={locations} />} />
        <Route path="map">
          <Route index element={<MapComponent />} />
          <Route path=":id" element={<CountryMap locations={locations} />} />
        </Route>
      </Route>
    </Routes>


    
  );
}

export default App;
