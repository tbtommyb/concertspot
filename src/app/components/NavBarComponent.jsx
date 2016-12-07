
import React from "react";
import { Link } from "react-router";

require("../styles/NavBar.scss");

const NavBar = props => {
    return (
        <nav>
            <ul className="nav-bar">
                <li className="sub-nav">
                    <ul>
                        <li><Link to={"/"} className="logo">ConcertSpot</Link></li>
                        <li><Link to={"/events"}>events</Link></li>
                        <li><Link to={"/contact"}>contact</Link></li>
                    </ul>
                </li>
            </ul>
        </nav>
    );
};

NavBar.displayName = "NavBar";
NavBar.propTypes = {};

export default NavBar;
