import React, { Component } from 'react'
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import Message from '../Hooks/Message';
import { NavLink } from "react-router-dom";


const CLIENT_ID = '696468782740-2vesa30iij2dnu0hkn4e0vflehu240hk.apps.googleusercontent.com';


class GoogleBtn extends Component {
   constructor(props) {
    super(props);

    this.state = {
      isLogined: false
    };

    this.login = this.login.bind(this);
    this.handleLoginFailure = this.handleLoginFailure.bind(this);
    this.logout = this.logout.bind(this);
    this.handleLogoutFailure = this.handleLogoutFailure.bind(this);
  }

  login (googleUser) {
    const profile = googleUser.getBasicProfile();
    console.log('Name: ' + profile.getName());
    if(profile){
      this.setState(state => ({
        isLogined: true
      }));
    }
    this.props.login(googleUser);
  }

  logout (response) {
    this.setState(state => ({
      isLogined: false
    }));
    this.props.logout();
  }

  handleLoginFailure (response) {
    Message({status:'warning', msg:'登入失敗'})
  }

  handleLogoutFailure (response) {
    Message({status:'warning', msg:'登出失敗'})
  }

  render() {
    return (
    <>
      { this.props.isLogined ?
        <NavLink  to="/home"><GoogleLogout
          clientId={ CLIENT_ID }
          buttonText='登出'
          onLogoutSuccess={ this.props.logout }
          onFailure={ this.handleLogoutFailure }
          style={{backgroundColor:"transparent"}}
        />
        </NavLink>: <GoogleLogin
          clientId={ CLIENT_ID }
          isLogined={true}
          buttonText='以GOOGLE登入'
          onSuccess={ this.props.login }
          onFailure={ this.handleLoginFailure }
          cookiePolicy={ 'single_host_origin' }
          responseType='code,token'
          style={{backgroundColor:"transparent"}}
        />
      }
      {/* { this.state.accessToken ? <h5>Your Access Token: <br/><br/> { this.state.accessToken }</h5> : null } */}

    </>
    )
  }
}

export default GoogleBtn;