import React from "react";
import home_page_styles from "./Home.css";
import { Link } from "react-router-dom";

const Home = () => {

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
		<main style={{
			margin: 100,
			background: "#FAF9F9",
			display: "flex",
			alignContent: "center",
			justifyContent: "center",
			alignItems: "center",
		}}>
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
			<Link to="map">
        <button>Test map</button>
      </Link>
		</main>
	)
}

export default Home