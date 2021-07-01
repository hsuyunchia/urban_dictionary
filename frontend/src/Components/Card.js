import React, { useState, useContext, useEffect } from "react";
import { createChainedFunction, Typography } from "@material-ui/core";
import { ThumbUp, ThumbDown } from "@material-ui/icons";
import { Space, Input, Button } from "antd";
import { NavLink, useLocation} from "react-router-dom";
import { useMutation, useSubscription } from "@apollo/react-hooks";

import "../App.css";
import { UserInfo } from "../App";
import PublishBtn from "./PublisheBtn";
import { MUT_ADD_AGREE, MUT_ADD_DISAGREE, SUB_SUBSCRIBE_CARD } from "../graphql";
import Message from "../Hooks/Message";

const Card = ({post_id, vocabulary, author, explanation, example, tags, agree_users, disagree_users, create_date, published}) => {
	const [agreeList, setAgreeList] = useState(agree_users);
	const [disagreeList, setDisgreeList] = useState(disagree_users);
	const userInfo = useContext(UserInfo);
	let fa = false, fd = false;
	if(userInfo.email){
		fa = agree_users.includes(userInfo.email);
		fd = disagree_users.includes(userInfo.email);
	}
	const [focusAgree, setFocusAgree] = useState(fa);
	const [focusDisagree, setFocusDisagree] = useState(fd);
	const [expl, setExpl] = useState([]);
	const [exam, setExam] = useState([]);

	const [add_agree] = useMutation(MUT_ADD_AGREE);
	const [add_disagree] = useMutation(MUT_ADD_DISAGREE);

	const { data, loading } = useSubscription(
		SUB_SUBSCRIBE_CARD,
		{variables: {post_id}}
	);
	
	useEffect(() => {
		if(data){
			if(data.subscribeCard.success){
				setAgreeList(data.subscribeCard.agree_users);
				setDisgreeList(data.subscribeCard.disagree_users);
			}
		}
	}, [data, loading])

	useEffect(() => {
		const linked = linking(explanation);
		setExpl(linked);
	}, [explanation]);

	useEffect(() => {
		const linked = linking(example);
		setExam(linked);
	}, [example]);
	
	useEffect(() => {
		let fat = false;
		let fdt = false;
		if(userInfo.email){
			fat = agreeList.includes(userInfo.email);
			fdt = disagreeList.includes(userInfo.email);
		}
		setFocusAgree(fat);
		setFocusDisagree(fdt);
	}, [agreeList, disagreeList, userInfo]);

	const handleAgree = async () => {
		if(!userInfo.email){
			Message({status: "warning", msg: "你必須先登入！"});
		}
		else{
			const { data } = await add_agree(
				{variables: {post_id: post_id, email: userInfo.email}}
			);
			if(data.clickAgree.success === true){
				setAgreeList(data.clickAgree.agree_users);
				setDisgreeList(data.clickAgree.disagree_users);
			}
		}
	}
	const handleDisagree = async () => {
		if(!userInfo.email){
			Message({status: "warning", msg: "你必須先登入！"});
		}
		else{
			const { data } = await add_disagree(
				{variables: {post_id: post_id, email: userInfo.email}}
			);
			if(data.clickDisagree.success === true){
				setAgreeList(data.clickDisagree.agree_users);
				setDisgreeList(data.clickDisagree.disagree_users);
			}
		}
	}

	// const plusLink = (sentece) => {
	// 	for(let i = 0; i < sentece.length; i++){

	// 	}
	// }
	const linking = (sentence) => {
		// const link = sentence.replace("[[[", "<NavLink to='/define/");
		// const linke = link.replace(",,,", "'>");
		// const linked = linke.replace("]]]", "</NavLink>");
		const splited = sentence.split("[[[");
		//console.log(splited);
		// console.log(sentence[-1]);
		// let linked = [];
		// for (let str )
		const linked = splited.flatMap((str) => {
			if(str.length === 0){
				return [];
			}
			else if(str.endsWith("]]]") === true){
				const content = str.slice(0, -3);
				const ret = React.createElement(
					NavLink,
					{key: str+'nav_Link', to: "/define/" + content},
					content
				);
				return [ret];
			}
			else if(str.indexOf("]]]") !== -1){
				const sspp = str.split("]]]");
				const ret0 = React.createElement(
					NavLink,
					{key: str+'navLink', to: "/define/" + sspp[0]},
					sspp[0]
				);
				const ret1 = React.createElement(
					"span",
					{key:str+'_ret1'},
					sspp[1]
				);
				return [ret0, ret1];
			}
			else{
				const ret = React.createElement(
					"span",
					{key:str+'_ret'},
					str
				);
				return [ret];
			}
		});
		//console.log(linked);
		// const linked = [<NavLink to='/define/QQ'>QQ</NavLink>, <span>wertyu</span>];
		return linked;
	}

	const vocabLink = "/define/" + vocabulary;
	const authorLink = "/author/" + author.penName;
	const modifyLink = "/user/" + post_id;
	return (
		<div className="card">
			{published !== null
				? <div className="tags">
					<PublishBtn Published={published} id={post_id} modifyLink={modifyLink} />
				</div>
				: null
			}
			<div className="vocab">
				<p className="word"><NavLink to={vocabLink}>{vocabulary}</NavLink></p>
			</div>
			<div className="meaning">釋義：{expl}</div>
			<div className="example">例句：{exam}</div>
			<div className="author"> </div>
			<div className="card-footer"> 
				{focusAgree
					? <Button onClick={handleAgree} id="donofocus" style={{backgroundColor: "#b9d8ec"}} danger>
						<Space size={4}> 
							<ThumbUp color="primary" />
							<Typography variant="button" display="block" gutterBottom>{agreeList.length}</Typography>
						</Space>
					</Button>
					: <Button onClick={handleAgree} id="donofocus" danger>
						<Space size={4}> 
							<ThumbUp color="primary" />
							<Typography variant="button" display="block" gutterBottom>{agreeList.length}</Typography>
						</Space>
					</Button>
				}
				{focusDisagree
					? <Button onClick={handleDisagree} id="donofocus" style={{backgroundColor: "#b9d8ec"}} danger>
						<Space size={4}> 
							<ThumbDown color="primary" />
							<Typography variant="button" display="block" gutterBottom>{disagreeList.length}</Typography>
						</Space>
					</Button>
					: <Button onClick={handleDisagree} id="donofocus" danger>
						<Space size={4}> 
							<ThumbDown color="primary" />
							<Typography variant="button" display="block" gutterBottom>{disagreeList.length}</Typography>
						</Space>
					</Button>
				}
			</div>
			<div className="card-footer">
				{(published===null)
					? <div className="text">
						由 
						<NavLink to={authorLink}>{author.penName}</NavLink>
					</div>
					: null
				}
				<div className="text">創建於 {create_date}</div>
			</div>
		</div>
	);
};

export default Card;