
import React, { PropTypes, Component } from "react";
import EventDetailList from "./eventSubComponents/EventDetailListComponent.jsx";
import EventDescription from "./eventSubComponents/EventDescriptionComponent.jsx";

require("../styles/Event.scss");

class Event extends Component {
    constructor(props) {
        super(props);
        this.unescapeText = this.unescapeText.bind(this);
        this._handleToggle = this._handleToggle.bind(this);
    }
    unescapeText(text) {
        return {
            __html: text
        };
    }
    _handleToggle(toggleEvent) {
        const { handleSelect, event: { id } } = this.props;
        if(!toggleEvent.key || (toggleEvent.key && toggleEvent.key === "Tab")) {
            handleSelect(id);
        }
    }
    render() {
        const { event, event: { description, title, active, id, link} } = this.props;
        const dangerText = this.unescapeText(description);
        const dangerTitle = this.unescapeText(title);
        const listProps = {
            tabIndex: 0,
            onClick: this._handleToggle,
            onKeyDown: this._handleToggle,
            key: id,
            className: active ? "active event-component" : "event-component",
            role: "option"
        };
        return (
            <li {...listProps}>
                <h1 title="title" dangerouslySetInnerHTML={dangerTitle}></h1>
                <div className="event-wrapper">
                    <EventDetailList event={event} />
                    <div className="tickets">
                        <a target="_blank" rel="noreferrer noopener" href={link}>Tickets <span className="fa fa-chevron-right" aria-hidden="true"></span></a>
                    </div>
                    <EventDescription event={event} dangerDescription={dangerText} />
                </div>
            </li>
        );
    }
}

Event.displayName = "Event";

Event.propTypes = {
    event: PropTypes.object.isRequired,
    handleSelect: PropTypes.func.isRequired
};

export default Event;
