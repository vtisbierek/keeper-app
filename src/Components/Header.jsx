import React from 'react';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';

function Header(props){
    return (
        <header>
            <h1>
                <StickyNote2Icon />
                 {props.name}
            </h1>
        </header>
    );
}

export default Header;