import { NavLink,  Redirect } from "react-router-dom";
import { Button } from "@material-ui/core";
import { UserInfo } from "../App";
import { useContext, useEffect } from "react";

const SuccessAdd = ()=>{
	const userInfo = useContext(UserInfo);

	useEffect(() => {
		userInfo.setHideInput(true);
		userInfo.setSearchWord("");
	}, []);
	if(!userInfo.email){
		return(
			<Redirect exact={true} from="/add/success" to="/home" />
		)
	}
	
	//console.log("[SuccessAdd]", userInfo)
	return(
		<div className="add">
			<div className="add-close">
				<NavLink to="/home">
					<Button variant="contained" color="primary" className="botton" >回首頁</Button>
				</NavLink>
			</div>
			<div className="add-title" style={{marginTop:"5rem"}}>
                <p>恭喜你，成功定義啦！</p>
				<NavLink to="/add">
						<u style={{color:"#cbdce7", fontSize:"24px"}}>再來一個</u>
				</NavLink>
			</div>
		</div>
	);
}

export default SuccessAdd;