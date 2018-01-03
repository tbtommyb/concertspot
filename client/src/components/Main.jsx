import React from "react";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";
import PropTypes from "prop-types";
import Results from "./ResultsComponent.jsx";
import MapContainer from "../containers/MapContainer";
import MediaQuery from "react-responsive";

import "../styles/App.scss";

const Main = props => {
    return (
        <div>
            <CSSTransitionGroup transitionName="sidebar-slide"
                transitionEnterTimeout={600} transitionLeaveTimeout={600}
                transitionAppear={true} transitionAppearTimeout={600}>
                <Results {...props} />
            </CSSTransitionGroup>
            <MediaQuery minWidth={640}>
                <MapContainer events={props.events}/>
            </MediaQuery>
        </div>
    );
};

Main.displayName = "Main";
Main.propTypes = {
    isFetching: PropTypes.bool,
    artistsFound: PropTypes.array
};

export default Main;
