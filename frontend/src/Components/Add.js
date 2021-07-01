import { useState, useEffect, useContext } from "react";
import { NavLink, Redirect, useLocation, useHistory } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { Button } from "@material-ui/core";
import { Input } from "antd";

import { UserInfo } from "../App";
import Message from "../Hooks/Message";
import { MUT_CREATE_POST } from "../graphql";

const Add = () => {
	const [vocab, setVocab] = useState("");
	const [explanation, setExplanation] = useState("");
	const [example, setExample] = useState("");
	const [addPost] = useMutation(MUT_CREATE_POST);
	
	let history = useHistory();
	const check = useLocation();
	const userInfo = useContext(UserInfo);
	useEffect(() => {
		userInfo.setHideInput(true);
		userInfo.setSearchWord("");
	}, []);
	//console.log("[User] UserInfo", userInfo);

	if(!userInfo.email){
		if(!check.state){
			return(
				<Redirect exact={true} from="/add" to={{pathname: "/add/notLogin", state: {wordToBeDefine: ""}}} />
			);
		}
		else{
			return(
				<Redirect exact={true} from="/add" to={{pathname: "/add/notLogin", state: {wordToBeDefine: check.state.wordToBeDefine}}} />
			);
		}
	}
	console.log(userInfo.penName);
	console.log(typeof(userInfo.penName));
	if(!userInfo.penName){
		return(
			<div className="add">
				<div className="add-close">
					<NavLink to="/home">
						<Button variant="contained" color="primary" className="botton" >回首頁</Button>
					</NavLink>
				</div>
				<div className="add-title" style={{marginTop: "5rem"}}>
					<p>你還ㄇ有筆名ㄝ！</p>
					<NavLink to="/user">
						{/* <Button style={{color:"#cbdce7"}}>去加筆名</Button> */}
						<u style={{color: "#cbdce7", fontSize: "24px"}}>新增筆名</u>
					</NavLink>
				</div>
			</div>
		);
	}

	const handleCreate = async () => {
		let msg = "請填寫 ";
		let ok = true;
		if(vocab.trim().length === 0){
			msg += "   詞語";
			ok = false;
		}
		if(explanation.trim().length === 0){
			msg += "   解釋";
			ok = false;
		}
		if(example.trim().length === 0){
			msg += "   例句";
			ok = false;
		}
		if(!ok){
			Message({status: "warning", msg});
		}
		else{
			const res = await addPost({
				variables: {
					email: userInfo.email,
					vocabulary: vocab.trim(),
					explanation: explanation.trim(),
					example: example.trim()
				}
			})
			if(res.data.createPost){
				if(res.data.createPost.vocabulary === vocab.trim()){
					setVocab("");
					setExplanation("");
					setExample("");
					return(
						history.push({
							pathname: "/add/success",
						})
					)
				}
			}
			else{
				Message({status: "error", msg: "發生不明錯誤...請再試一次"});
			}
		}
	}
	// console.log("vocab", vocab);
	if(check.state){
		if(vocab !== check.state.wordToBeDefine && check.state.wordToBeDefine !== undefined){
			setVocab(check.state.wordToBeDefine);
		}
		check.state = null;
	}

	return(
		<div className="add">
			<div className="add-close">
				<NavLink to="/home">
					<Button variant="contained" color="primary" className="botton">回首頁</Button>
				</NavLink>
			</div>
			<div className="add-title">
				來定義你的詞語吧！ 
			</div>
			<div className="add-form">
				<div className="title">想定義什麼詞語呢？</div>
				<Input placeholder="想定義什麼詞語呢?" className="input" value={vocab} onChange={(e) => {setVocab(e.target.value);}}></Input>
				<div className="title">它的解釋是什麼呢？</div>
				<p className="description">以「 [[[ 」和「 ]]] 」框住想連結的詞語，例如 [[[一些東西]]] 即可連結到 <NavLink to="/define/一些東西">一些東西</NavLink>！</p>
				<Input.TextArea placeholder="它的解釋是什麼呢?" rows={4} className="input" value={explanation} onChange={(e) => {setExplanation(e.target.value);}}></Input.TextArea>
				<div className="title">造一個例句吧！</div>
				<p className="description">以「 [[[ 」和「 ]]] 」框住想連結的詞語，例如 [[[一些東西]]] 即可連結到 <NavLink to="/define/一些東西">一些東西</NavLink>！</p>
				<Input.TextArea placeholder="造一個例句吧！" rows={2} className="input" value={example} onChange={(e) => {setExample(e.target.value);}} ></Input.TextArea>
				{/* <div className="title">為它新增一些標籤吧~</div>
				<Input.TextArea placeholder="為它新增一些標籤吧！" rows={2} className="input"></Input.TextArea> */}
				<div className="footer">
					<Button variant="contained" color="primary" className="botton" onClick={handleCreate}>我填完了！</Button>
				</div>
			</div>
			<div className="add-close"></div>
		</div>
	);
};

export default Add;