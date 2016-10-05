
import React, { PropTypes } from "react";
import Sidebar from "./SidebarComponent.jsx";
import Notification from "./NotificationComponent.jsx";
import MapContainer from "../containers/MapContainer";
import ReactCSSTransitionsGroup from "react-addons-css-transition-group";

require("../styles/App.scss");
const MediaQuery = require("react-responsive");

const Main = props => {
    const { currentSearchObj: { isFetching } } = props;

    return (
        <div>
            <ReactCSSTransitionsGroup transitionName="sidebar-slide"
                transitionEnterTimeout={600} transitionLeaveTimeout={600}
                transitionAppear={true} transitionAppearTimeout={600}>
                <Sidebar {...props} />
            </ReactCSSTransitionsGroup>
            {isFetching ? <Notification loading={true}/> : null}
            <MediaQuery minWidth={640}>
                <MapContainer events={props.events} googleMapsApi={google.maps}/>
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
