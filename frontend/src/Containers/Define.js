import React, { useEffect, useState, useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { NavLink, useParams, useLocation } from "react-router-dom";

import Cards from "../Containers/Cards";
import { QUE_QUERY_BY_VOCABULARY } from "../graphql";
import { UserInfo } from "../App";

const Define = () => {
	const [List, setList] = useState([]);
	const { term } = useParams();
	const userInfo = useContext(UserInfo);

	userInfo.setHideInput(false);
	const { loading, error, data } = useQuery(QUE_QUERY_BY_VOCABULARY, {variables: {vocabulary: term}, fetchPolicy: "network-only"});
	useEffect(() => {
		if(data) setList(data.queryByVocabulary);
		return(() => {
			console.log("home unmouted");
		});
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
	if(!List.length){
		return(
			<div className="cant-find">
				<p id="general-title">ㄟ(￣▽￣ㄟ) 找不到 找不到 (ㄏ￣▽￣)ㄏ</p>
				<NavLink to={{pathname: "/add", state: {wordToBeDefine: term}}}><button className="botton">來去定義 {term}</button></NavLink>
			</div>
		);
	}
	return(
		<div id="content">
			<p id="general-title">{term}的相關結果：</p>
			<Cards data={List} />
		</div>
	);
};

export default Define;