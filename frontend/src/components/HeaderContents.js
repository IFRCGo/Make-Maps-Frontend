import React from "react";
import { Input, Space } from "antd";
import LeftDrawer from "./LeftDrawer";
import GoLogo from '../images/goLogo.svg';

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
			<div className="logo-wrap">
				<img src={GoLogo} alt="logo" className="logo"/>
			</div>
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
