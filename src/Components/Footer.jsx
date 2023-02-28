import React from 'react';

function Footer(){
    const currentYear = new Date().getFullYear();

    return (
        <footer>
            <p>copyright {currentYear} VTisbierek</p>
        </footer>
    );
}

export default Footer;