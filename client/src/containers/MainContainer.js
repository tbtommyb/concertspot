import { connect } from "react-redux";
import { setCurrentSearch, toggleEvent } from "../actions";
import Main from "../components/Main.jsx";

const mapStateToProps = (state) => {
    let eventList = [];
    const { searches, currentSearch } = state;
    const searchCount = Object.keys(searches).length;
    const currentSearchObj = searches[currentSearch] || {};
    const { events } = currentSearchObj;
    if(events && events.length) {
        eventList = events.map(id => Object.assign({}, state.events[id]));
    }

    return {
        events: eventList,
        currentSearchObj,
        searches,
        currentSearch,
        searchCount,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setCurrentSearch: search => {
            dispatch(setCurrentSearch(search));
        },
        toggleEvent: id => {
            dispatch(toggleEvent(id));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
