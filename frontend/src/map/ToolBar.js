import React from "react";
import { Drawer, FloatButton, Button, Space } from "antd";
import { useState } from "react";
import {
	ToolOutlined,
	PushpinOutlined,
	FormOutlined,
	LinkOutlined,
	DownloadOutlined,
	EyeInvisibleTwoTone,
	EyeTwoTone
} from "@ant-design/icons";
import "./ToolBar.css";

const ToolBar = ({ handlePinButton, handleTextButton, setMapType, setBlur }) => {
	const [open, setOpen] = useState(true);
	const [visual, setVisual] = useState(true);
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

	const changeMap = (event) => {};

	return (
		<>
			<FloatButton
				shape="square"
				style={{ right: 24, marginBottom: 20 }}
				icon={<ToolOutlined />}
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
							<Button type="text" size="large" icon={<LinkOutlined />} />
							<Button type="text" size="large" icon={<DownloadOutlined />} />
							<Button
								type="text"
								size="large"
								icon={
									<img
										src="https://cloud.maptiler.com/static/img/maps/basic-v2.png?t=1663665773"
										onClick={() =>
											setMapType(
												"https://api.maptiler.com/maps/basic-v2/style.json?key=HMeYX3yPwK7wfZQDqdeC"
											)
										}
										width="40"
										height="40"
										alt="basic"
									/>
								}
							/>
							<Button
								type="text"
								size="large"
								icon={
									<img
										src="https://cloud.maptiler.com/static/img/maps/streets-v2.png?t=1663665773"
										onClick={() =>
											setMapType(
												"https://api.maptiler.com/maps/streets-v2/style.json?key=HMeYX3yPwK7wfZQDqdeC"
											)
										}
										width="40"
										height="40"
										alt="basic"
									/>
								}
							/>
							<Button
								type="text"
								size="large"
								icon={
									<img
										src="https://cloud.maptiler.com/static/img/maps/openstreetmap.png?t=1663665773"
										onClick={() =>
											setMapType(
												"https://api.maptiler.com/maps/openstreetmap/style.json?key=HMeYX3yPwK7wfZQDqdeC"
											)
										}
										width="40"
										height="40"
										alt="basic"
									/>
								}
							/>
							<Button
								type="text"
								size="large"
								icon={
									<img
										src="https://cloud.maptiler.com/static/img/maps/hybrid.png?t=1663665773"
										onClick={() =>
											setMapType(
												"https://api.maptiler.com/maps/hybrid/style.json?key=HMeYX3yPwK7wfZQDqdeC"
											)
										}
										width="40"
										height="40"
										alt="basic"
									/>
								}
							/>
							<Button
								type="text"
								size="large"
								icon={
									<EyeInvisibleTwoTone 
										onClick={() =>
											setBlur("blur(2px)")

										}
									/>
								}			
							/>
							<Button
								type="text"
								size="large"
								icon={
									<EyeTwoTone 
										onClick={() =>
											setBlur("blur(0px)")
										}
									/>
								}			
							/>
						</Space>
					</div>
				</Drawer>
			</div>
		</>
	);
};

export default ToolBar;
