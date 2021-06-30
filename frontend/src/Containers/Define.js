import React, { useEffect, useState, useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { NavLink, useParams, useLocation } from "react-router-dom";
import { Button } from "@material-ui/core";

import Cards from "../Containers/Cards";
import { QUE_QUERY_BY_VOCABULARY } from "../graphql";
import { UserInfo } from "../App";

const Define = () => {
	const [List, setList] = useState([]);
	const { term } = useParams();
	const userInfo = useContext(UserInfo);
	const { loading, error, data } = useQuery(QUE_QUERY_BY_VOCABULARY, {variables: {vocabulary: term}, fetchPolicy: "network-only"});
	useEffect(()=>{userInfo.setHideInput(false);})
	useEffect(() => {
		if(data) setList(data.queryByVocabulary);
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
			<div className="add">
			<div className="add-close">
				<NavLink to="/home">
					<Button variant="contained" color="primary" className="botton" >回首頁</Button>
				</NavLink>
			</div>
			<div className="add-title" style={{marginTop:"5rem"}}>
                <p>ㄟ(￣▽￣ㄟ) 找不到 找不到 (ㄏ￣▽￣)ㄏ</p>
				<NavLink to={{pathname: "/add", state: {wordToBeDefine: term}}}>
						<u style={{color:"#cbdce7", fontSize:"24px"}}>來去定義   {term}</u>
				</NavLink>
			</div>
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