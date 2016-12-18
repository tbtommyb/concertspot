import React from "react";

require("../styles/Marker.scss");

export default (props) => {
    return (
        <div className="marker">
            {props.text}
        </div>
    );
};
