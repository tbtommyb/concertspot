// Only render sidebar in client to avoid FOUC from Font Awesome
import React, { PropTypes } from "react";
import Sidebar from "./SidebarComponent.jsx";
import MapContainer from "../containers/MapContainer";
import ReactCSSTransitionsGroup from "react-addons-css-transition-group";

require("../styles/App.scss");
const MediaQuery = require("react-responsive");

const Main = props => {
    return (
        <div>
            {process.env.BROWSER === "true" ?
                <ReactCSSTransitionsGroup transitionName="sidebar-slide"
                    transitionEnterTimeout={600} transitionLeaveTimeout={600}
                    transitionAppear={true} transitionAppearTimeout={600}>
                    <Sidebar {...props} />
                </ReactCSSTransitionsGroup>
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
