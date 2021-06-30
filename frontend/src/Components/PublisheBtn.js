import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "antd";
import { useMutation } from "@apollo/react-hooks";

import { MUT_PUBLISH_POST, MUT_UNPUBLISH_POST } from "../graphql";
import Message from "../Hooks/Message";

const PublishBtn = ({Published, id, modifyLink}) => {
    const [published, setpublished] = useState(Published);
	const [startPub] = useMutation(MUT_PUBLISH_POST);
	const [startUnpub] = useMutation(MUT_UNPUBLISH_POST);
    // console.log(id);
    const unpubHandler = async () => {
        const { data } = await startUnpub({variables:{ptid: id}});
        // console.log(data);
        if(data.unpublishPost.success){
            Message({status: "success", msg: data.unpublishPost.message});
            setpublished(false);
        }
        else{
            Message({status: "error", msg: data.unpublishPost.message});
        }
    }

    const pubHandler = async () => {
        const { data } = await startPub({variables: {ptid: id}});
        // console.log(data);
        if(data.publishPost.success){
            Message({status: "success", msg: data.publishPost.message});
            setpublished(true);
        }
        else{
            Message({status: "error", msg: data.publishPost.message});
        }
    }
    return(
        published
        ? <>
            <div style={{fontSize: "18px", fontStyle: "normal", color: "darkgreen", textAlign: "center", height: "20px"}}>
                公開發布中
            </div> 
            <Button onClick={unpubHandler} id="donofocus" style={{fontWeight: 600, textAlign: "right"}} danger>點我隱藏</Button>
            {" "}<NavLink to={modifyLink}><Button id="donofocus" style={{fontWeight: 600}} danger>修改內容</Button></NavLink>{" "}
        </>
        : <>
            <div style={{fontSize: "18px", fontStyle: "normal", color: "darkred", textAlign: "center", height: "20px"}}>
                已隱藏，限本人檢視
            </div> 
            <Button onClick={pubHandler} id="donofocus" style={{fontWeight: 600}} danger>點我發佈</Button>
            {" "}<NavLink to={modifyLink}><Button id="donofocus" style={{fontWeight: 600}} danger>修改內容</Button></NavLink>{" "}
        </>      
    );
};

export default PublishBtn;