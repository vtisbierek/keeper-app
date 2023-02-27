import React from 'react';
import Zoom from '@mui/material/Zoom';

function Logout(props){
    return (
        <Zoom in={props.isReady}>
            <div className="logout">
                {props.isReady &&
                <span>{props.userName} </span>
                }
                {props.isReady &&
                <img src={props.imgURL} />
                }
                {props.isReady &&
                <span> </span>
                }
                {props.isReady &&
                <button className="btn btn-outline-secondary" onClick={() => props.handleLogout()} >LOGOUT</button>
                }
            </div>
        </Zoom>
    );
}

export default Logout;