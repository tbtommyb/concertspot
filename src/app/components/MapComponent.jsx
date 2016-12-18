
/* Google Maps Component
 */

import GoogleMap from "google-map-react";
import React, { Component } from "react";
import config from "../config.js";
import Marker from "./Marker.jsx";

require("../styles/MapContainer.scss");

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
            this.props.updateMap({
                center: searchLocation.coords,
                zoom: config.map.zoom
            });
        }
    }
    handleChange(changes) {
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
        const preparedMarkers = this.setActive(this.props.markers);
        return (
            <div id="map-outer-container">
                <GoogleMap
                    bootstrapURLKeys={{
                        key: "AIzaSyBpmIDzWPhT6E3KFNfnKUbFy_5uhmh-No0",
                        region: "GB"
                    }}
                    onChange={this.handleChange}
                    center={center}
                    zoom={zoom}>
                    {preparedMarkers.map(marker => {
                        return <Marker
                            {...marker.position}
                            handleClick={this.handleMarkerClick}
                            key={marker.id}
                            id={marker.id}
                            active={marker.active}
                            text={"A"}
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
        query: "initial",
        coords: {}
    }
};
/*
var active = require("../images/orange-marker-small.png");
var inactive = require("../images/blue-marker-small.png");

export default class MapComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            center: this.props.center,
            zoom: this.props.zoom,
            location: this.props.searchLocation
        };
        this.handleZoomChanged = this.handleZoomChanged.bind(this);
        this.handleDragEnded = this.handleDragEnded.bind(this);
        this.handleMarkerClick = this.handleMarkerClick.bind(this);
        this.handleGoogleMapLoad = this.handleGoogleMapLoad.bind(this);
        this.setActive = this.setActive.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        const { center, zoom, searchLocation, markers, googleMapsApi } = nextProps;
        if(center != this.props.center) {
            this.setState({center});
        }
        if(zoom !== this.props.zoom) {
            this.setState({zoom});
        }
        if(searchLocation && searchLocation.query !== this.state.location.query) {
            // Re-centre for a new search
            this.props.setMapCenter(new googleMapsApi.LatLng(searchLocation.coords));
            this.setState({location: searchLocation});
        }
        if(!this.props.markers.length && markers.length > 3) {
            // Wait until markers have loaded before bounding map around them
            // fitBounds is buggy with small numbers of markers so a minimum is hardcoded
            const map = this._googleMapComponent;
            const bounds = new googleMapsApi.LatLngBounds();
            markers.forEach(marker => {
                bounds.extend(marker.position);
            });
            map.fitBounds(bounds);
        }
    }
    handleMarkerClick(marker) {
        return marker.active ? this.props.closeEvent(marker.id) : this.props.openEvent(marker.id);
    }
    handleDragEnded() {
        const center = this._googleMapComponent.getCenter();
        if(center.lat() === this.props.center.lat &&
            center.lng() === this.props.center.lng) {
            return;
        }
        //if (center.equals(new google.maps.LatLng(this.props.center))) {
        //    return;
        //}
        this.props.setMapCenter(center);
    }
    handleZoomChanged() {
        const zoom = this._googleMapComponent.getZoom();
        if(zoom === this.props.zoom) {
            return;
        }
        this.props.setMapZoom(zoom);
    }
    handleGoogleMapLoad(googleMap) {
        this._googleMapComponent = googleMap;
    }
    setActive(markers) {
        const { events } = this.props;
        return markers.map(marker => {
            const event = events.find(event => event.id === marker.id);
            if(event && event.active) {
                marker.icon = active;
                marker.zIndex = config.marker.zIndex.max;
                marker.active = true;
            } else {
                marker.icon = inactive;
                marker.zIndex = config.marker.zIndex.min;
                marker.active = false;
            }
            return marker;
        });
    }
    render() {
        const { center, zoom } = this.state;
        const preparedMarkers = this.setActive(this.props.markers);
        return (
            <div id="map-outer-container">
                <GoogleMapLoader
                    containerElement={<div id="map-container"/>}
                    googleMapElement={
                        <GoogleMap
                            ref={this.handleGoogleMapLoad}
                            zoom={zoom}
                            center={center}
                            onZoomChanged={this.handleZoomChanged}
                            onDragend={this.handleDragEnded}>
                            {preparedMarkers.map(marker => {
                                return (
                                    <Marker {...marker} key={marker.id}
                                    onClick={this.handleMarkerClick.bind(this, marker)}/>
                                );
                            })}
                        </GoogleMap>
                    }
                />
            </div>
        );
    }
}
MapComponent.displayName = "MapComponent";
MapComponent.propTypes = {
    events: PropTypes.array,
    markers: PropTypes.array,
    center: PropTypes.object.isRequired,
    zoom: PropTypes.number.isRequired,
    searchLocation: PropTypes.object.isRequired,
    googleMapsApi: PropTypes.object.isRequired,
    setMapCenter: PropTypes.func.isRequired,
    setMapZoom: PropTypes.func.isRequired,
    openEvent: PropTypes.func.isRequired,
    closeEvent: PropTypes.func.isRequired
};

MapComponent.defaultProps = {
    center: config.map.center,
    zoom: config.map.zoom,
    searchLocation: {
        query: "initial",
        coords: {}
    }
};
*/
