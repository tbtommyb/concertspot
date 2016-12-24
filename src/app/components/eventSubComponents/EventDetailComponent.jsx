
import React, { PropTypes } from "react";

const EventDetail = props => {
    const { type, content, icon } = props;

    return (
        <div className="table">
            <span className="screen-reader">{type}</span>
            <p className="table-row">
                <span className={"table-cell fa " + icon} aria-hidden="true"></span>
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
