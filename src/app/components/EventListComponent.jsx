
import React, { PropTypes, Component } from "react";
import ReactDOM from "react-dom";
import smoothScroll from "../scripts/smoothScroll.js";
import config from "../config.js";
import Event from "./EventComponent.jsx";
import ReactCSSTransitionsGroup from "react-addons-css-transition-group";

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
        const activeEvent = this.refs.activeEvent;
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
                    <ReactCSSTransitionsGroup transitionName="add-event" transitionEnterTimeout={300}
                                              transitionLeaveTimeout={300}>
                        {Object.keys(events).map(id => {
                            const active = events[id].active;
                            const props = {
                                key: id,
                                event: events[id],
                                handleSelect: this._handleSelect
                            };
                            if(active) { props.ref = "activeEvent"; }
                            return <Event {...props} />;
                        })}
                    </ReactCSSTransitionsGroup>
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
