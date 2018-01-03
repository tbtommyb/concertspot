import React, { Component } from "react";
import ReactDOM from "react-dom";
import CSSTransitionsGroup from "react-transition-group/CSSTransitionGroup";
import PropTypes from "prop-types";
import smoothScroll from "../scripts/smoothScroll.js";
import config from "../config.js";
import Event from "./EventComponent.jsx";

class EventList extends Component {
    constructor(props) {
        super(props);
        this._handleSelect = this._handleSelect.bind(this);
    }

    _handleSelect(id) {
        const { toggleEvent} = this.props;
        toggleEvent(id);
    }
    componentDidUpdate(prevProps) {
        const activeEvent = this.activeEvent;
        if(activeEvent) {
            const eventNode = ReactDOM.findDOMNode(activeEvent);
            const listNode = ReactDOM.findDOMNode(this);
            smoothScroll(listNode, eventNode.offsetTop - listNode.offsetTop, config.event.scrollDuration);
        }
    }
    render() {
        const { events } = this.props;
        return (
            <div className="results-list" ref="eventlist">
                <ul>
                    <CSSTransitionsGroup transitionName="add-event" transitionEnterTimeout={300}
                                              transitionLeaveTimeout={300}>
                        {Object.keys(events).map(id => {
                            const event = events[id];
                            const props = {
                                key: id,
                                event,
                                handleSelect: this._handleSelect
                            };
                            if(event.active) {
                                props.ref = input => this.activeEvent = input;
                            }
                            return <Event {...props} />;
                        })}
                    </CSSTransitionsGroup>
                </ul>
            </div>
        );
    }
}

EventList.displayName = "EventList";
EventList.propTypes = {
    events: PropTypes.arrayOf(
        PropTypes.shape({
            id:          PropTypes.string.isRequired,
            title:       PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            active:      PropTypes.bool.isRequired,
            date:        PropTypes.string.isRequired,
            venue:       PropTypes.object.isRequired,
            link:        PropTypes.string.isRequired,
            artists:     PropTypes.array,
            genres:      PropTypes.array
        }).isRequired).isRequired,
    toggleEvent: PropTypes.func.isRequired
};

export default EventList;
