import React from "react";
import { Input, Space } from "antd";
import LeftDrawer from "./LeftDrawer";
import GoLogo from '../images/goLogo.svg';
import { Link } from "react-router-dom";

const { Search } = Input;
const onSearch = (value: string) => console.log(value);

const HeaderContents = () => {
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
					<img src={GoLogo} alt="logo" className="logo"/>
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
