import React from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Space } from "antd";
import moment from "moment";
import "./Home.css";

const Home = ({ disasters }) => {
	const navigate = useNavigate();

	const countryLink = (country, disaster) => {
		// Look into why disaster is the entire disaster object
		// console.log(disaster);

		let locationData = disaster.disasterCoordinates;
		navigate(
			`map/${disaster._id}/${locationData.coordinates[0]}/${locationData.coordinates[1]}`,
			{ state: { countryData: disaster } }
		);
	};

	const disasterType = disasters.map((disaster) => disaster.disasterType);

	const columns = [
		{
			title: "Start Date",
			dataIndex: "date",
			sorter: (a, b) =>
				moment(a.date, "YYYY-MM-DD").unix() -
				moment(b.date, "YYYY-MM-DD").unix(),
		},
		{
			title: "Disaster Name",
			dataIndex: "disasterName",
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
			],
			onFilter: (value: string, record) =>
				record.disasterType.indexOf(value) === 0,
		},
		{
			title: "Funding Requirements",
			dataIndex: "amount_requested",
		},
		{
			title: "Funding",
			dataIndex: "amount_funded",
			sorter: (a, b) => a.amount_funded - b.amount_funded,
		},
		{
			title: "Country",
			dataIndex: "location",
			render: (country, disaster) => (
				<Button
					danger
					type="link"
					style={{ padding: 0, minWidth: 100, textAlign: "left" }}
					onClick={() => {
						countryLink(country, disaster);
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
					rowKey="_id"
					dataSource={disasters}
					columns={columns}
					onChange={onChange}
					bordered={true}
				/>
			</Space>
		</main>
	);
};

export default Home;
