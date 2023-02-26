import React, { useEffect, useRef, useState } from "react";
import maplibregl, { Map as map1 } from "maplibre-gl";
import "./MapComponent.css";
import { Tag } from "antd";
import Map, { NavigationControl, Marker } from "react-map-gl";
import ToolBar from "./ToolBar";
import { IoLocationSharp } from "react-icons/io5";
import { useLocation, useParams } from "react-router-dom";
import { Modal, Button } from "antd";

import { LAYERS, API_KEY, MAP_STATUS, LAYER_STATUS } from "./constant";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import PaintMode from "mapbox-gl-draw-paint-mode";
import "maplibre-gl/dist/maplibre-gl.css";
import ToolDetail from "./ToolDetail";
import jsPDF from "jspdf";
import StyleButton from "./StyleButton";

const MapComponent = ({ searchCountry, props }) => {
	// Destructuring
	const [layerStatus, setLayerStatus] = useState(() => {
		return LAYERS.reduce((acc, layer) => {
			acc[layer.name] = LAYER_STATUS.NOT_RENDERING;
			return acc;
		}, {});
	});
	const { long, lat } = useParams();
	const location = {
		longitude: typeof long != "undefined" ? long : 16.62662018,
		latitude: typeof lat != "undefined" ? lat : 49.2125578,
		zoom: typeof long != "undefined" ? 9 : 0,
	};
	const [mapLocation, setMapLocation] = useState(location);
	const [pins, setPins] = useState([]);
	const [status, setStatus] = useState(MAP_STATUS.DO_NOTHING);
	const [popupList, setPopupList] = useState([]);
	const [drag, setDrag] = useState(false);
	const [cardOpen, setCardOpen] = useState(false);
	const [mapType, setMapType] = useState(
		"https://api.maptiler.com/maps/basic-v2/style.json?key=HMeYX3yPwK7wfZQDqdeC"
	);
	const [userDrawnLines, setUserDrawnLines] = useState([]);
	const [currentLine, setCurrentLine] = useState([]);
	const [brushColor, setBrushColor] = useState("#ffa500");
	const [brushSize, setBrushSize] = useState(10);
	const [painting, setPainting] = useState(false);
	const [paintButton, setPaintButton] = useState(false);

	const [isModalOpen, setIsModalOpen] = useState(false);

	const mapboxDrawRef = useRef(null);
	const showModal = () => {
		setIsModalOpen(true);
	};

	const handleOk = () => {
		setIsModalOpen(false);
	};

	const handleCancel = () => {
		setIsModalOpen(false);
	};

	const mapRef = useRef(null);

	const handlePaintButtonToggle = (event) => {
		setPaintButton(!paintButton);
	};

	const handleMapClick = (event) => {
		if (status === MAP_STATUS.ADD_PIN) {
			setPins([...pins, [event.lngLat.lng, event.lngLat.lat]]);
			setStatus(MAP_STATUS.DO_NOTHING);
		} else if (status === MAP_STATUS.ADD_POPUP) {
			setPopupList([
				...popupList,
				[
					event.lngLat.lng,
					event.lngLat.lat,
					prompt("Your input", "My Text Data"),
				],
			]);
			setStatus(MAP_STATUS.DO_NOTHING);
		} else if (status === MAP_STATUS.CHOSEN) {
			setCardOpen(true);
			setDrag(true);
			setStatus(MAP_STATUS.DO_NOTHING);
		} else {
			setCardOpen(false);
			setDrag(false);
		}
	};

	const checkLayerStatus = (layerName) => {
		return layerStatus[layerName];
	};

	const updateLayerStatus = (layerName, status) => {
		setLayerStatus({
			...layerStatus,
			[layerName]: status,
		});
	};

	const handlePinDragEnd = (event, index) => {
		const newPins = [...pins];
		newPins[index] = [event.lngLat.lng, event.lngLat.lat];
		setPins(newPins);
	};
	const handlePopupDragEnd = (event, index) => {
		const newPopupList = [...popupList];
		newPopupList[index] = [
			event.lngLat.lng,
			event.lngLat.lat,
			newPopupList[index][2],
		];
		setPopupList(newPopupList);
	};

	const handlePaintButton = () => {
		mapboxDrawRef.current.changeMode("draw_paint_mode");
	};
	const handleLineButton = () => {
		mapboxDrawRef.current.changeMode("draw_line_string");
	};
	const handlePolygonButton = () => {
		mapboxDrawRef.current.changeMode("draw_polygon");
	};

	const onMapLoad = React.useCallback(() => {
		console.log(mapRef.current);
		if (!mapRef.current) {
			return;
		}

		mapboxDrawRef.current = new MapboxDraw({
			displayControlsDefault: false,
			controls: {
				polygon: false,
				trash: false,
			},
			modes: {
				...MapboxDraw.modes,
				draw_paint_mode: PaintMode,
			},
		});

		mapRef.current.addControl(mapboxDrawRef.current);
		// do something
	}, []);

	const handlePinButton = () => {
		setStatus(MAP_STATUS.ADD_PIN);
	};
	const handleTextButton = () => {
		setStatus(MAP_STATUS.ADD_POPUP);
	};

	const addLayer = (layerName) => {
		const maplibreMap = mapRef.current.getMap();

		const layer = LAYERS.find((layer) => layer.name === layerName);

		maplibreMap.addSource(layerName, {
			type: "raster",
			tiles: [layer.url],
			tileSize: 256,
		});
		maplibreMap.addLayer({
			id: layerName,
			type: "raster",
			source: layerName,
			paint: {
				"raster-opacity": 1,
			},
		});

		updateLayerStatus(layerName, LAYER_STATUS.IS_RENDERING);
	};

	const handleDownloadButton = () => {
		const maplibreMap = mapRef.current.getMap();

		const renderMap = new map1({
			container: maplibreMap.getContainer(),
			style: maplibreMap.getStyle(),
			center: maplibreMap.getCenter(),
			zoom: maplibreMap.getZoom(),
			bearing: maplibreMap.getBearing(),
			pitch: maplibreMap.getPitch(),
			interactive: false,
			preserveDrawingBuffer: true,
			fadeDuration: 0,
			attributionControl: false,
		});

		renderMap.once("idle", () => {
			setTimeout(() => {
				const canvasDataURL = renderMap.getCanvas().toDataURL();
				const link = document.createElement("a");
				link.href = canvasDataURL;
				link.download = "map-export.png";
				const pdf = new jsPDF("l", "mm", "a4");

				// Add the map image to the PDF document
				pdf.addImage(
					canvasDataURL,
					"PNG",
					0,
					0,
					pdf.internal.pageSize.getWidth(),
					pdf.internal.pageSize.getHeight()
				);

				// Save the PDF file
				pdf.save("map-export.pdf");
				link.click();
				link.remove();
			}, 1000);
		});

		renderMap.once("idle", () => {
			setTimeout(() => {
				renderMap.remove();
			}, 1000);
		});
	};

	const removeLayer = (layerName) => {
		const maplibreMap = mapRef.current.getMap();

		maplibreMap.removeLayer(layerName);
		maplibreMap.removeSource(layerName);

		updateLayerStatus(layerName, LAYER_STATUS.NOT_RENDERING);
	};

	const changeOpacity = (event, LayerName) => {
		const value = event.target.value;
		const opacity = value / 100;
		const maplibreMap = mapRef.current.getMap();
		maplibreMap.setPaintProperty(LayerName, "raster-opacity", opacity);
	};

	return (
		<div className="map-wrap">
			<button type="primary" onClick={showModal}>
				Edit Layer
			</button>
			<StyleButton setMapType={setMapType} />
			<Modal
				title="Basic Modal"
				open={isModalOpen}
				onOk={handleOk}
				onCancel={handleCancel}
			>
				{LAYERS.map((item, index) => (
					<div key={index}>
						<div>{item.name}</div>
						{checkLayerStatus(item.name) === LAYER_STATUS.IS_RENDERING ? (
							<>
								<input
									type="range"
									min="0"
									max="100"
									onChange={(e) => changeOpacity(e, item.name)}
								/>
								<button onClick={(e) => removeLayer(item.name)}>
									Remove this layer
								</button>
							</>
						) : (
							<button onClick={(e) => addLayer(item.name)}>
								Add this layer
							</button>
						)}
					</div>
				))}
			</Modal>
			<Map
				mapLib={maplibregl}
				onLoad={onMapLoad}
				ref={mapRef}
				initialViewState={{
					longitude: 16.62662018,
					latitude: 49.2125578,
					zoom: 0,
				}}
				onClick={handleMapClick}
				style={{ width: "100%", height: " calc(100vh - 64px)" }}
				mapStyle={mapType}
			>
				<NavigationControl position="top-left" />
				<ToolDetail cardOpen={cardOpen} />
				{pins.map((pin, index) => (
					<Marker
						style={{ cursor: "pointer" }}
						key={index}
						draggable={drag}
						onClick={() => {
							setStatus(MAP_STATUS.CHOSEN);
						}}
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
						style={{ cursor: "pointer" }}
						key={index}
						draggable={drag}
						onClick={() => {
							setStatus(MAP_STATUS.CHOSEN);
						}}
						onDragEnd={(e) => handlePopupDragEnd(e, index)}
						longitude={popu[0]}
						latitude={popu[1]}
					>
						<div>
							<Tag color="magenta">{popu[2]}</Tag>
						</div>
					</Marker>
				))}
			</Map>
			<ToolBar
				handlePinButton={handlePinButton}
				handleTextButton={handleTextButton}
				handlePaintButton={handlePaintButton}
				handleLineButton={handleLineButton}
				handlePolygonButton={handlePolygonButton}
				handleDownloadButton={handleDownloadButton}
			/>
		</div>
	);
};

export default MapComponent;
