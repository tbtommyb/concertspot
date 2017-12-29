import expect from "expect";
import moment from "moment";
import * as reducers from "../src/reducers";

describe("Maps reducer", () => {

    const state = {
        name: "testing",
        markers: {}
    };

    it("should return state if not a relevant action", () => {
        expect(reducers.map(state, {
            type: "TEST_ACTION"
        })).toEqual(state);
    });

    it("should set map center when a new search is added", () => {
        expect(reducers.map(state, {
            type: "ADD_SEARCH",
            search
        })).toEqual({
            name: "testing",
            markers: {},
            center: {
                lat: "51.5073509",
                lng: "-0.12775829999998223"
            }
        });
    });

    it("should set map center from Google Maps object when UPDATE_MAP is dispatched", () => {
        expect(reducers.map(state, {
            type: "UPDATE_MAP",
            changes: {
                center: {
                    lat: "51.5073509",
                    lng: "-0.12775829999998223"
                }
            }
        })).toEqual({
            name: "testing",
            markers: {},
            center: {
                lat: "51.5073509",
                lng: "-0.12775829999998223"
            }
        });
    });

    it("should set zoom level when UPDATE_MAP is dispatched", () => {
        expect(reducers.map(state, {
            type: "UPDATE_MAP",
            changes: {
                zoom: 5
            }
        })).toEqual({
            name: "testing",
            markers: {},
            zoom: 5
        });
    });

    it("should create array of markers when FETCH_EVENTS_SUCCESS dispatched", () => {
        expect(reducers.map(state, {
            type: "FETCH_EVENTS_SUCCESS",
            search: {
                id: "10"
            },
            events
        })).toEqual({
            name: "testing",
            markers: {
                "10": [{
                    position: {
                        lat: 51.5358412,
                        lng: -0.0771282
                    },
                    id: "12715632",
                    active: false,
                    defaultAnimation: 2,
                    zIndex: 1
                }]
            }
        });
    });
});

describe("Events reducer", () => {

    const testEvent = {
        id: "123",
        title: "Test event",
        active: false
    };

    const state = {
        "name": "test",
        "123": testEvent
    };

    it("should return state if not a relevant action", () => {
        expect(reducers.events(state, {
            type: "TEST_ACTION"
        })).toEqual(state);
    });

    it("should toggle the event's active property on TOGGLE_EVENT (false to true)", () => {
        expect(reducers.events(state, {
            type: "TOGGLE_EVENT",
            id: "123"
        })).toEqual({
            "name": "test",
            "123": {
                id: "123",
                title: "Test event",
                active: true
            }
        });
    });

    it("should toggle the event's active property on TOGGLE_EVENT (true to false)", () => {
        const event = Object.assign({}, testEvent, {active: true});
        expect(reducers.events({"123": event}, {
            type: "TOGGLE_EVENT",
            id: "123"
        })).toEqual({
            "123": {
                id: "123",
                title: "Test event",
                active: false
            }
        });
    });

    it("should set the event's active property to true on OPEN_EVENT", () => {
        expect(reducers.events(state, {
            type: "OPEN_EVENT",
            id: "123"
        })).toEqual({
            "name": "test",
            "123": {
                id: "123",
                title: "Test event",
                active: true
            }
        });
    });

    it("should set the event's active property to true on CLOSE_EVENT", () => {
        expect(reducers.events(state, {
            type: "CLOSE_EVENT",
            id: "123"
        })).toEqual({
            "name": "test",
            "123": {
                id: "123",
                title: "Test event",
                active: false
            }
        });
    });

    it("should return an event object with ID as key on FETCH_EVENTS_SUCCESS", () => {
        const event = events[0];
        expect(reducers.events({}, {
            type: "FETCH_EVENTS_SUCCESS",
            search,
            events
        })).toEqual({
            [event.id]: event
        });
    });
});

describe("CurrentSearch reducer", () => {
    it("should return initial state for unrelated actions", () => {
        expect(reducers.currentSearch({}, {
            type: "TEST_ACTION"
        })).toEqual({});
    });

    it("should return the ID of the search being set", () => {
        expect(reducers.currentSearch({}, {
            type: "SET_CURRENT_SEARCH",
            search: {
                id: 5
            }
        })).toEqual(5);
    });
});

describe("Searches reducer", () => {
    const testResult = {
        "234": {
            id: "234",
            query: "Cher",
            location: {
                query: "london",
                coords: {
                    lat: "51.5073509",
                    lng: "-0.12775829999998223"
                }
            },
            radius: "5",
            minDate: moment().format("YYYY-MM-DD"),
            maxDate: moment().format("YYYY-MM-DD")
        }
    };

    it("should return the initial state", () => {
        expect(reducers.searches(undefined, {
            type: "TEST_ACTION"
        })).toEqual({});
    });

    it("should handle ADD_SEARCH correctly", () => {
        expect(reducers.searches({}, {
            type: "ADD_SEARCH",
            search
        })).toEqual(testResult);
    });

    it("should set isFetching and isError correctly for FETCH_EVENTS_REQUEST", () => {
        const expectedResult = Object.assign({}, testResult);
        expectedResult["234"].isFetching = true;
        expectedResult["234"].isError = false;
        expect(reducers.searches(testResult, {
            type: "FETCH_EVENTS_REQUEST",
            search
        })).toEqual(expectedResult);
    });

    it("should set isFetching and isError correctly for FETCH_EVENTS_FAILURE", () => {
        const expectedResult = Object.assign({}, testResult);
        expectedResult["234"].isFetching = false;
        expectedResult["234"].isError = true;
        expect(reducers.searches(testResult, {
            type: "FETCH_EVENTS_FAILURE",
            search
        })).toEqual(expectedResult);
    });

    it("should set isFetching and isError correctly and set a list of events ids for FETCH_EVENTS_SUCCESS", () => {
        const expectedResult = Object.assign({}, testResult);
        expectedResult["234"].isFetching = false;
        expectedResult["234"].isError = false;
        expectedResult["234"].events = ["12715632"];
        expect(reducers.searches(testResult, {
            type: "FETCH_EVENTS_SUCCESS",
            search,
            events
        })).toEqual(expectedResult);
    });

});

describe("Input reducer", () => {

    const state = {
        "search-input": {
            values: {}
        }
    };

    it("should return state for unrelated actions", () => {
        expect(reducers.inputReducer(state), {
            type: "TEST_ACTION"
        }).toEqual(state);
    });

    it("should update its values when SET_CURRENT_SEARCH dispatched", () => {
        expect(reducers.inputReducer(state, {
            type: "SET_CURRENT_SEARCH",
            search
        })).toEqual({
            "search-input": {
                values: {
                    query: search.query,
                    radius: search.radius,
                    location: search.location.query,
                    minDate: new Date(search.minDate),
                    maxDate: new Date(search.maxDate)
                }
            }
        });
    });
});

const search = {
    id: "234",
    query: "Cher",
    location: {
        query: "london",
        coords: {
            lat: "51.5073509",
            lng: "-0.12775829999998223"
        }
    },
    radius: "5",
    minDate: moment().format("YYYY-MM-DD"),
    maxDate: moment().format("YYYY-MM-DD")
};

const events = [
    {
        "artists": [
            {
                "artistid": "123549296",
                "image": "https://d1mdxzfl9p8pzo.cloudfront.net/6/123549296_1.jpg",
                "name": "Sidestepper"
            }
        ],
        "active": false,
        "date": "2016-07-17",
        "description": "Soundcrash Presents Sidestepper + Richard Blair DJ",
        "price": "15.50",
        "title": "Sidestepper",
        "genres": [
            {
                "genreid": "65",
                "name": "Dubstep"
            },
            {
                "genreid": "29",
                "name": "Electro"
            },
            {
                "genreid": "61",
                "name": "Electronic"
            }
        ],
        "id": "12715632",
        "imageurl": "https://d31fr2pwly4c4s.cloudfront.net/9/2/b/825638_1_sidestepper_th.jpg",
        "largeimageurl": "https://d31fr2pwly4c4s.cloudfront.net/9/2/b/825638_1_sidestepper.jpg",
        "link": "http://www.skiddle.com/whats-on/London/Echoes/Sidestepper/12715632/",
        "opening": "20:00",
        "closing": "01:00",
        "tickets": true,
        "ticketsAvail": null,
        "venue": {
            "address": "259 Kingsland Road",
            "id": 72354,
            "latitude": 51.5358412,
            "longitude": -0.0771282,
            "name": "Echoes",
            "phone": "",
            "postcode": "E2 8AS",
            "town": "London",
            "type": "live"
        }
    }
];
