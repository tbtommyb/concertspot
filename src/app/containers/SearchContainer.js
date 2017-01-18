
import { submitSearch } from "../actions";
import { browserHistory } from "react-router";
import { connect } from "react-redux";
import moment from "moment";
import SplashForm from "../components/SplashComponent.jsx";
import SearchInputForm from "../components/SearchInputComponent.jsx";

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
        splashImage: state.splashImage
    };
};

const addDefaults = search => {
    return Object.assign({}, search, {
        radius: config.search.radius,
        minDate: moment().format("YYYY-MM-DD"),
        maxDate: moment().add(config.search.range, "days").format("YYYY-MM-DD")
    });
};


/*const mapDispatchToProps = dispatch => {
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
};*/

const mapDispatchToProps = dispatch => {
    return {
        submitSearch: search => {
            dispatch(submitSearch(search));
        }
    };
};

export const SplashContainer = connect(mapStateToProps, mapDispatchToProps)(SplashForm);
export const SearchInputContainer = connect(mapStateToProps, mapDispatchToProps)(SearchInputForm);
