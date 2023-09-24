import React from "react";

// assets
import "./Banner.css"
import atm from './atm.svg'
import user from './user.svg'
import iconLight from './sun.svg'
import iconDark from './moon.svg'

// links
import { Link } from "react-router-dom";

function Banner(props) {
    return (
        <div className="banner">
            
            <Link className="home-btn" to="/">
                <img src={atm} alt="Logo" width="45px"/>
                <p>Tablero de control web</p>
            </Link>

            <div className="banner-right">
                <Link className="user-btn" to="/">
                    <img src={user} alt="Usuario" width="35px" />
                    <p>Admin</p>
                </Link>

                <div className="theme-switcher" onClick={() => props.switchModeFn()} >
                    <img src={props.darkMode ? iconDark : iconLight} alt="Tema" width="30px"/>
                </div>
            </div>
        </div>
    )
}

export default Banner