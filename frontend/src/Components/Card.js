import { useState, useContext, useEffect } from "react";
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

	const [add_agree] = useMutation(MUT_ADD_AGREE);
	const [add_disagree] = useMutation(MUT_ADD_DISAGREE);

	const { data, loading } = useSubscription(
		SUB_SUBSCRIBE_CARD,
		{variables: {post_id}}
	);
	
	useEffect(()=>{
		if(data){
			if(data.subscribeCard.success){
				setAgreeList(data.subscribeCard.agree_users);
				setDisgreeList(data.subscribeCard.disagree_users);
			}
		}
	}, [data, loading])
	
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
			<div className="meaning">釋義：{explanation}</div>
			<div className="example">例句：{example}</div>
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