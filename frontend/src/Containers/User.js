import React, { useState, useEffect, useContext } from "react";
import { NavLink, Switch, Route, Redirect, useLocation } from "react-router-dom";
import { Input } from "antd";
import { Button } from "@material-ui/core";
import { useMutation, useQuery } from "@apollo/react-hooks";

import { MUT_MODIFY_PEN_NAME, MUT_USER_LOGIN, QUE_QUERY_BY_USER } from "../graphql";
import Message from "../Hooks/Message";
import UserCards from "../Components/UserCards";
import { UserInfo } from "../App";

function User ({afunction}){
	const userInfo = useContext(UserInfo);
	

	const [startModPen] = useMutation(MUT_MODIFY_PEN_NAME);

	const [showMsg, setshowMsg] = useState(false);
	const [Msg, setMsg] = useState("");
	// const [Pen, setPen]=useState(userInfo.pen);
	const [changePenName, setChanegPenName] = useState(false);

	useEffect(()=>{userInfo.setHideInput(true);})
	
	if(!userInfo.email){
		return(
			<Redirect exact={true} from="/user" to="/user/notLogin" />
		);
	}

	return(
		<>
		<div className="add-close">
			<NavLink to={{pathname:"/home", state:{ email: userInfo.email}}}>
				<Button variant="contained" color="primary" className="botton">回首頁</Button>
			</NavLink>
		</div>
		<div id="user">
			<div className="component">
				<div className="padding" />
				<div className="title">
					{(userInfo.penName)
						? <p>{userInfo.name}，你目前的筆名為：{userInfo.penName}</p>
						: <p>{userInfo.name}，你ㄇ有筆名喔</p>
					}
				</div>
				{changePenName
					? <Input.Search
						color="aliceblue"
						style={{width: "50%", color: "aliceblue"}} 
						placeholder="嗨，你想叫啥？"
						allowClear
						enterButton="儲存"
						size="medium"
						onSearch={async (penName) => {
							const { data } = await startModPen({variables: {pen: penName, email: userInfo.email}});
							if(data.modifyPenName.success){
								userInfo.setPenName(penName);
								// setPen(penName);
								setChanegPenName(false);
								setshowMsg(false);
								Message({status: "success", msg: "成功更改筆名"});
								// userInfo.setPenName(penName)
							}
							else{
								setMsg(data.modifyPenName.message);//success
								setshowMsg(true);
								afunction();
							}
						}
					}/>
					: <Button variant="outlined" color="primary" className="botton" onClick={() => {setChanegPenName(true)}}>
						{(!userInfo.penName) ? "新增筆名" : "更改筆名"}
					</Button>
				}
				{showMsg ? <p className="msg">{Msg}</p> : <p className="msg" style={{height:"25px"}} />}
				{(userInfo.penName) ? <UserCards /> : null}
				<div className="padding" />
			</div>
		</div>
		</>
	);
};

export default  User;