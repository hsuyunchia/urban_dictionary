import "./App.css";
import React, { useState, createContext, useEffect } from "react";
import { NavLink, Switch, Route, HashRouter, Redirect, useHistory } from "react-router-dom";
import { MUT_USER_LOGIN } from "./graphql";
import { Button } from "@material-ui/core";
import { useMutation, useQuery, useSubscription } from "@apollo/react-hooks";
import { Space, Input, AutoComplete } from "antd";
import { QUE_GET_VOCAB_OPTIONS, SUB_NEW_VOCAB_OPTIONS } from "./graphql";

import Add from "./Components/Add";
import NotLogin from "./Components/NotLogin";
import NotLoginAdd from "./Components/NotLoginAdd";
import SuccessAdd from "./Components/SuccessAdd";
import User from "./Containers/User";
import Home from "./Containers/Home";
import Author from "./Containers/Author";
import Define from "./Containers/Define";
import Modify from './Containers/Modify';
import GoogleBtn from "./Components/GoogleBtn";
import icon from "./imgs/icon.png";
import Message from "./Hooks/Message";

export const UserInfo = createContext();

function App() {
  const l = localStorage.getItem("login");
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  const image = localStorage.getItem("image");
  const pen = localStorage.getItem("pen");

  const [userName, setuserName]=useState(name || undefined);
  const [userEmail, setuserEmail]=useState(email || undefined);
  const [imageUrl,setImageUrl]=useState(image || "");
  const [userpenName, setuserpenName]=useState(pen || undefined);
  const [isLogin, setisLogin]=useState(l || false);
  const [searchWord, setSearchWord]=useState("");
  const [hideInput, setHideInput] = useState(false);
  const [allOptions, setAllOptions] = useState([])
  const [options, setOptions] = useState(allOptions)

  const [startLogin] = useMutation(MUT_USER_LOGIN);
  const { loading, error, data } = useQuery(QUE_GET_VOCAB_OPTIONS, {fetchPolicy: "network-only"});
  const inputField = React.useRef(null);
  const autocomplete = React.useRef(null);

  useEffect(()=>{
    if(data){
      setAllOptions(data.getVocabOptions);
      setOptions(data.getVocabOptions);
    }
  }
  , [data]);

  const sub = useSubscription(SUB_NEW_VOCAB_OPTIONS);
  useEffect(()=>{
    if(sub.data){
      setAllOptions(sub.data.newVocabOptions);
      setOptions(sub.data.newVocabOptions)
    }
  }, [sub.data])

  const onsearch = (value)=>{
    setSearchWord(value);
    const op = allOptions.filter((obj)=>{
      return obj.value.includes(value)
    });
    op.sort();
    let ataru = 0;
    for(let i = 0; i < op.length; i++){
      if(op[i].value === value){
        ataru = i;
        break;
      }
    }
    let opp = [];
    if(op.length !== 0){
      opp.push(op[ataru]);
      for(let i = 0; i < op.length; i++){
        if(i !== ataru){
          opp.push(op[i]);
        }
      }
    }
    setOptions(opp);
  }

	const login = async (googleUser) => {
		const profile = googleUser.getBasicProfile();
		setuserName(profile.getName());
		setuserEmail(profile.getEmail());
    setImageUrl(profile.getImageUrl());
		setisLogin(true);
    const res = await startLogin({variables: {name: profile.getName(), email: profile.getEmail()}});
    setuserpenName(res.data.userLogin.penName);

    localStorage.setItem("login", true);
    localStorage.setItem("name", profile.getName());
    localStorage.setItem("email", profile.getEmail());
    localStorage.setItem("image", profile.getImageUrl());
    localStorage.setItem("pen", res.data.userLogin.penName);
  }

	const logout = () => {
		setuserName(undefined);
    setuserEmail(undefined);
		setisLogin(false);
    setuserpenName(undefined);
    setImageUrl("");
    localStorage.clear();

    Message({status: "success", msg: "登出成功！"});
    <Redirect exact={true} from="/user" to="/home" />
	}

  const queryAgain = async () => {
		const res = await startLogin({variables: {name: userName, email: userEmail}});
    setuserpenName(res.data.userLogin.penName);
	}

  return (
		<HashRouter>
    {/* <BrowserRouter> */}
      <UserInfo.Provider value={{name: userName, email: userEmail, penName:userpenName, setPenName:setuserpenName, setHideInput, setSearchWord}}>
        <div className="background">
          <div className="header">
            <div className="row-title">
              <button className="homeBtn">
                <NavLink className="homeBtn" to={{pathname: "/home", state: {email: (isLogin ? userEmail : null)}}}><img id="icon" alt='首頁icon按鈕' src={icon} /></NavLink>
              </button>
              <div className="row-title-bottons">
                <Space size={18}>
                  {isLogin
                    ? <NavLink to="/add"><Button className="botton">我要定義詞語</Button></NavLink>
                    : null
                  }
                  {isLogin
                    ? <NavLink to="/user"><Button className="botton">{userName}<img id="profileImage" src={imageUrl} /></Button></NavLink>
                    : null
                  }
                  <GoogleBtn className="botton" login={login} logout={logout} isLogined={isLogin}></GoogleBtn>
                </Space>
              </div>
            </div>
            {hideInput
              ? null
              : <div className="row-bar">
                <Route render={({history}) => (
                  <AutoComplete
                    className="search-bar"
                    value={searchWord}
                    options={options}
                    ref={autocomplete}
                    backfill
                    onFocus={() => {
                      // console.log("onFocus", autocomplete.current.value);
                      if(searchWord.length===0){
                        setOptions(allOptions);
                      }
                      else{
                        onsearch(searchWord);
                      }
                    }}
                    onSearch={onsearch}
                    onSelect={(term) => {
                      // if(term.length===0){
                      //   Message({status: "warning", msg: "請輸入搜尋內容！"});
                      //   return;
                      // }
                      const path = "/define/" + term;
                      history.push(path);

                      setSearchWord(term);
                      setOptions(allOptions);
                      //console.log("autocomplete", autocomplete);
                    }}
                  >
                    <Input.Search size="large"
                      placeholder="嗨？ 想找甚麼ㄋ？"
                      className="search-bar"
                      ref={inputField}
                      onSearch={(term) => {
                        if(term.length===0){
                          Message({status: "warning", msg: "請輸入搜尋內容！"});
                          return;
                        }
                        setOptions([]);
                        const path = "/define/" + term;
                        history.push(path);
                        setSearchWord(term);
                        //console.log("inputField", inputField.current);
                        // setTimeout(autocomplete.current.blur(), 10);
                        // inputField.current.blur();
                        // autocomplete.current.blur();
                      }}
                    enterButton />
                  </AutoComplete>
                )} />
              </div>
            }
          </div>
          <Switch>
            <Route exact={true} path="/define" component={Define} />
            <Route exact={false} path="/define/:term?" component={Define} />
            <Route exact={true} path="/add" component={Add} />
            <Route exact={true} path="/add/notLogin" component={NotLoginAdd} />
            <Route exact={true} path = "/add/success" component={SuccessAdd} />
            <Route exact={true} path="/user" render={()=>(<User afunction={queryAgain} />)} />
            <Route exact={true} path="/user/notLogin" component={NotLogin} />
            <Route exact={true} path="/" component={Home} />
            <Route exact={true} path="/author" component={Author} />
            <Route exact={false} path="/author/:penname?" component={Author} />
            <Route exact={true} path="/user" component={Modify} />
            <Route exact={false} path="/user/:postid?" component={Modify} />
            <Redirect exact={true} from="/home" to="/" />
          </Switch>
          <div className="footer" />
        </div>
      </UserInfo.Provider>
		{/* </BrowserRouter>      */}
    </HashRouter>
  );
}

export default App;