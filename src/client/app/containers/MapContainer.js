
import { connect } from "react-redux";
import { setMapCenter, setMapZoom, openEvent, closeEvent  } from "../actions";
import MapComponent from "../components/MapComponent.jsx";

const mapStateToProps = state => {
    // Add in additional map state
    let searchLocation;
    const { currentSearch, searches, map: { center, zoomLevel, markers } } = state;

    if(currentSearch) {
        searchLocation = searches[currentSearch].location;
    }

    return {
        markers: markers[currentSearch] || [],
        center,
        zoomLevel,
        searchLocation
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setMapCenter: (center) => {
            dispatch(setMapCenter(center));
        },
        setMapZoom: (zoomLevel) => {
            dispatch(setMapZoom(zoomLevel));
        },
        openEvent: id => {
            dispatch(openEvent(id));
        },
        closeEvent: id => {
            dispatch(closeEvent(id));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MapComponent);
