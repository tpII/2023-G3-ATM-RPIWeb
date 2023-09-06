import React from "react";

// assets
import "./Banner.css"
import atm from './atm.svg'
import user from './user.svg'
import iconLight from './sun.svg'
import iconDark from './moon.svg'

function Banner(props) {
    return (
        <div className="banner">
            <a className="home-btn" href="/">
                <img src={atm} alt="Logo" width="45px"/>
                <p>Tablero de control web</p>
            </a>

            <div className="banner-right">
                <a className="user-btn" href="/">
                    <img src={user} alt="Usuario" width="35px" />
                    <p>Admin</p>
                </a>

                <div className="theme-switcher" onClick={() => props.switchModeFn()} >
                    <img src={props.darkMode ? iconDark : iconLight} alt="Tema" width="30px"/>
                </div>
            </div>
        </div>
    )
}

export default Banner