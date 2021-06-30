import "./App.css";
import React, { useState, createContext, useContext, useEffect } from "react";
import { NavLink, Switch, Route, BrowserRouter, Redirect, useHistory } from "react-router-dom";
import { MUT_USER_LOGIN } from "./graphql";
import { Button } from "@material-ui/core";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Space, Input, AutoComplete } from "antd";
import { QUE_GET_VOCAB_OPTIONS } from "./graphql";

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
  const [startLogin] = useMutation(MUT_USER_LOGIN);
  const [userName, setuserName]=useState(undefined);
  const [userEmail, setuserEmail]=useState(undefined);
  const [imageUrl,setImageUrl]=useState("");
  const [userpenName, setuserpenName]=useState(undefined);
  const [searchWord, setSearchWord]=useState("");
	const [isLogin, setisLogin]=useState(false);
  const [hideInput, setHideInput] = useState(false);
  const [allOptions, setAllOptions] = useState([])
  const [options, setOptions] = useState(allOptions)
  const { loading, error, data } = useQuery(QUE_GET_VOCAB_OPTIONS);

  useEffect(()=>{
    if(data){
      setAllOptions(data.getVocabOptions);
      setOptions(data.getVocabOptions);
    }
  }
  , [data])

  const onsearch = (value)=>{
    setSearchWord(value);
    const op = allOptions.filter((obj)=>{
      return obj.value.includes(value)
    })
    console.log("options", op)
    setOptions(op);
  }

	const login = async (googleUser) => {
		const profile = googleUser.getBasicProfile();
		setuserName(profile.getName());
		setuserEmail(profile.getEmail());
    setImageUrl(profile.getImageUrl());
		setisLogin(true);
    const res = await startLogin({variables: {name: profile.getName(), email: profile.getEmail()}});
    setuserpenName(res.data.userLogin.penName);
  }

	const logout = () => {
		setuserName("");
    setuserEmail("");
		setisLogin(false);
    setuserpenName(undefined);
    Message({status: "success", msg: "登出成功！"});
    <Redirect exact={true} from="/user" to="/home" />
	}

  const queryAgain = async () => {
		const res = await startLogin({variables: {name: userName, email: userEmail}});
    setuserpenName(res.data.userLogin.penName);
	}

  return (
		<BrowserRouter>
      <UserInfo.Provider value={{name: userName, email: userEmail, penName:userpenName, setPenName:setuserpenName, setHideInput}}>
        <div className="background">
          <div className="header">
            <div className="row-title">
              <button className="homeBtn">
                <NavLink className="homeBtn" to={{pathname: "/home", state: {email: (isLogin ? userEmail : null)}}}><img id="icon" src={icon} /></NavLink>
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
              ? <></>
              : <div className="row-bar">
                <Route render={({history}) => (
                  <AutoComplete
                    className="search-bar"
                    value={searchWord}
                    options={options}
                    onSearch={onsearch}
                    onSelect={(term) => {
                      if(term.length===0){
                        Message({status: "warning", msg: "請輸入搜尋內容！"});
                        return;
                      }
                      // const path = "/define/" + term;
                      // history.push({
                      //   pathname: path,
                      //   state: {
                      //     pen: userpenName,
                      //     name: userName,
                      //     email: userEmail,
                      //   },
                      // });
                      setSearchWord(term);
                      setOptions(allOptions);
                    }}
                  >
                    <Input.Search size="large" placeholder="嗨？ 想找甚麼ㄋ？" className="search-bar"
                      onSearch={(term) => {
                        if(term.length===0){
                          Message({status: "warning", msg: "請輸入搜尋內容！"});
                          return;
                        }
                        const path = "/define/" + term;
                        history.push({
                          pathname: path,
                          state: {
                            pen: userpenName,
                            name: userName,
                            email: userEmail,
                          },
                        });
                        setSearchWord("");
                        setOptions(allOptions);
                      }}
                    enterButton />
                  </AutoComplete>

                  // <Input.Search
                  //   className="search-bar"
                  //   placeholder="嗨？ 想找甚麼ㄋ？"
                  //   enterButton="搜尋"
                  //   size="large"
                  //   value={searchWord}
                  //   onChange={(e) => {
                  //     setSearchWord(e.target.value);
                  //   }}
                  //   onSearch={(term) => {
                  //     if(term.length===0){
                  //       Message({status: "warning", msg: "請輸入搜尋內容！"});
                  //       return;
                  //     }
                  //     const path = "/define/" + term;
                  //     history.push({
                  //       pathname: path,
                  //       state: {
                  //         pen: userpenName,
                  //         name: userName,
                  //         email: userEmail,
                  //       },
                  //     });
                  //     setSearchWord("");
                  //   }}
                  // ></Input.Search>
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
		</BrowserRouter>     
	);
}

export default App;