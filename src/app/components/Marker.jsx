import React from "react";
import InlineCSS from "react-inline-css";

const styling = require("!raw!css!../styles/Marker.scss");
const activeIcon = require("../images/orange-marker-small.png");
const inactiveIcon = require("../images/blue-marker-small.png");

export default (props) => {
    const handleClick = () => {
        props.handleClick({
            id:props.id,
            active: props.active
        });
    };
    return (
        <InlineCSS componentName="Marker" stylesheet={styling}>
            <img src={props.active ? activeIcon : inactiveIcon}
                className="marker"
                onClick={handleClick}>
            </img>
        </InlineCSS>
    );
};
