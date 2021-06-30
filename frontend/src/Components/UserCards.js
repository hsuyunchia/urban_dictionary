import React, { useEffect, useState, useContext } from "react";
import { useQuery } from "@apollo/react-hooks";

import { UserInfo } from "../App";
import Cards from "../Containers/Cards";
import { QUE_QUERY_MY_POST } from "../graphql";

const UserCards = () => {
	const userInfo = useContext(UserInfo);
	const { loading, error, data } = useQuery(QUE_QUERY_MY_POST, {variables: {email: userInfo.email}, fetchPolicy: "network-only"});

	// console.log("data", data);
	// console.log("error", error);
	// console.log("loading", loading);
	if( loading || !data ){
		return(
			<div className="title">
				你目前定義過的詞語：
				<div className="footer" style={{height:"2rem"}} />
				<p>載入中...</p>
			</div>
		);
	}
	return(
		<div className="title">
			你目前定義過{data.queryMyPost.length}個詞語：
			<div className="footer" style={{height:"2rem"}} />
			<Cards data={data.queryMyPost} />
		</div>
	)
}
	
export default UserCards;