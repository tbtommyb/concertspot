import React from "react";
import InlineCSS from "react-inline-css";

const styling = require("!raw!sass!../styles/LoadingBar.scss");

const LoadingBar = props => {
    return (
        <InlineCSS componentName="LoadingBar" stylesheet={styling}>
            <div className={props.active ? "load-bar" : "load-bar hidden"}>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </div>
        </InlineCSS>
    );
};

LoadingBar.displayName = "LoadingBar";
LoadingBar.propTypes = {};

export default LoadingBar;
