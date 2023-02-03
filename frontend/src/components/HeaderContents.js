import React, { useState } from "react";
import { Input, Space } from "antd";
import LeftDrawer from "./LeftDrawer";
import GoLogo from "../images/goLogo.svg";
import { Link } from "react-router-dom";

const { Search } = Input;

const locations = [
	{
		country: "venezuela",
		Disasterlocation: { x: 6.4141070000000004, y: 66.5789265 },
	},
];

const HeaderContents = ({ setMapLocation }) => {
	const [searchCountry, setSearchCountry] = useState({});

	const onSearch = (value: string) => {
		// const found = locations.includes((element) => element == value);
		let locationFound = locations.filter(
			(location) => location["country"] === value
		);
		console.log(locationFound[0].Disasterlocation);
		let locationData = locationFound[0].Disasterlocation;
		console.log(locationData);
		// setMapLocation({
		// 	longitude: locationData.x,
		// 	latitude: locationData.y,
		// 	zoom: 9,
		// });
	};

	return (
		<Space
			direction="horizontal"
			size={15}
			style={{
				height: "100%",
				width: "100%",
			}}
		>
			<LeftDrawer />
			<Link to="/">
				<div className="logo-wrap">
					<img src={GoLogo} alt="logo" className="logo" />
				</div>
			</Link>

			<Search
				placeholder="input search text"
				allowClear
				onSearch={onSearch}
				style={{ width: 300, marginTop: 16 }}
			/>
		</Space>
	);
};

export default HeaderContents;
