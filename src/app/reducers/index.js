
import { combineReducers } from "redux";
import {reducer as formReducer} from "redux-form";
import update from "react-addons-update";
import config from "../config.js";

/* ------ Map store -----------------------------
 *
 * Stores the current centre of the map and zoom level.
 * Used so that the correct positioning can be maintained
 * if the user moves to a different page and back.
 */

export function map(state = { markers: {} }, action) {
    switch(action.type) {
        case "ADD_SEARCH": {
            const center = action.search.location.coords;
            return Object.assign({}, state, { center });
        }
        case "SET_MAP_CENTER": {
            const center = {lat: action.center.lat(), lng: action.center.lng()};
            return Object.assign({}, state, { center });
        }
        case "SET_MAP_ZOOM": {
            return Object.assign({}, state, {
                zoomLevel: action.zoomLevel
            });
        }
        case "FETCH_EVENTS_SUCCESS": {
            return Object.assign({}, state, update(state, {
                markers: {
                    [action.search.id]: {$set: action.events.map(event => ({
                        position: {
                            lat: event.venue.latitude,
                            lng: event.venue.longitude
                        },
                        id: event.id,
                        active: false,
                        zIndex: config.marker.zIndex.min,
                        defaultAnimation: config.marker.animation
                    }))}
                }
            }));
        }
        default: {
            return state;
        }
    }
}

/* ------ Event store ---------------------------
 *
 * Stores events as values in object with event ID
 * as key, allowing for easy lookup by ID.
 */

export function events(state = {}, action) {
    switch(action.type) {
        case "TOGGLE_EVENT": {
            return Object.assign({}, state, {
                [action.id]: update(state[action.id], {active: {$apply: x => !x}})
            });
        }
        case "OPEN_EVENT": {
            return Object.assign({}, state, {
                [action.id]: update(state[action.id], {active: {$apply: () => true}})
            });
        }
        case "CLOSE_EVENT": {
            return Object.assign({}, state, {
                [action.id]: update(state[action.id], {active: {$apply: () => false}})
            });
        }
        case "FETCH_EVENTS_SUCCESS": {
            const eventObj = {};
            action.events.forEach(event => { eventObj[event.id] = event; });
            return Object.assign({}, state, eventObj);
        }
        default: {
            return state;
        }
    }
}

/* ------ Current search ------------------------
 *
 * Stores ID of current search for lookup in search object
 */

export function currentSearch(state = null, action) {
    switch(action.type) {
        case "SET_CURRENT_SEARCH": {
            return action.search.id;
        }
        default: {
            return state;
        }
    }
}

/* ------ Searches store ------------------------
 *
 * Stores searches as values in object with search ID
 * as key, allowing for easy lookup by ID. Searches
 * themselves only contain a list of event IDs, to
 * reduce duplication of events shared by multiple
 * searches.
 */

export function searches(state = {}, action) {
    switch(action.type) {
        case "ADD_SEARCH": {
            return Object.assign({}, state, {
                [action.search.id]: action.search
            });
        }
        case "FETCH_EVENTS_REQUEST":
        case "FETCH_EVENTS_SUCCESS":
        case "FETCH_EVENTS_FAILURE": {
            return Object.assign({}, state, {
                [action.search.id]: fetch(state[action.search.id], action)
            });
        }
        default: {
            return state;
        }
    }
}

function fetch(
    state = {
        isFetching: false,
        isError:    false,
        events:     []
    }, action) {
    switch(action.type) {
        case "FETCH_EVENTS_REQUEST": {
            return Object.assign({}, state, {
                isFetching: true,
                isError: false
            });
        }
        case "FETCH_EVENTS_SUCCESS": {
            return Object.assign({}, state, {
                isFetching: false,
                isError: false,
                events: action.events.map(({id}) => id)
            });
        }
        case "FETCH_EVENTS_FAILURE": {
            return Object.assign({}, state, {
                isFetching: false,
                isError: true
            });
        }
        default: {
            return state;
        }
    }
}

/* ------ Form reducer --------------------------
 *
 * Ensures that search form values are up to date
 * as user switches between searches.
 */

const formReducerSpec = {
    "search-input": (state={values:{}}, action) => {
        switch(action.type) {
            case "SET_CURRENT_SEARCH": {
                const { query, location, radius, minDate, maxDate } = action.search;
                return Object.assign({}, state, {
                    values: {
                        query,
                        radius,
                        location: location.query,
                        minDate: new Date(minDate),
                        maxDate: new Date(maxDate)
                    }
                });
            }
            default: {
                return state;
            }
        }
    }
};

export const inputReducer = formReducer.plugin(formReducerSpec);

export default combineReducers({
    map,
    currentSearch,
    events,
    searches,
    form: formReducer.plugin(formReducerSpec)
});
