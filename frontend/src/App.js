import React from "react";
import { Route, Routes } from "react-router-dom";
import "maplibre-gl/dist/maplibre-gl.css";
import MapComponent from "./map/MapComponent";
import Layout from "./components/Layout";
import Home from "./home/Home";
import CountryMap from "./map/CountryMap";

function App() {
  const locations = [
    {
      country: "Venezuela",
      // y = lat x = long
      disasterLocation: { x: -66.110932, y: 8.001871 },
    },
    {
      country: "Uruguay",
      // y = lat x = long
      disasterLocation: { x: -55.7658, y: -32.5228 },
    },
    {
      country: "Zambia",
      // y = lat x = long
      disasterLocation: { x: 27.8493, y: -13.1339 },
    },
  ];

  return (
    <Routes>
      <Route path="/" element={<Layout locations={locations} />}>
        <Route index element={<Home locations={locations} />} />
        <Route path="map">
          <Route index element={<MapComponent />} />
          <Route path=":long?/:lat?" element={<CountryMap locations={locations} />} />
        </Route>
      </Route>
    </Routes>


    
  );
}

export default App;
