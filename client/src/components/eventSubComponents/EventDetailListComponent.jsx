
import React, { PropTypes } from "react";
import EventDetail from "./EventDetailComponent.jsx";
import moment from "moment";

const EventDetailList = props => {
    const { event: {venue, date, price, times} } = props;
    return (
        <div className="item-details-list">
            <EventDetail type="venue" icon="map-marker" content={venue.name.toLowerCase()} />
            <EventDetail type="date"  icon="calendar-o" content={moment(date).format("dddd Do MMM").toLowerCase()} />
            <EventDetail type="price" icon="ticket" content={price.toLowerCase()} />
            <EventDetail type="times" icon="clock-o" content={times.opening + " - " + times.closing} />
        </div>
    );
};

EventDetailList.displayName = "EventDetailList";
EventDetailList.propTypes = {
    event: PropTypes.object.isRequired
};

export default EventDetailList;
