import React from "react";
import {
	UserOutlined,
	EyeInvisibleOutlined,
	EyeTwoTone,
	LockOutlined,
} from "@ant-design/icons";
import { Input, Space, Button } from "antd";
import GoLogo from "../images/goLogo.svg";

const Login = () => {
	const [passwordVis, setPasswordVis] = React.useState(false);

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
				<Input
					size="large"
					placeholder="username"
					prefix={<UserOutlined />}
					style={{ marginTop: 20 }}
				/>
				<Input.Password
					size="large"
					placeholder="password"
					prefix={<LockOutlined />}
					iconRender={(visible) =>
						visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
					}
					style={{ marginTop: 20 }}
				/>
				<Button type="primary" danger style={{ marginTop: 20, width: "auto" }}>
					Login
				</Button>
			</Space>
		</>
	);
};

export default Login;
