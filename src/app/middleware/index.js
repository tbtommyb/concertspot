import { fetchEventsFailure } from "../actions";
import config from "../config.js";

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
        return next(newAction);
    })
    .catch(error => {
        if(config.env !== "production") {
            console.log("Error with status: ", error);
        }
        return next(fetchEventsFailure(action.search, error));
    });
}
