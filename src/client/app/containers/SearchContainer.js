
import { submitSearch } from "../actions";
import { browserHistory } from "react-router";
import { connect } from "react-redux";
import moment from "moment";
import SplashForm from "../components/SplashComponent.jsx";
import SearchInputForm from "../components/SearchInputComponent.jsx";
import config from "../config.js";

const getInitialValues = search => {
    if(!search) { return {}; }
    return {
        query: search.query,
        location: search.location.query,
        radius: search.radius,
        minDate: new Date(search.minDate),
        maxDate: new Date(search.maxDate)
    };
};

const mapStateToProps = state => {
    return {
        initialValues: getInitialValues(state.searches[state.currentSearch]),
    };
};

const addDefaults = search => {
    return Object.assign({}, search, {
        radius: config.search.radius,
        minDate: moment().format("YYYY-MM-DD"),
        maxDate: moment().add(config.search.range, "days").format("YYYY-MM-DD")
    });
};


const geocode = (search) => {
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

const mapDispatchToProps = dispatch => {
    return {
        submitSearch: search => {
            geocode(search)
            .then(results => {
                return Object.assign({}, search, {
                    location: {
                        query: search.location,
                        coords: {
                            lat: results.lat(),
                            lng: results.lng()
                        }
                    }
                });
            })
            .then(geocodedSearch => {
                // No minDate means search has come from splash page and needs defaults added
                return geocodedSearch.minDate ? geocodedSearch : addDefaults(geocodedSearch);
            })
            .then(geocodedSearchMaybeDefaults => {
                dispatch(submitSearch(geocodedSearchMaybeDefaults));
                browserHistory.push("/events");
            })
            .catch(error => {
                if(config.env !== "production") {
                    console.log("Error with status: ", error);
                }
            });
        }
    };
};

export const SplashContainer = connect(undefined, mapDispatchToProps)(SplashForm);
export const SearchInputContainer = connect(mapStateToProps, mapDispatchToProps)(SearchInputForm);
