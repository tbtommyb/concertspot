import React from "react";
import PropTypes from "prop-types";

import "../styles/LoadingBar.scss";

const LoadingBar = props => {
    return (
        <div className={props.active ? "load-bar" : "load-bar is-hidden"}>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
        </div>
    );
};

LoadingBar.displayName = "LoadingBar";
LoadingBar.propTypes = {};

export default LoadingBar;
