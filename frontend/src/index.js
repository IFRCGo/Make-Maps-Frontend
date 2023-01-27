import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import HomePage from "./pages/home_page";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<HomePage />
	</React.StrictMode>
);
