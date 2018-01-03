import { browserHistory } from "react-router";
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

export function updateMap(changes) {
    return {
        type: "UPDATE_MAP",
        changes
    };
}

// ------ Error handling ------------------------

function catchErrors(error, search, dispatch) {
    if(config.env !== "production") {
        console.log(error);
    }
    return dispatch(fetchEventsFailure(search, error));
}

// ------ Search action creators ----------------

function geocodeSearch(search) {
    const geocoder = new window.google.maps.Geocoder();
    const promise = new Promise((resolve, reject) => {
        geocoder.geocode({address: search.location}, (results, status) => {
            if (status === window.google.maps.GeocoderStatus.OK) {
                const { lat, lng } = results[0].geometry.location;
                const geocodedSearch = Object.assign({}, search, {
                    location: {
                        query: search.location,
                        coords: {
                            lat: lat(),
                            lng: lng()
                        }
                    }
                });
                resolve(geocodedSearch);
            } else {
                reject(status);
            }
        });
    });
    return promise;
};

function addDefaultsToSearch(search) {
    return Object.assign({}, search, {
        radius: config.search.radius,
        minDate: moment().format("YYYY-MM-DD"),
        maxDate: moment().add(config.search.range, "days").format("YYYY-MM-DD")
    });
};

export function submitSearch(search) {
    return function(dispatch, getState) {
        const { searches } = getState();
        let searchWithID = Object.assign({}, search, {
            id: Object.keys(searches).length + 1
        });
        if(!searchWithID.radius) {
            searchWithID = addDefaultsToSearch(searchWithID);
        }
        return geocodeSearch(searchWithID)
            .then(geocodedSearch => {
                dispatch(addSearch(geocodedSearch));
                dispatch(setCurrentSearch(geocodedSearch));
                dispatch(fetchEvents(geocodedSearch));
                browserHistory.push("/events");
            })
            .catch(error => catchErrors(error, searchWithID, dispatch));
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

export function fetchEvents(search) {
    return function(dispatch) {
        dispatch(fetchEventsRequest(search));
        return fetch("/api/search", {
            credentials: "include",
            method: "POST",
            headers: {
                "Access-Control-Allow-Credentials": "true",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: search.query,
                lat: search.location.coords.lat,
                lng: search.location.coords.lng,
                radius: search.radius,
                mindate: moment(search.minDate).format("YYYY-MM-DD"),
                maxdate: moment(search.maxDate).format("YYYY-MM-DD")
            })
        })
        .then(response => response.json())
        .then(json => dispatch(fetchEventsSuccess(search, json)))
        .catch(error => catchErrors(error, search, dispatch));
    };
}
