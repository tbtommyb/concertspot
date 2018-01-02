// TOOD img and genres should be in different component
import React from "react";
import PropTypes from "prop-types";

const EventDescription = props => {
    const { event: {active, largeimageurl, genres}, dangerDescription } = props;

    return (
        <div className={active ? "item-description is-active" : "item-description"}>
            <img className="item-img" src={largeimageurl} alt=""/>
            <span className="screen-reader">genres</span>
            <span className="item-genres">
                <i>{genres.map(genre => genre.name.toLowerCase() + " ")}</i>
            </span>
            <span className="screen-reader">description</span>
            <p className="item-description-text" dangerouslySetInnerHTML={dangerDescription}></p>
        </div>
    );
};

EventDescription.displayName = "EventDescription";
EventDescription.propTypes = {
    event: PropTypes.object.isRequired
};

export default EventDescription;
