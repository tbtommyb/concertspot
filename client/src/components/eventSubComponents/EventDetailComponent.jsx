import React from "react";
import PropTypes from "prop-types";
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

const EventDetail = props => {
    const { type, content, icon } = props;

    return (
        <div className="table">
            <span className="screen-reader">{type}</span>
            <p className="table-row">
                <FontAwesomeIcon icon={icon} aria-hidden="true"/>
                {"\u00a0" + content}
            </p>
        </div>
    );
};

EventDetail.displayName = "EventDetail";
EventDetail.propTypes = {
    type: PropTypes.string.isRequired,
    content: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string
    ]).isRequired
};

export default EventDetail;
