import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Table, Button, Space } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import moment from "moment";
import "./Home.css";

const disastersTest = [
	{
		startDate: new Intl.DateTimeFormat("fr-CA").format(new Date("2018-09-18")),
		appealType: "DREF",
		appealCode: "MDRUA010",
		activeOperations: "Venezuela - Conflict",
		disasterType: "Epidemic",
		fundingRequirements: "208,367 CHF",
		fundingCoverage: 80,
		country: "Venezuela",
	},
	{
		startDate: new Intl.DateTimeFormat("fr-CA").format(new Date("2018-10-18")),
		appealType: "DREF",
		appealCode: "MDRUA010",
		activeOperations: "Venezuela - Conflict",
		disasterType: "Epidemic",
		fundingRequirements: "208,367 CHF",
		fundingCoverage: 80,
		country: "Venezuela",
	},
	{
		startDate: new Intl.DateTimeFormat("fr-CA").format(new Date("2023-01-29")),
		appealType: "DREF",
		appealCode: "MDRUY004",
		activeOperations: "Uruguay - Drought",
		disasterType: "Drought",
		fundingRequirements: "42,951 CHF",
		fundingCoverage: 100,
		country: "Uruguay",
	},
	{
		startDate: new Intl.DateTimeFormat("fr-CA").format(new Date("2023-01-24")),
		appealType: "DREF",
		appealCode: "MDRZM017",
		activeOperations: "Zambia - Flood",
		disasterType: "Flood",
		fundingRequirements: "86,140 CHF",
		fundingCoverage: 100,
		country: "Zambia",
	},
];

const Home = ({locations}) => {

	interface DataType {
		key: React.Key;
		startDate: Date;
		appealType: String;
		appealCode: String;
		activeOperations: String;
		disasterType: String;
		fundingRequirements: String;
		fundingCoverage: Number;
		country: String;
	}

	const navigate = useNavigate();

	const countryLink = (country) => {
		// const found = locations.includes((element) => element == value);
		console.log(country);
		let locationFound = locations.filter(
			(location) => location["country"] === country.toLowerCase()
		);
		console.log(locationFound);
		// console.log(locationFound[0].Disasterlocation);
		let locationData = locationFound[0].Disasterlocation;
		console.log(locationData);

		navigate(`map/${locationData.x}/${locationData.y}`);

		// setMapLocation({
		// 	longitude: locationData.x,
		// 	latitude: locationData.y,
		// 	zoom: 9,
		// });
	};

	const columns: ColumnsType<DataType> = [
		{
			title: "Start Date",
			dataIndex: "startDate",
			sorter: (a, b) =>
				moment(a.startDate, "YYYY-MM-DD").unix() -
				moment(b.startDate, "YYYY-MM-DD").unix(),
		},
		{
			title: "Appeal Type",
			dataIndex: "appealType",
			defaultSortOrder: "descend",
		},
		{
			title: "Appeal Code",
			dataIndex: "appealCode",
		},
		{
			title: "Active Operations",
			dataIndex: "activeOperations",
			filters: [
				{
					text: "Venezuela",
					value: "Venezuela",
				},
				{
					text: "Uruguay",
					value: "Uruguay",
				},
				{
					text: "Zambia",
					value: "Zambia",
				},
			],
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
				{
					text: "Drought",
					value: "Drought",
				},
				{
					text: "Flood",
					value: "Flood",
				},
			],
			onFilter: (value: string, record) =>
				record.disasterType.indexOf(value) === 0,
		},
		{
			title: "Funding Requirements",
			dataIndex: "fundingRequirements",
		},
		{
			title: "Funding Coverage",
			dataIndex: "fundingCoverage",
			defaultSortOrder: "descend",
			sorter: (a, b) => a.fundingCoverage - b.fundingCoverage,
		},
		{
			title: "Country",
			dataIndex: "country",
			render: (country) => (
				<Button
					danger
					type="link"
					style={{ padding: 0, minWidth: 100, textAlign: "left" }}
					onClick={() => {
						countryLink(country);
					}}
				>
					{country}
				</Button>
			),
		},
	];

	const onChange: TableProps<DataType>["onChange"] = (
		pagination,
		filters,
		sorter,
		extra
	) => {
		console.log("params", pagination, filters, sorter, extra);
	};

	return (
		<main
			style={{
				margin: 100,
				display: "flex",
				alignContent: "center",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Space direction="vertical" size="large">
				<div className="underline">
					<h1 style={{ fontSize: 35, marginBottom: 10 }}>Disaster Locations</h1>
				</div>
				<Table
					columns={columns}
					dataSource={disastersTest}
					onChange={onChange}
					bordered={true}
				/>
			</Space>
		</main>
	);
};

export default Home;
