import React from "react";
import { Button, Drawer } from "antd";
import { useState } from "react";
import { MenuOutlined } from "@ant-design/icons";
import Home from "../pages/Home";
import App from "../App.js";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
	Routes,
	Link,
	Navigate,
} from "react-router-dom";

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
			{/* Routes */}
			<Router>
				<Routes>
					<Route exact path="/" component={<Home />} />
					<Route exact path="app" component={<App />} />
				</Routes>
			</Router>
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
				<Link to="/app">About</Link>
				<p>Some contents...</p>
				<p>Some contents...</p>
			</Drawer>
		</>
	);
};

export default LeftDrawer;
