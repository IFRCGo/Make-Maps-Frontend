import React from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Space } from "antd";
import moment from "moment";
import "./Home.css";

const disastersTest = [
	{
		key: 1,
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
		key: 2,
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
		key: 3,
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
		key: 4,
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
	const navigate = useNavigate();

	const countryLink = (country) => {
		let locationFound = locations.filter(
			(location) => location["country"].toLowerCase() === country.toLowerCase()
		);
		let locationData = locationFound[0].disasterLocation;
		navigate(`map/${locationData.x}/${locationData.y}`);
	};

	const columns = [
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

	const onChange = (pagination, filters, sorter, extra) => {
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
					dataSource={disastersTest}
					columns={columns}
					onChange={onChange}
					bordered={true}
				/>
			</Space>
		</main>
	);
};

export default Home;
