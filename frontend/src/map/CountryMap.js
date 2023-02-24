import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import maplibregl from "maplibre-gl";
import "./MapComponent.css";
import Map, {
	NavigationControl,
	Marker,
	Source,
	Layer,
	FullscreenControl,
} from "react-map-gl";
import ToolBar from "./ToolBar";
import { Col, Divider, Row, Card, Avatar } from "antd";
import { IoLocationSharp } from "react-icons/io5";
import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import { useQuery } from "@apollo/client";
import * as Query from "../API/AllQueries";

const { Meta } = Card;

const ADD_PIN = 1;
const ADD_POPUP = 2;
const DO_NOTHING = 0;

const CountryMap = ({ searchCountry, disasters }) => {
	const { id, long, lat } = useParams();
	const { state } = useLocation();
	const { countryData } = state || {};
	const location = {
		longitude: typeof long != "undefined" ? long : 16.62662018,
		latitude: typeof lat != "undefined" ? lat : 49.2125578,
		zoom: typeof long != "undefined" ? 9 : 0,
	};

	console.log(countryData);
	// console.log(id);
	// console.log(disasters);

	const [mapLocation, setMapLocation] = useState(location);
	const [pins, setPins] = useState([]);
	const [status, setStatus] = useState(DO_NOTHING);
	const [popupList, setPopupList] = useState([]);
	const [mapType, setMapType] = useState(
		"https://api.maptiler.com/maps/basic-v2/style.json?key=HMeYX3yPwK7wfZQDqdeC"
	);
	const [userDrawnLines, setUserDrawnLines] = useState([]);
	const [currentLine, setCurrentLine] = useState([]);
	const [brushColor, setBrushColor] = useState("#ffa500");
	const [brushSize, setBrushSize] = useState(10);
	const [painting, setPainting] = useState(false);
	const [paintButton, setPaintButton] = useState(false);
	const { loading, error, data } = useQuery(
		Query.GET_PINS, 
		{variables: 
			{
				"filter": {
					"disaster": countryData._id
				}
			}
		}
	);

	const gridStyle: React.CSSProperties = {
		width: "50%",
		textAlign: "center",
		display: "flex",
		alignContent: "center",
		justifyContent: "center",
		alignItems: "center",
	};

	useEffect(() => {
		if (data) {
			setPins(data.pinMany);
		}
	}, [data]);

	const handlePaintButtonToggle = (event) => {
		setPaintButton(!paintButton);
	};

	const handleDrawPoint = (event) => {
		if (paintButton) {
			if (painting) {
				setCurrentLine((prev) => [
					...prev,
					[event.lngLat.lng, event.lngLat.lat],
				]);
			}
		}
	};

	const handlePaintButton = (event) => {
		setPainting(!painting);
		if (!painting) {
			setUserDrawnLines((prev) => [...prev, currentLine]);
			setCurrentLine([]);
		} else {
			setPaintButton(!paintButton);
		}
	};

	const lineStrings = [...userDrawnLines, currentLine].map((line, index) => {
		return {
			type: "Feature",
			geometry: {
				type: "MultiLineString",
				coordinates: [line],
			},
		};
	});

	const handleMapClick = (event) => {
		if (status === ADD_PIN) {
			setPins([...pins, [event.lngLat.lng, event.lngLat.lat]]);
			setStatus(DO_NOTHING);
		}

		if (status === ADD_POPUP) {
			setPopupList([
				...popupList,
				[
					event.lngLat.lng,
					event.lngLat.lat,
					prompt("Your input", "My Text Data"),
				],
			]);
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
					<div className="underline">
						<h1 style={{ fontSize: 35 }}>{countryData.location}</h1>
					</div>
				</Col>
			</Row>
			<Row>
				<Col
					flex="auto"
					style={{
						marginRight: 500,
						marginLeft: 500,
						padding: 31,
						alignContent: "center",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Card>
						<Card.Grid hoverable={false} style={gridStyle}>
							<div
								style={{
									flexDirection: "row",
									flex: 1,
									justifyContent: "space-around",
								}}
							>
								<GiReceiveMoney style={{ color: "red", fontSize: "4em" }} />
								<Meta
									title={new Intl.NumberFormat("en-US").format(
										parseInt(countryData.amount_requested)
									)}
									description="Amount Requested (CHF)"
								/>
							</div>
						</Card.Grid>
						<Card.Grid hoverable={false} style={gridStyle}>
							<div
								style={{
									flexDirection: "row",
									flex: 1,
									justifyContent: "space-around",
								}}
							>
								<GiPayMoney style={{ color: "red", fontSize: "4em" }} />
								<Meta
									title={new Intl.NumberFormat("en-US").format(
										parseInt(countryData.amount_funded)
									)}
									description="Amount Funded (CHF)"
								/>
							</div>
						</Card.Grid>
					</Card>
				</Col>
			</Row>
			<Row>
				<Col
					flex={3} // 3/5
					style={{ padding: 20 }}
				>
					<Map
						mapLib={maplibregl}
						initialViewState={mapLocation}
						style={{ width: "100%", height: " calc(100vh - 400px)" }}
						onMouseMove={painting ? handleDrawPoint : ""}
						onClick={paintButton ? handlePaintButton : handleMapClick}
						mapStyle={mapType}
					>
						<NavigationControl position="top-left" />
						{pins.map((pin, index) => (
							<Marker
								key={index}
								draggable={true}
								onDragEnd={(e) => handlePinDragEnd(e, index)}
								longitude={pin.pinCoordinates.coordinates[0]}
								latitude={pin.pinCoordinates.coordinates[1]}
							>
								<div>
									<IoLocationSharp style={{ color: "red", fontSize: "2em" }} />
								</div>
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
								<div>
									<button>{popu[2]}</button>
								</div>
							</Marker>
						))}

						{lineStrings.map((lineString, index) => (
							<Source
								key={index}
								id={`user-drawn-line-${index}`}
								type="geojson"
								data={lineString}
							>
								<Layer
									id={`brush-layer-${index}`}
									type="line"
									source={`user-drawn-line-${index}`}
									paint={{
										"line-color": brushColor,
										"line-width": brushSize,
									}}
									before="waterway-label"
								/>
							</Source>
						))}
						<FullscreenControl />
					</Map>
				</Col>
				<Col
					flex={2} // 2/5
					style={{ padding: 20 }}
				>
					<Card>Description...</Card>
				</Col>
			</Row>
			{/* <Divider orientation="left">Emergency Overview</Divider> */}
			<Row>
				<Col
					flex="auto"
					style={{
						alignContent: "center",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Card
						title="Emergency Overview"
						style={{
							textAlign: "center",
							width: "100%",
						}}
					>
						Information...
					</Card>
				</Col>
			</Row>
			{/* Need to figure how to resize map */}
			{/* <Map
				mapLib={maplibregl}
				initialViewState={mapLocation}
				style={{ width: "100%", height: " calc(100vh - 64px)" }}
				onMouseMove={painting ? handleDrawPoint : ""}
				onClick={paintButton ? handlePaintButton : handleMapClick}
				mapStyle={mapType}
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
						<div>
							<IoLocationSharp style={{ color: "red", fontSize: "2em" }} />
						</div>
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
						<div>
							<button>{popu[2]}</button>
						</div>
					</Marker>
				))}

				{lineStrings.map((lineString, index) => (
					<Source
						key={index}
						id={`user-drawn-line-${index}`}
						type="geojson"
						data={lineString}
					>
						<Layer
							id={`brush-layer-${index}`}
							type="line"
							source={`user-drawn-line-${index}`}
							paint={{
								"line-color": brushColor,
								"line-width": brushSize,
							}}
							before="waterway-label"
						/>
					</Source>
				))}
				<FullscreenControl />
			</Map>
			<ToolBar
				handlePinButton={handlePinButton}
				handleTextButton={handleTextButton}
				setMapType={setMapType}
				handlePaintButton={handlePaintButtonToggle}
			/> */}
		</div>
	);
};

export default CountryMap;
