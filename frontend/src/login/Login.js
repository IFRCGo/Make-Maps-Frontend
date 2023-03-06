import React, { useState } from "react";
import * as msal from "@azure/msal-browser";

import { Input, Space, Button } from "antd";
import GoLogo from "../images/goLogo.svg";

const Login = () => {
	const [passwordVis, setPasswordVis] = React.useState(false);

	const msalConfig = {
		auth: {
			clientId: process.env.REACT_APP_CLIENT_ID,
			authority: process.env.REACT_APP_LOGIN_AUTHORITY,
			redirectUri: process.env.REACT_APP_REDIRECT_URI,
		},
	};
	const scopes = ["openid", "profile", "email"]; // add any additional scopes here

		const [loggedIn, setLoggedIn] = useState(false);
		const [user, setUser] = useState(null);

		const msalInstance = new msal.PublicClientApplication(msalConfig);

		const handleLogin = async () => {
			try {
				const loginResponse = await msalInstance.loginPopup({
					scopes,
				});

				setUser(loginResponse.account);
				//console.log(loginResponse.account.username) //This gets their email address
				setLoggedIn(true);
			} catch (err) {
				console.error(err);
			}
		};
	const handleLogout = async () => {
		await msalInstance.logoutPopup();
		setLoggedIn(false);
		setUser(null);
	};

	return (
		<>
			<Space
				wrap
				direction="vertical"
				style={{
					flexDirection: "row",
					display: "block",
					justifyContent: "center",
					width: 400,
					marginLeft: "auto",
					marginRight: "auto",
					marginTop: 250,
					marginBottom: "auto",
				}}
			>
				<img src={GoLogo} alt="logo" className="logo" />
				{loggedIn ? (
					<>
						<p>Signed in as {user.name}</p>

						<Button type="primary" danger onClick={handleLogout} style={{ marginTop: 20, width: "auto" }}>
							Logout
						</Button>
					</>
				) : (
					<Button type="primary" danger onClick={handleLogin} style={{ marginTop: 20, width: "auto" }}>
						Login
					</Button>
				)}

			</Space>
		</>
	);
};

export default Login;
