import expect from "expect";
import * as actions from "../../src/app/actions";

describe("Actions", () => {

    const id = "24354";
    const search = {
        query: "Cher",
        location: "London",
        radius: "5",
        minDate: "2016-05-20",
        maxDate: "2016-05-23",
        events: ["event1", "event2"]
    };
    const json = {
        events: ["event1, event2"],
        artists: ["artist1", "artist2"]
    };

    // Event action creators

    it("should create an action to toggle the specified event", () => {
        const expectedAction = {
            type: "TOGGLE_EVENT",
            id
        };
        expect(actions.toggleEvent(id)).toEqual(expectedAction);
    });

    it("should create an action to open an event", () => {
        const expectedAction = {
            type: "OPEN_EVENT",
            id
        };
        expect(actions.openEvent(id)).toEqual(expectedAction);
    });

    it("should create an action to close an event", () => {
        const expectedAction = {
            type: "CLOSE_EVENT",
            id
        };
        expect(actions.closeEvent(id)).toEqual(expectedAction);
    });

    // Map action creators

    it("should create an action to set the map centre", () => {
        const center = { lat: -50, lng: -0.1 };
        const expectedAction = {
            type: "SET_MAP_CENTER",
            center
        };
        expect(actions.setMapCenter(center)).toEqual(expectedAction);
    });

    it("should create an action to set the map zoom level", () => {
        const zoomLevel = 8;
        const expectedAction = {
            type: "SET_MAP_ZOOM",
            zoomLevel
        };
        expect(actions.setMapZoom(zoomLevel)).toEqual(expectedAction);
    });

    // Search action creators (sync)

    it("should create an action to add a search", () => {
        expect(actions.addSearch(search)).toEqual({
            type: "ADD_SEARCH",
            search
        });
    });

    it("should create an action to set the current search", () => {
        expect(actions.setCurrentSearch(search)).toEqual({
            type: "SET_CURRENT_SEARCH",
            search
        });
    });

    // Event fetching action creators (sync)

    it("should create an action to fetch events", () => {
        expect(actions.fetchEventsRequest(search)).toEqual({
            type: "FETCH_EVENTS_REQUEST",
            search
        });
    });

    it("should create an action for successful event requests", () => {
        expect(actions.fetchEventsSuccess(search, json)).toEqual({
            type: "FETCH_EVENTS_SUCCESS",
            search,
            events: json.events
        });
    });

    it("should create an action for failed event requests", () => {
        const error = "NO RESPONSE";
        expect(actions.fetchEventsFailure(search, error)).toEqual({
            type: "FETCH_EVENTS_FAILURE",
            search,
            error
        });
    });
});
