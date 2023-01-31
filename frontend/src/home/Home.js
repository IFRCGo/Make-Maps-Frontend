import React from "react";
import { Link } from "react-router-dom";
import { Table } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import moment from "moment";

const Home = () => {
	const disastersTest = [
		{
			startDate: new Intl.DateTimeFormat("fr-CA").format(
				new Date("2018-09-18")
			),
			appealType: "DREF",
			appealCode: "MDRUA010",
			activeOperations: "Venezuela - Conflict",
			disasterType: "Epidemic",
			fundingRequirements: "208,367 CHF",
			fundingCoverage: 80,
		},
		{
			startDate: new Intl.DateTimeFormat("fr-CA").format(
				new Date("2018-10-18")
			),
			appealType: "DREF",
			appealCode: "MDRUA010",
			activeOperations: "Venezuela - Conflict",
			disasterType: "Epidemic",
			fundingRequirements: "208,367 CHF",
			fundingCoverage: 80,
		},
		{
			startDate: new Intl.DateTimeFormat("fr-CA").format(
				new Date("2023-01-29")
			),
			appealType: "DREF",
			appealCode: "MDRUY004",
			activeOperations: "Uruguay - Drought",
			disasterType: "Drought",
			fundingRequirements: "42,951 CHF",
			fundingCoverage: 100,
		},
		{
			startDate: new Intl.DateTimeFormat("fr-CA").format(
				new Date("2023-01-24")
			),
			appealType: "DREF",
			appealCode: "MDRZM017",
			activeOperations: "Zambia - Flood",
			disasterType: "Flood",
			fundingRequirements: "86,140 CHF",
			fundingCoverage: 100,
		},
	];

	interface DataType {
		key: React.Key;
		startDate: Date;
		appealType: String;
		appealCode: String;
		activeOperations: String;
		disasterType: String;
		fundingRequirements: String;
		fundingCoverage: Number;
	}

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
				background: "#FAF9F9",
				display: "flex",
				alignContent: "center",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Table columns={columns} dataSource={disastersTest} onChange={onChange} />
			{/* <table class="main">
				<thead>
					<tr role="row">
						<th colSpan="1" role="columnheader" title="Toggle SortBy">
							Start Date<span></span>
						</th>
						<th colSpan="1" role="columnheader" title="Toggle SortBy">
							Appeal Type<span></span>
						</th>
						<th colSpan="1" role="columnheader" title="Toggle SortBy">
							Appeal Code<span></span>
						</th>
						<th colSpan="1" role="columnheader" title="Toggle SortBy">
							Active Operations<span></span>
						</th>
						<th colSpan="1" role="columnheader" title="Toggle SortBy">
							Disaster Type<span></span>
						</th>
						<th colSpan="1" role="columnheader" title="Toggle SortBy">
							Funding Requirements<span></span>
						</th>
						<th colSpan="1" role="columnheader" title="Toggle SortBy">
							Funding Coverage<span></span>
						</th>
					</tr>
				</thead>
				<tbody>
					{disastersTest.map((element) => {
						return (
							<tr style={home_page_styles.tr}>
								<td>{element.startDate}</td>
								<td>{element.appealType}</td>
								<td>{element.appealCode}</td>
								<td>{element.activeOperations}</td>
								<td>{element.disasterType}</td>
								<td>{element.fundingRequirements}</td>
								<td>{element.fundingCoverage}</td>
							</tr>
						);
					})}
				</tbody>
			</table> */}
			<Link to="map">
				<button>Test map</button>
			</Link>
		</main>
	);
};

export default Home;
