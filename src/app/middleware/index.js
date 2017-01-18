import { browserHistory } from "react-router";
import { fetchEventsFailure } from "../actions";
import config from "../config.js";
import moment from "moment";

const geocode = search => {
    const geocoder = new google.maps.Geocoder();
    const promise = new Promise((resolve, reject) => {
        geocoder.geocode({address: search.location}, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
                resolve(results[0].geometry.location);
            } else {
                reject(status);
            }
        });
    });
    return promise;
};

export const geocodeSearch = store => next => action => {
    if(action.type !== "ADD_SEARCH") {
        return next(action);
    }
    console.log("in middleware");
    console.log(action)
    geocode(action.search)
    .then(results => {
        const geocodedSearch = Object.assign({}, action.search, {
            location: {
                query: action.search.location,
                coords: {
                    lat: results.lat(),
                    lng: results.lng()
                }
            }
        });
        const newAction = Object.assign({}, action, { search: geocodedSearch });
        console.log(newAction);
        browserHistory.push("/events");
        return next(newAction);
    })
    .catch(error => {
        if(config.env !== "production") {
            console.log("Error with status: ", error);
        }
        return next(fetchEventsFailure(action.search, error));
    });
};

const addDefaultsToSearch = search => {
    console.log("adding defaults to search", search)
    return Object.assign({}, search, {
        radius: config.search.radius,
        minDate: moment().format("YYYY-MM-DD"),
        maxDate: moment().add(config.search.range, "days").format("YYYY-MM-DD")
    });
};

export const addDefaults = store => next => action => {
    if(action.type !== "ADD_SEARCH") {
        return next(action);
    }
    console.log("in defaults middleware")
    if(action.search.minDate && action.search.maxDate && action.search.radius) {
        // Search already has the properties so no need to add defaults
        return next(action);
    }
    const newAction = Object.assign({}, action, { search: addDefaultsToSearch(action.search) });
    return next(newAction);
};
