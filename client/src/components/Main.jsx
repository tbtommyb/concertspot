// Only render sidebar in client to avoid FOUC from Font Awesome
import React from "react";
import CSSTransitionsGroup from "react-transition-group/CSSTransitionGroup";
import PropTypes from "prop-types";
import Results from "./ResultsComponent.jsx";
import MapContainer from "../containers/MapContainer";

require("../styles/App.scss");
const MediaQuery = require("react-responsive");

const Main = props => {
    return (
        <div>
            {process.env.RENDER_ENV === "browser" ?
                <CSSTransitionsGroup transitionName="sidebar-slide"
                    transitionEnterTimeout={600} transitionLeaveTimeout={600}
                    transitionAppear={true} transitionAppearTimeout={600}>
                    <Results {...props} />
                </CSSTransitionsGroup>
                : null
            }
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
