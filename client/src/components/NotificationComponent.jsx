import React from "react";
import PropTypes from "prop-types";

import "../styles/Notification.scss";

const Notification = props => {
    const { message } = props;

    return (
        <div className="notification-wrapper">
            <div className={"notification"}>
                <p>{message}</p>
            </div>
        </div>
    );
};

Notification.displayName = "Notification";
Notification.propTypes = {
    message: PropTypes.string,
    loading: PropTypes.bool
};

export default Notification;
