import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./home/Home";
import CountryMap from "./map/CountryMap";
import LiveMap from "./map/LiveMap";
import Login from "./login/Login";
import TestAPI from "./TestAPI";
import { useQuery } from "@apollo/client";
import * as Query from "./API/AllQueries";

function App() {
  const [disasters, setDisasters] = useState([]);
  const { data } = useQuery(Query.GET_DISASTERS);

  useEffect(() => {
    if (data) {
      setDisasters(data.disasterMany);
    }
  }, [data]);

  return (
    <Routes>
      <Route path="/" element={<Layout disasters={disasters} />}>
        <Route path="login">
          <Route index element={<Login />} />
        </Route>
        <Route index element={<Home disasters={disasters} />} />
        <Route path="map">
          <Route
            path=":id?/:long?/:lat?"
            element={<CountryMap disasters={disasters} />}
          />
          <Route
            path="live/:id?/:long?/:lat?"
            element={<LiveMap disasters={disasters} />}
          />
        </Route>
      </Route>
      <Route path="/test" element={<TestAPI />} />
    </Routes>
  );
}

export default App;
