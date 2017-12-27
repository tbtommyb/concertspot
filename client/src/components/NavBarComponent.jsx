import React from "react";
import { Link } from "react-router";

require("../styles/NavBar.scss");

const NavBar = props => {
    return (
        <nav>
            <ul>
                <li className="subnav left">
                    <ul>
                        <li className="subnav-item"><Link to={"/"} className="logo">ConcertSpot</Link></li>
                        <li className="subnav-item"><Link to={"/events"}>events</Link></li>
                        <li className="subnav-item"><Link to={"/contact"}>contact</Link></li>
                    </ul>
                </li>
            </ul>
        </nav>
    );
};

NavBar.displayName = "NavBar";
NavBar.propTypes = {};

export default NavBar;
