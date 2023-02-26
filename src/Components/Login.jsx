import React from 'react';
import { GoogleLoginButton } from "react-social-login-buttons";

function Login(props){
    return (
    <GoogleLoginButton style={{width : "50px", borderRadius : "50%", display : "inline-block"}} iconSize="30px" onClick={() => {
        props.handleLogin()
    }}>
        <span></span>
    </GoogleLoginButton>);
}

export default Login;