import React, { useEffect, useState, useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { useLocation } from "react-router-dom";

import { QUE_RANDOM_FIVE_POSTS } from "../graphql";
import Cards from "../Containers/Cards";
import { UserInfo } from "../App";

const Home = () => {
	const [List, setList] = useState([]);
	const userInfo = useContext(UserInfo);

	//
	const { loading, error, data } = useQuery(QUE_RANDOM_FIVE_POSTS, {variables: {number: 0}, fetchPolicy: "cache-and-network"});
	useEffect(()=>{userInfo.setHideInput(false);})
	useEffect(() => {
		if(data) setList(data.randomFivePosts);
	}, [data]);
	// console.log("data", data);
	// console.log("error", error);
	// console.log("loading", loading);
	if(!data){
		return(
			<div id="content">
				<p id="general-title">載入中...</p>
			</div>
		);
	}
	return(
		<div id="content">
			<p id="general-title">你可能會想知道：</p>
			<Cards data={List} />
		</div>
	);
};

export default Home;