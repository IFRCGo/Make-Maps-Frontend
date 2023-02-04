import React from "react";
import { Route, Routes } from "react-router-dom";
import "maplibre-gl/dist/maplibre-gl.css";
import MapComponent from "./map/MapComponent";
import Layout from "./components/Layout";
import Home from "./home/Home";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<Home />} />
				<Route path="map/:long?/:lat?" element={<MapComponent />} />
			</Route>
		</Routes>
	);
}

export default App;
