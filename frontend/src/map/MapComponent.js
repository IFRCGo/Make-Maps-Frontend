import React, { useCallback, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "./Map.css";
import Map, {
	NavigationControl,
	Marker,
	Source,
	Layer,
	FullscreenControl,
} from "react-map-gl";
import ToolBar from "./ToolBar";
import HeaderContents from "../components/HeaderContents";
import { IoLocationSharp } from "react-icons/io5";
import { useLocation, useParams } from "react-router-dom";

const ADD_PIN = 1;
const ADD_POPUP = 2;
const DO_NOTHING = 0;

const MapComponent = ({ searchCountry, props }) => {
	// Destructuring
	const { long, lat } = useParams();
	const location = {
		longitude: typeof long != "undefined" ? long : 16.62662018,
		latitude: typeof lat != "undefined" ? lat : 49.2125578,
		zoom: typeof long != "undefined" ? 9 : 0,
	};
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

	const handlePaintButtonToggle = (event) => {
		setPaintButton(!paintButton);
	};

	const tempFunc = useCallback(() => {
		setMapLocation({ longitude: long, latitude: lat, zoom: 9 });
	});

	useEffect(() => {
		tempFunc();
	}, [long, lat]);
	//

	let locationInfo = useLocation();
	// ISSUE

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

	console.log(mapType);

	return (
		<div className="map-wrap">
			<Map
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
			/>
		</div>
	);
};

export default MapComponent;
