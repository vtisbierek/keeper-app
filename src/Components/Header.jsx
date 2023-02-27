import React from 'react';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import Login from "./Login";
import Logout from "./Logout";

function Header(props){
    return (
        <header>
            <div className="row">
                <div className="col-6">
                    <h1>
                        <StickyNote2Icon />
                        {props.name}
                    </h1>
                </div>
                <div className="col-6 login-panel">
                    {/* {props.isReady && <img height="50px" width="50px" src={props.imgURL} style={{verticalAlign: "bottom", margin: "5px", borderRadius: "50%"}} />} */}
                    <Logout isReady={props.isReady} imgURL={props.imgURL} userName={props.userName} handleLogout={() => props.handleLogout()} />
                    <Login isReady={props.isReady} handleLogin={() => props.handleLogin()} />
                </div>
            </div>
        </header>
    );
}

export default Header;