import GoogleMap from "google-map-react";
import React, { Component, PropTypes } from "react";
import config from "../config.js";
import Marker from "./Marker.jsx";

export default class MapComponent extends Component {
    constructor(props) {
        super(props);
        this.setActive = this.setActive.bind(this);
        this.handleMarkerClick = this.handleMarkerClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        const { searchLocation } = nextProps;
        if(searchLocation && searchLocation.query !== this.props.searchLocation.query) {
            // Re-centre for a new search
            this.handleChange({
                center: searchLocation.coords,
                zoom: config.map.zoom
            });
        }
    }
    handleChange(changes) {
        // TODO when componentWillReceiveProps is called when
        // initialising with redux-persist this is immediately
        // called with the old values so the map doesn't update
        this.setState({
            center: changes.center,
            zoom: changes.zoom,
        });
        return this.props.updateMap(changes);
    }
    handleMarkerClick(marker) {
        return this.props.toggleEvent(marker);
    }
    setActive(markers) {
        const { events } = this.props;
        return markers.map(marker => {
            const event = events.find(event => event.id === marker.id);
            marker.active = (event && event.active);
            return marker;
        });
    }
    render() {
        const { center, zoom } = this.props;
        const activatedMarkers = this.setActive(this.props.markers);
        return (
            <div className="l-fullscreen">
                <GoogleMap
                    bootstrapURLKeys={{
                        key: "AIzaSyBpmIDzWPhT6E3KFNfnKUbFy_5uhmh-No0",
                        region: "GB"
                    }}
                    onChange={this.handleChange}
                    center={center}
                    zoom={zoom}>
                    {activatedMarkers.map(marker => {
                        return <Marker
                            {...marker.position}
                            handleClick={this.handleMarkerClick}
                            key={marker.id}
                            id={marker.id}
                            active={marker.active}
                        />;
                    })}
                </GoogleMap>
            </div>
        );
    }
}

MapComponent.defaultProps = {
    center: config.map.center,
    zoom: config.map.zoom,
    searchLocation: {
        query: "",
        coords: {}
    }
};

MapComponent.displayName = "MapComponent";
MapComponent.propTypes = {
    events: PropTypes.array,
    markers: PropTypes.array,
    center: PropTypes.object.isRequired,
    zoom: PropTypes.number.isRequired,
    searchLocation: PropTypes.object.isRequired,
    toggleEvent: PropTypes.func.isRequired,
    updateMap: PropTypes.func.isRequired
};

