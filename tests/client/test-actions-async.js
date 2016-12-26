import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as actions from "../../src/app/actions";
import nock from "nock";
import moment from "moment";
import expect from "expect";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("Submitting a new search", () => {

    afterEach(() => {
        nock.cleanAll();
    });

    it("should correctly dispatch actions", () => {
        nock("http://localhost:8000")
           .post("/api/search")
           .reply(200, { events });

        const store = mockStore({ searches: [] });
        const searchWithID = Object.assign({}, search, {id: 1});
        const expectedActions = [
            { type: "ADD_SEARCH", search: searchWithID },
            { type: "SET_CURRENT_SEARCH", search: searchWithID },
            { type: "FETCH_EVENTS_REQUEST", search: searchWithID }
        ];

        store.dispatch(actions.submitSearch(search));
        expect(store.getActions()).toEqual(expectedActions);
    });

});
describe("Fetching events", () => {
    afterEach(() => {
        nock.cleanAll();
    });

    it("successfully handles normal case", () => {
        nock("http://localhost:8000")
            //.persist()
            .post("/api/search")
            .reply(200, { events });

        const expectedActions = [
            {type: "FETCH_EVENTS_REQUEST", search},
            {type: "FETCH_EVENTS_SUCCESS", search, events}
        ];
        const store = mockStore({ searches: {}, events: {} });

        return store.dispatch(actions.fetchEvents(search))
            .then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
    });

    it("creates FETCH_EVENTS_FAILURE when no results are returned", () => {
        nock("http://localhost:8000")
            .persist()
            .post("/api/search")
            .reply(400, "Bad Request");

        const store = mockStore({ search: {}, events: {} });

        return store.dispatch(actions.fetchEvents(search))
            .then(() => {
                const actions = store.getActions();
                expect(actions[0].type).toEqual("FETCH_EVENTS_REQUEST");
                expect(actions[0]).toIncludeKeys(["type", "search"]);
                expect(actions[1].type).toEqual("FETCH_EVENTS_FAILURE");
                expect(actions[1]).toIncludeKeys(["type", "search", "error"]);
            });
    });

});

const search = {
    query: "surgeon",
    radius: "5",
    location: {
        coords: {
            lat: "51.5073509",
            lng: "-0.12775829999998223"
        }
    },
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
        "currency": "GBP",
        "date": "2016-07-17",
        "description": "Soundcrash Presents Sidestepper + Richard Blair DJ",
        "entryprice": "15.50",
        "eventname": "Sidestepper",
        "gateway": false,
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
        "going": [],
        "id": "12715632",
        "imageurl": "https://d31fr2pwly4c4s.cloudfront.net/9/2/b/825638_1_sidestepper_th.jpg",
        "imgoing": 0,
        "largeimageurl": "https://d31fr2pwly4c4s.cloudfront.net/9/2/b/825638_1_sidestepper.jpg",
        "link": "http://www.skiddle.com/whats-on/London/Echoes/Sidestepper/12715632/",
        "minage": "18",
        "openingtimes": {
            "doorsclose": "01:00",
            "doorsopen": "20:00",
            "lastentry": ""
        },
        "tickets": true,
        "ticketsAvail": null,
        "total": 1.0454545,
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
