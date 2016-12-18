
/* Google Maps Component
 *
 * Map centre, zoom and search location are maintained by local state and updated
 * by props from Redux store, allowing state to persist across route changes. Changes
 * are detected by handlers which call actions to update store state, which comes back to
 * component state via props. The current search is also maintained in local
 * state so that the map can detect new search locations and update.
 * Bounding is done after markers have loaded.
 */

import GoogleMap from "google-map-react";
import React, { Component } from "react";
import config from "../config.js";
import ExampleMarker from "./ExampleMarker.jsx";

require("../styles/MapContainer.scss");
var active = require("../images/orange-marker-small.png");
var inactive = require("../images/blue-marker-small.png");

export default class MapComponent extends Component {

  //shouldComponentUpdate = shouldPureComponentUpdate;

    constructor(props) {
        super(props);
        this.state = {
            center: this.props.center,
            zoomLevel: this.props.zoomLevel,
            location: this.props.searchLocation
        };
        this.prepareMarkers = this.prepareMarkers.bind(this);
    }
    prepareMarkers(markers) {
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
        const { center, zoomLevel } = this.state;
        const preparedMarkers = this.prepareMarkers(this.props.markers);
        console.log(preparedMarkers);
        return (
            <div id="map-outer-container">
                <GoogleMap
                    bootstrapURLKeys={{
                        key: "AIzaSyBpmIDzWPhT6E3KFNfnKUbFy_5uhmh-No0",
                        region: "GB"
                    }}
                    defaultCenter={center}
                    defaultZoom={zoomLevel}>
                    {preparedMarkers.map(marker => {
                        console.log(marker);
                        return <ExampleMarker {...marker.position} text={'A'} />;
                    })}
                </GoogleMap>
            </div>
        );
    }
}

MapComponent.defaultProps = {
    center: config.map.center,
    zoomLevel: config.map.zoomLevel,
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
            zoomLevel: this.props.zoomLevel,
            location: this.props.searchLocation
        };
        this.handleZoomChanged = this.handleZoomChanged.bind(this);
        this.handleDragEnded = this.handleDragEnded.bind(this);
        this.handleMarkerClick = this.handleMarkerClick.bind(this);
        this.handleGoogleMapLoad = this.handleGoogleMapLoad.bind(this);
        this.prepareMarkers = this.prepareMarkers.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        const { center, zoomLevel, searchLocation, markers, googleMapsApi } = nextProps;
        if(center != this.props.center) {
            this.setState({center});
        }
        if(zoomLevel !== this.props.zoomLevel) {
            this.setState({zoomLevel});
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
        const zoomLevel = this._googleMapComponent.getZoom();
        if(zoomLevel === this.props.zoomLevel) {
            return;
        }
        this.props.setMapZoom(zoomLevel);
    }
    handleGoogleMapLoad(googleMap) {
        this._googleMapComponent = googleMap;
    }
    prepareMarkers(markers) {
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
        const { center, zoomLevel } = this.state;
        const preparedMarkers = this.prepareMarkers(this.props.markers);
        return (
            <div id="map-outer-container">
                <GoogleMapLoader
                    containerElement={<div id="map-container"/>}
                    googleMapElement={
                        <GoogleMap
                            ref={this.handleGoogleMapLoad}
                            zoom={zoomLevel}
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
    zoomLevel: PropTypes.number.isRequired,
    searchLocation: PropTypes.object.isRequired,
    googleMapsApi: PropTypes.object.isRequired,
    setMapCenter: PropTypes.func.isRequired,
    setMapZoom: PropTypes.func.isRequired,
    openEvent: PropTypes.func.isRequired,
    closeEvent: PropTypes.func.isRequired
};

MapComponent.defaultProps = {
    center: config.map.center,
    zoomLevel: config.map.zoomLevel,
    searchLocation: {
        query: "initial",
        coords: {}
    }
};
*/
