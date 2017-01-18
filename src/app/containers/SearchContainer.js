import { submitSearch } from "../actions";
import { connect } from "react-redux";
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

const mapDispatchToProps = dispatch => {
    return {
        submitSearch: search => {
            dispatch(submitSearch(search));
        }
    };
};

export const SplashContainer = connect(mapStateToProps, mapDispatchToProps)(SplashForm);
export const SearchInputContainer = connect(mapStateToProps, mapDispatchToProps)(SearchInputForm);
