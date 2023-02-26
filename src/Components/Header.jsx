import React from 'react';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import Login from "./Login";

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
                    <Login handleLogin={() => props.handleLogin()} />
                </div>
            </div>
        </header>
    );
}

export default Header;