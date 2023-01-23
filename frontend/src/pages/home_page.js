import React from "react";
import { Layout, theme } from "antd";
// import MapComponent from "../components/MapComponent";
// import FloatBut from "../components/FloatBut";
import HeaderContents from "../components/HeaderContents";
import home_page_styles from "./home_page_styles.css";
import HomePage from "../pages/home_page";

const { Header, Content, Footer } = Layout;

function App() {
	const {
		token: { colorBgContainer },
	} = theme.useToken();

	const disastersTest = [
		{
			startDate: "2018-09-18",
			appealType: "DREF",
			appealCode: "MDRUA010",
			activeOperations: "Venezuela: Conflict",
			disasterType: "Epidemic",
			fundingRequirements: "208,367 CHF",
			fundingCoverage: "80%",
		},
		{
			startDate: "2018-10-18",
			appealType: "DREF",
			appealCode: "MDRUA010",
			activeOperations: "Venezuela: Conflict",
			disasterType: "Epidemic",
			fundingRequirements: "208,367 CHF",
			fundingCoverage: "80%",
		},
	];

	return (
		<Layout className="site-layout">
			<Header
				style={{
					padding: 0,
					background: colorBgContainer,
				}}
			>
				<HeaderContents />
			</Header>
			<Content
				style={{
					margin: 0,
					background: "#FAF9F9",
					height: "500px",
					display: "flex",
					alignContent: "center",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<div>
					<table class="main">
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
					</table>
				</div>
			</Content>
			<Footer
				style={{
					textAlign: "center",
				}}
			>
				IFRC GO MAKE MAPS ©2023
			</Footer>
		</Layout>
	);
}

export default App;
