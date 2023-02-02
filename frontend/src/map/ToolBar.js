import React from "react";
import { Drawer, FloatButton, Button, Space, Popover } from "antd";
import { useState } from "react";
import {
	PushpinOutlined,
	FormOutlined,
	LinkOutlined,
	DownloadOutlined,
	FormatPainterOutlined
} from "@ant-design/icons";
import { FiLayers } from "react-icons/fi";
import { CgToolbox } from "react-icons/cg";
import "./ToolBar.css";

const ToolBar = ({ handlePinButton, handleTextButton, handlePaintButton, setMapType }) => {
	const [open, setOpen] = useState(true);
	const [visual, setVisual] = useState(true);
	const [select, setSelect] = useState("Default")

	const showDrawer = () => {
		open === false ? setOpen(true) : setOpen(false);
		visual === false
			? setVisual(true)
			: setTimeout(() => {
					setVisual(false);
			  }, 300);
	};
	const onClose = () => {
		setOpen(false);
		setVisual(false);
	};

	const layerContent = (
		<div>
			<Space>
				<Space.Compact direction="vertical">
					<Button 
						className="layer-button" 
						type={select === "Default" ? "primary" : "text"}
						onClick={() => {
							setMapType(
								"https://api.maptiler.com/maps/basic-v2/style.json?key=HMeYX3yPwK7wfZQDqdeC"
							);
							setSelect("Default");
						}}
					>
						<Space>
							<img
								className="layer-img"
								src="https://cloud.maptiler.com/static/img/maps/basic-v2.png?t=1663665773"
								width="40"
								height="40"
								alt="basic"
							/>
							<p>Default</p>
						</Space>					
					</Button>
					<Button 
						className="layer-button" 
						type={select === "Street" ? "primary" : "text"}
						onClick={() => {
							setMapType(
								"https://api.maptiler.com/maps/streets-v2/style.json?key=HMeYX3yPwK7wfZQDqdeC"
							);
							setSelect("Street");
						}}
					>
						<Space>
							<img
								className="layer-img"
								src="https://cloud.maptiler.com/static/img/maps/streets-v2.png?t=1663665773"
								width="40"
								height="40"
								alt="basic"
							/>
							<p>Street</p>
						</Space>
					</Button>
					<Button 
						className="layer-button" 
						type={select === "Open" ? "primary" : "text"}
						onClick={() => {
							setMapType(
								"https://api.maptiler.com/maps/openstreetmap/style.json?key=HMeYX3yPwK7wfZQDqdeC"
							);
							setSelect("Open");
						}}
					>
						<Space>
							<img
								className="layer-img"
								src="https://cloud.maptiler.com/static/img/maps/openstreetmap.png?t=1663665773"
								width="40"
								height="40"
								alt="basic"
							/>
							<p>Open Street</p>
						</Space>
					</Button>
					<Button 
						className="layer-button" 
						type={select === "Satellite" ? "primary" : "text"}
						onClick={() => {
							setMapType(
								"https://api.maptiler.com/maps/hybrid/style.json?key=HMeYX3yPwK7wfZQDqdeC"
							);
							setSelect("Satellite");
						}}
					>
						<Space>
							<img
								className="layer-img"
								src="https://cloud.maptiler.com/static/img/maps/hybrid.png?t=1663665773"
								width="40"
								height="40"
								alt="basic"
							/>
							<p>Satellite</p>
						</Space>
					</Button>
				</Space.Compact>
			</Space>
  	</div>
	);

	return (
		<>
			<FloatButton
				shape="square"
				style={{ right: 24, marginBottom: 20 }}
				icon={<CgToolbox />}
				onClick={showDrawer}
			/>
			<div
				className="tool-area"
				style={{ display: visual === false ? "none" : "initial" }}
			>
				<Drawer
					autoFocus={false}
					height={100}
					mask={false}
					placement="bottom"
					closable={false}
					onClose={onClose}
					open={open}
					getContainer={false}
				>
					<div className="tool-button">
						<Space>
							<Button
								type="text"
								size="large"
								icon={<PushpinOutlined onClick={handlePinButton} />}
							/>
							<Button
								type="text"
								size="large"
								icon={<FormOutlined onClick={handleTextButton} />}
							/>
							<Button
                type="text"
                size="large"
                icon={<FormatPainterOutlined onClick={handlePaintButton} />}
              />
							<Button type="text" size="large" icon={<LinkOutlined />} />
							<Button type="text" size="large" icon={<DownloadOutlined />} />
							<Popover placement="topLeft" content={layerContent} trigger="click">
								<Button type="text" size="large" icon={<FiLayers style={{ verticalAlign: "text-top" }}/>} />
							</Popover>
						</Space>
					</div>
				</Drawer>
			</div>
		</>
	);
};

export default ToolBar;
