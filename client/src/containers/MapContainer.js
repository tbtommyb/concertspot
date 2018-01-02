import { connect } from "react-redux";
import { updateMap, openEvent, closeEvent  } from "../actions";
import MapComponent from "../components/MapComponent.jsx";

const mapStateToProps = state => {
    // Add in additional map state
    let searchLocation;
    const { currentSearch, searches, map: { center, zoom, markers } } = state;

    if(currentSearch) {
        searchLocation = searches[currentSearch].location;
    }

    return {
        markers: markers[currentSearch] || [],
        center,
        zoom,
        searchLocation
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateMap: (center, zoom) => {
            dispatch(updateMap(center, zoom));
        },
        toggleEvent: (marker) => {
            if(marker.active) {
                dispatch(closeEvent(marker.id));
            } else {
                dispatch(openEvent(marker.id));
            }
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MapComponent);
