
import React, { PropTypes } from "react";

require("../styles/Notification.scss");

const Notification = props => {
    const { message, loading } = props;

    return (
        <div className="notification-wrapper">
            <div className={loading ? "loader" : "notification"}>
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
