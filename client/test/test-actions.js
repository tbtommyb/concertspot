import * as actions from "../src/actions";
import chai from "chai";

const expect = chai.expect;

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
        expect(actions.toggleEvent(id)).to.eql(expectedAction);
    });

    it("should create an action to open an event", () => {
        const expectedAction = {
            type: "OPEN_EVENT",
            id
        };
        expect(actions.openEvent(id)).to.eql(expectedAction);
    });

    it("should create an action to close an event", () => {
        const expectedAction = {
            type: "CLOSE_EVENT",
            id
        };
        expect(actions.closeEvent(id)).to.eql(expectedAction);
    });

    // Map action creators

    it("should create an action to set the map centre", () => {
        const changes = {
            center: {
                lat: -50,
                lng: -0.1
            }
        };
        const expectedAction = {
            type: "UPDATE_MAP",
            changes
        };
        expect(actions.updateMap(changes)).to.eql(expectedAction);
    });

    it("should create an action to set the map zoom level", () => {
        const changes = {
            center: {
                zoom: 8
            }
        };
        const expectedAction = {
            type: "UPDATE_MAP",
            changes
        };
        expect(actions.updateMap(changes)).to.eql(expectedAction);
    });

    // Search action creators (sync)

    it("should create an action to add a search", () => {
        expect(actions.addSearch(search)).to.eql({
            type: "ADD_SEARCH",
            search
        });
    });

    it("should create an action to set the current search", () => {
        expect(actions.setCurrentSearch(search)).to.eql({
            type: "SET_CURRENT_SEARCH",
            search
        });
    });

    // Event fetching action creators (sync)

    it("should create an action to fetch events", () => {
        expect(actions.fetchEventsRequest(search)).to.eql({
            type: "FETCH_EVENTS_REQUEST",
            search
        });
    });

    it("should create an action for successful event requests", () => {
        expect(actions.fetchEventsSuccess(search, json)).to.eql({
            type: "FETCH_EVENTS_SUCCESS",
            search,
            events: json.events
        });
    });

    it("should create an action for failed event requests", () => {
        const error = "NO RESPONSE";
        expect(actions.fetchEventsFailure(search, error)).to.eql({
            type: "FETCH_EVENTS_FAILURE",
            search,
            error
        });
    });
});
