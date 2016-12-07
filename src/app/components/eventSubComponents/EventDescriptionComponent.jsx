
import React, { PropTypes } from "react";

const EventDescription = props => {
    const { event: {active, largeimageurl, genres}, dangerDescription } = props;

    return (
        <div className={active ? "active description" : "description"}>
            <img src={largeimageurl} alt=""/>
            <span className="screen-reader">genres</span>
            <span className="genres">
                <i>{genres.map(genre => genre.name.toLowerCase() + " ")}</i>
            </span>
            <span className="screen-reader">description</span>
            <p dangerouslySetInnerHTML={dangerDescription}></p>
        </div>
    );
};

EventDescription.displayName = "EventDescription";
EventDescription.propTypes = {
    event: PropTypes.object.isRequired
};

export default EventDescription;
