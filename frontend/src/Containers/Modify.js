import { useState, useContext, useEffect } from "react";
import { NavLink, Redirect, useHistory, useParams } from "react-router-dom";
import { useMutation, useQuery } from '@apollo/react-hooks';
import Message from '../Hooks/Message';
import { MUT_MODIFY_POST, QUE_QUERY_BY_ID } from '../graphql';
import { Button } from '@material-ui/core';
import { Input } from 'antd';
import { UserInfo } from '../App'

const Modify = ()=>{
	const { postid }= useParams();
    const userInfo = useContext(UserInfo);
	userInfo.setHideInput(true);

    const { loading, error, data } = useQuery(QUE_QUERY_BY_ID,{variables: {id: postid},fetchPolicy: "cache-and-network"})
    const [modPost] = useMutation(MUT_MODIFY_POST);
    const [vocab, setVocab] = useState("");
	const [explanation, setExplanation] = useState("");
	const [example, setExample] = useState("");
	let history = useHistory();

    useEffect(()=>{
        if(data){
            console.log('effect')
            setVocab(data.queryById.vocabulary)
            setExplanation(data.queryById.explanation)
            setExample(data.queryById.example)}
    },[data]
    )
    console.log("data in mod",data);
	console.log("error in mod",error);
	console.log("loading",loading)
	if((!loading && data && data.queryById.author.email!==userInfo.email)){
        console.log('case A')
        return <Redirect to="/home"/> 
    }
	
    if(!userInfo.penName){
        console.log('case C')
        return <Redirect to="/home"/> 
    }	
	
	const handleCreate = async ()=>{
		let msg = "請填寫 "
		let ok = true;
		if(vocab.length === 0){
			msg += "   詞語"
			ok = false
		}
		if(explanation.length === 0){
			msg += "   解釋"
			ok = false
		}
		if(example.length === 0){
			msg += "   例句"
			ok = false
		}
		if(!ok){
			Message({status: "warning", msg});
		}
		else{
			const res = await modPost({
				variables:{
					id: postid,
					vocab: vocab,
					explan: explanation,
					example: example
				}
			})
			if(res.data.modifyPost.success){
				Message({status:"success",msg:"修改成功！"})
                setVocab("")
                setExplanation("")
                setExample("")
				return(
                    history.push({
                        pathname: '/user'
                    })
                )
			}
			else{
				Message({status: "error", msg:res.data.modifyPost.message})
            }
		}
	}

	return(
		<div className="add">
			<div className="add-close">
				<NavLink to="/home">
					<Button variant="contained" color="primary" className="botton" >回首頁</Button>
				</NavLink>
			</div>
			<div className="add-title">
				來修改你的詞語吧！ 
			</div>
			<div className="add-form">
				<div className="title">想定義什麼詞呢? (必填)</div>
				<Input placeholder="想定義什麼詞呢?" className="input" value={vocab} onChange={(e) => {setVocab(e.target.value.trim())}}></Input>
				<div className="title">它代表什麼意思? (必填)</div>
				<Input.TextArea placeholder="它代表什麼意思?" rows={4} className="input" value={explanation} onChange={(e) => {setExplanation(e.target.value.trim())} }></Input.TextArea>
				<div className="title">造一個句子吧！ (必填)</div>
				<Input.TextArea placeholder="造一個句子吧！" rows={2} className="input" value={example} onChange={(e) => {setExample(e.target.value.trim())}} ></Input.TextArea>
				{/* <div className="title">為它新增一些標籤吧~</div>
				<Input.TextArea placeholder="為它新增一些標籤吧！" rows={2} className="input"></Input.TextArea> */}
				<div className="footer">
					<Button variant="contained" color="primary" className="botton" onClick={handleCreate}>我填完了！</Button>
				</div>
			</div>
			<div className="add-close"></div>
			
		</div>
	);
}

export default Modify;