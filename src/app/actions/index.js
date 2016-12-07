
import fetch from "isomorphic-fetch";
import moment from "moment";
import config from "../config.js";

// ------ Event action creators -----------------

export function toggleEvent(id) {
    return {
        type: "TOGGLE_EVENT",
        id
    };
}

export function openEvent(id) {
    return {
        type: "OPEN_EVENT",
        id
    };
}

export function closeEvent(id) {
    return {
        type: "CLOSE_EVENT",
        id
    };
}

// ------ Map action creators -------------------

export function setMapCenter(center) {
    return {
        type: "SET_MAP_CENTER",
        center
    };
}

export function setMapZoom(zoomLevel) {
    return {
        type: "SET_MAP_ZOOM",
        zoomLevel
    };
}

// ------ Search action creators ----------------

export function submitSearch(search) {
    return function(dispatch, getState) {
        const { searches } = getState();
        const searchWithID = Object.assign({}, search, {
            id: Object.keys(searches).length + 1
        });
        dispatch(fetchEvents(searchWithID));
        dispatch(addSearch(searchWithID));
        dispatch(setCurrentSearch(searchWithID));
    };
}

export function addSearch(search) {
    return {
        type: "ADD_SEARCH",
        search
    };
}

export function setCurrentSearch(search) {
    return {
        type: "SET_CURRENT_SEARCH",
        search
    };
}

// ------ Event fetching action creators --------

export function fetchEventsRequest(search) {
    return {
        type: "FETCH_EVENTS_REQUEST",
        search
    };
}

export function fetchEventsSuccess(search, json) {
    return {
        type: "FETCH_EVENTS_SUCCESS",
        search,
        events: json.events
    };
}

export function fetchEventsFailure(search, error) {
    return {
        type: "FETCH_EVENTS_FAILURE",
        search,
        error
    };
}

// ------ Event fetching middleware -------------

/* POST information to server and then check if it is ready with a GET request.
 * Server will respond 202 if the response is not ready yet. Query term is kept
 * in session by server.
 */

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function handleErrors(response) {
    if(response.status === 202) {
        var error = new Error();
        error.response = response;
        throw error;
    }
    else if(!response.ok) {
        throw new Error(response.statusText);
    }
    return response;
}

function catchErrors(error, search, dispatch) {
    if(!error.response) {
        if(config.env !== "production") {
            console.log(error);
        }
        return dispatch(fetchEventsFailure(search, error));
    }
    if(error.response.status === 202) {
        return delay(500).then(() => {
            return dispatch(checkIfReady(search));
        });
    }
}

export function fetchEvents(search) {
    return function(dispatch) {
        dispatch(fetchEventsRequest(search));
        return fetch(config.url.search, {
            credentials: "include",
            method: "POST",
            headers: {
                "Access-Control-Allow-Credentials": "true",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: search.query,
                latitude: search.location.coords.lat,
                longitude: search.location.coords.lng,
                radius: search.radius,
                mindate: moment(search.minDate).format("YYYY-MM-DD"),
                maxdate: moment(search.maxDate).format("YYYY-MM-DD")
            })
        })
        .then(handleErrors)
        .then(response => response.json())
        .then(json => dispatch(fetchEventsSuccess(search, json)))
        .catch(error => catchErrors(error, search, dispatch));
    };
}

export function checkIfReady(search) {
    return function(dispatch) {
        dispatch(fetchEventsRequest(search));
        return fetch(config.url.search, {
            credentials: "include",
            headers: {
                "Access-Control-Allow-Credentials": true
            }
        })
        .then(handleErrors)
        .then(response => response.json())
        .then(json => dispatch(fetchEventsSuccess(search, json)))
        .catch(error => catchErrors(error, search, dispatch));
    };
}
