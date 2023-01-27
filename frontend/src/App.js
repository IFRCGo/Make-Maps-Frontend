import React from "react";
import "./App.css";
import { Route, Routes } from 'react-router-dom';
import "maplibre-gl/dist/maplibre-gl.css";
import MapComponent from "./components/MapComponent";
import Layout from "./components/Layout";
import Home from "./pages/Home";



function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="map" element={<MapComponent />} />
      </Route>
    </Routes>


    
  );
}

export default App;
