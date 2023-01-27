import React from "react";
import { Button, Drawer } from "antd";
import { useState } from "react";
import { MenuOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const LeftDrawer = () => {
	const [open, setOpen] = useState(false);
	const showDrawer = () => {
		setOpen(true);
	};
	const onClose = () => {
		setOpen(false);
	};

	return (
		<>
			<Button
				style={{
					left: 10,
				}}
				size="large"
				type="text"
				onClick={showDrawer}
				icon={<MenuOutlined />}
			></Button>
			<Drawer
				title="Basic Drawer"
				placement="left"
				onClose={onClose}
				open={open}
				width="320px"
			>
				<Link to="/">
					<p>Home</p>
				</Link>
				<Link to="map">
					<p>Test Map</p>
				</Link>
			</Drawer>
		</>
	);
};

export default LeftDrawer;
