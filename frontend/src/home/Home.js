import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Space, Row, Col } from "antd";
import moment from "moment";
import maplibregl from "!maplibre-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "./Home.css";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import PaintMode from "mapbox-gl-draw-paint-mode";
import * as Query from "../API/AllQueries";

const Home = ({ disasters }) => {
	const navigate = useNavigate();
	const mapContainer = useRef(null);
	const mapRef = useRef(null);
	const mapboxDrawRef = useRef(null);
	const [mapStyle, setMapStyle] = useState(
		"https://api.maptiler.com/maps/basic-v2/style.json?key=HMeYX3yPwK7wfZQDqdeC"
	);

	console.log(disasters);
	useEffect(() => {
		// if (!loading && data) {
		if (!mapContainer) {
			return;
		}

		mapRef.current = new maplibregl.Map({
			container: mapContainer.current,
			style: mapStyle,
			center: [16.62662018, 49.2125578],
			zoom: 0,
		});

		mapboxDrawRef.current = new MapboxDraw({
			displayControlsDefault: false,
			controls: {
				polygon: false,
				line_string: false,
				trash: false,
			},
			modes: {
				...MapboxDraw.modes,
			},
		});

		mapRef.current.addControl(mapboxDrawRef.current);

		const pinData = disasters.map((item) => ({
			id: item._id,
			// Temporary placeholder
			type: "Feature",
			properties: {},
			geometry: {
				coordinates: item.disasterCoordinates.coordinates,
				type: "Point",
			},
		}));

		pinData.forEach((pin) => {
			mapboxDrawRef.current.add(pin);
		});

		// const pinData = {
		// 	id: "1",
		// 	// Temporary placeholder
		// 	type: "Feature",
		// 	properties: {},
		// 	geometry: {
		// 		coordinates: [1, 1],
		// 		type: "Point",
		// 	},
		// };
		// mapboxDrawRef.current.add(pinData);
		// }
	});

	const countryLink = (country, disaster) => {
		// Look into why disaster is the entire disaster object
		// console.log(disaster);

		let locationData = disaster.disasterCoordinates;
		navigate(
			`map/${disaster._id}/${locationData.coordinates[0]}/${locationData.coordinates[1]}`,
			{ state: { countryData: disaster } }
		);
	};

	const disasterType = disasters.map((disaster) => disaster.disasterType);

	const columns = [
		{
			title: "Start Date",
			dataIndex: "date",
			sorter: (a, b) =>
				moment(a.date, "YYYY-MM-DD").unix() -
				moment(b.date, "YYYY-MM-DD").unix(),
		},
		{
			title: "Disaster Name",
			dataIndex: "disasterName",
			onFilter: (value: string, record) =>
				record.activeOperations.indexOf(value) === 0,
		},
		{
			title: "Disaster Type",
			dataIndex: "disasterType",
			filters: [
				{
					text: "Epidemic",
					value: "Epidemic",
				},
			],
			onFilter: (value: string, record) =>
				record.disasterType.indexOf(value) === 0,
		},
		{
			title: "Funding Requirements",
			dataIndex: "amount_requested",
		},
		{
			title: "Funding",
			dataIndex: "amount_funded",
			sorter: (a, b) => a.amount_funded - b.amount_funded,
		},
		{
			title: "Country",
			dataIndex: "location",
			render: (country, disaster) => (
				<Button
					danger
					type="link"
					style={{ padding: 0, minWidth: 100, textAlign: "left" }}
					onClick={() => {
						countryLink(country, disaster);
					}}
				>
					{country}
				</Button>
			),
		},
	];

	const onChange = (pagination, filters, sorter, extra) => {
		console.log("params", pagination, filters, sorter, extra);
	};

	return (
		<div style={{ justifyContent: "center" }}>
			<Row>
				<Col
					flex="auto"
					style={{
						display: "flex",
						alignContent: "center",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<div className="underline">
						<h1 style={{ fontSize: 35, marginBottom: 10 }}>
							Disaster Locations
						</h1>
					</div>
				</Col>
			</Row>
			<Row>
				<Col
					flex="auto"
					style={{
						margin: 10,
						display: "flex",
						alignContent: "center",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<div ref={mapContainer} style={{ width: "66vw", height: "65vh" }} />
				</Col>
			</Row>
			<Row>
				<Col
					flex="auto"
					style={{
						margin: 20,
						display: "flex",
						alignContent: "center",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Space direction="Vertical" size="large">
						<Table
							rowKey="_id"
							dataSource={disasters}
							columns={columns}
							onChange={onChange}
							bordered={true}
						/>
					</Space>
				</Col>
			</Row>
		</div>
	);
};

export default Home;
