import { useState, useContext } from "react";
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
	// console.log("check", check);
	const userInfo = useContext(UserInfo);
	userInfo.setHideInput(true);
	// console.log("[User] UserInfo", userInfo);
	if(!userInfo.email){
		return(
			<Redirect exact={true} from="/add" to={{pathname: "/add/notLogin", state: {wordToBeDefine: check.state.wordToBeDefine}}} />
		);
	}
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
		if(vocab.length === 0){
			msg += "   詞語";
			ok = false;
		}
		if(explanation.length === 0){
			msg += "   解釋";
			ok = false;
		}
		if(example.length === 0){
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
					vocabulary: vocab,
					explanation,
					example
				}
			})
			if(res.data.createPost){
				if(res.data.createPost.vocabulary === vocab){
					// Message({status: "success", msg: "恭喜，成功定義你的詞語！"})
					setVocab("");
					setExplanation("");
					setExample("");
					return(
						history.push({
							pathname: "/add/success",
							// state: { pen: check.state.pen ,name:check.state.name, email:check.state.email }
						})
						// <Redirect exact={true} from="/add" to={{
						// 	pathname:"/add/success", 
						// 	state:{ pen: check.state.pen ,name:check.state.name, email:check.state.email}
						// }} />
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
		// console.log("check.state.wordToBeDefine", check.state.wordToBeDefine);
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
				<div className="title">想定義什麼詞呢? (必填)</div>
				<Input placeholder="想定義什麼詞呢?" className="input" value={vocab} onChange={(e) => {setVocab(e.target.value.trim());}}></Input>
				<div className="title">它代表什麼意思? (必填)</div>
				<Input.TextArea placeholder="它代表什麼意思?" rows={4} className="input" value={explanation} onChange={(e) => {setExplanation(e.target.value.trim());}}></Input.TextArea>
				<div className="title">造一個句子吧！ (必填)</div>
				<Input.TextArea placeholder="造一個句子吧！" rows={2} className="input" value={example} onChange={(e) => {setExample(e.target.value.trim());}} ></Input.TextArea>
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