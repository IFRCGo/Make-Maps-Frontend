import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "maplibre-gl/dist/maplibre-gl.css";
import MapComponent from "./map/MapComponent";
import Layout from "./components/Layout";
import Home from "./home/Home";
import CountryMap from "./map/CountryMap";
import TestAPI from "./TestAPI";
import { useQuery } from "@apollo/client";
import * as Query from "./API/AllQueries";

function App() {
  const [disasters, setDisasters] = useState([]);
  const { loading, error, data } = useQuery(Query.GET_DISASTERS);

  useEffect(() => {
    if (data) {
      setDisasters(data.disasterMany);
    }
  }, [data])

  return (
    <Routes>
      <Route path="/" element={<Layout disasters={disasters} />}>
        <Route index element={<Home disasters={disasters} />} />
        <Route path="map">
          <Route index element={<MapComponent />} />
          <Route
            path=":long?/:lat?"
            element={<CountryMap />}
          />
        </Route>
      </Route>
      <Route path="/test" element={<TestAPI />} />
    </Routes>
  );
}

export default App;
