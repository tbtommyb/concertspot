import expect from "expect";
import moment from "moment";
import { fetch, filter, createGenreList, extractEventGenres,
         weightEvent, recommend } from "../../../src/backend/events";

describe("Fetching events", () => {
    const validParams = {
        mindate: moment().format("YYYY-MM-DD"),
        maxdate: moment().add(3, "days").format("YYYY-MM-DD"),
        lat: 51.534889,
        lng: -0.137289,
        radius: 3
    };

    it("should return a list of events", (done) => {
        fetch(validParams, (err, events) => {
            expect(events.length).toExist();
            expect(events[0]).toIncludeKeys(["eventname", "link", "date"]);
            done();
        });
    }).timeout(5000);
});

describe("Filtering event keys", () => {
    const testEvent = {
        id: "12885287",
        eventname: "Christmas Events",
        venue:
        {
            id: 75424,
            name: "Spitalfields E1",
            address: " Brushfield Street, London, E1",
            town: "London",
            postcode: "E1 6AA",
            phone: "",
            latitude: 51.519684,
            longitude: -0.076904,
            type: "Outdoors"
        },
        imageurl: "https://d1plawd8huk6hh.cloudfront.net/assets/default400.png",
        largeimageurl: "https://d1plawd8huk6hh.cloudfront.net/assets/default400.png",
        link: "http://www.skiddle.com/whats-on/London/Spitalfields-E1/Christmas-Events/12885287/",
        date: "2016-12-12",
        description: "Come to London\"s oldest market to experience a range of festive events for all the family.",
        openingtimes: { doorsopen: "22:00", doorsclose: "12:00", lastentry: "" },
        genres: [],
        going: [],
        minage: "0",
        imgoing: 0,
        entryprice: "Free",
        tickets: false,
        ticketsAvail: null,
        currency: "GBP",
        artists: [],
        gateway: false
    };
    const keys = ["artists", "date", "description", "genres",
                  "id", "imageurl", "largeimageurl", "link",
                  "price", "tickets", "ticketsAvail", "title",
                  "venue", "active", "times"];
    it("should contain the specified keys", () => {
        const filteredEvent = filter(testEvent);
        expect(filteredEvent).toIncludeKeys(keys);
        expect(filteredEvent).toExcludeKeys(["entryprice", "eventname"]);
        expect(Object.keys(filteredEvent).length).toEqual(keys.length);
    });
});

describe("Splitting genre names", () => {
    const testGenre = {
        name: "Dub techno",
        weighting: 0.78
    };
    it("should create two genre objects", () => {
        const result = createGenreList([testGenre]);
        expect(result.length).toEqual(2);
        expect(result[0]).toIncludeKeys(["name", "weighting"]);
    });
});

describe("Extracting event genres", () => {
    const testEvent = {
        "genres": [
            {"genreid": "46", "name": "Alternative"},
            {"genreid": "45", "name": "Funk Soul"},
            {"genreid": "76", "name": "Retro"}
        ],
    };
    const expected = ["alternative", "funk", "soul", "retro"];
    it("should return a lower cased list of split genre names", () => {
        expect(extractEventGenres(testEvent)).toEqual(expected);
    });
});

describe("Adding weighting to an event", () => {
    const testEvent = {
        genres: [
            {"genreid": "46", "name": "Alternative"},
            {"genreid": "45", "name": "Funk Soul"},
            {"genreid": "76", "name": "Retro"}
        ],
    };
    it("should add a weighting of 5 for two matching genres", () => {
        const testQueryGenres = [
            {name: "Funk", weighting: 3},
            {name: "soul", weighting: 2}
        ];
        expect(weightEvent(testEvent, testQueryGenres).weighting).toEqual(5);
    });
    it("should add a weighting of 0 for no matching genres", () => {
        const testQueryGenres = [
            {name: "jazz", weighting: 7}
        ];
        expect(weightEvent(testEvent, testQueryGenres).weighting).toEqual(0);
    });
});

describe("Event recommendation", () => {
    const testEvents = [
        {
            name: "techno event",
            genres: [
                {name: "techno"},
                {name: "house"}
            ]
        },
        {
            name: "soul event",
            genres: [
                {name: "soul"},
                {name: "funk"}
            ]
        },
        {
            name: "jazz event",
            genres: [
                {name: "jazz"},
                {name: "bebop"}
            ]
        }
    ];
    const queryGenres = [
        {
            name: "techno",
            weighting: 1.9
        },
        {
            name: "soul",
            weighting: 0.5
        }
    ];
    it("should return two events in descending order of weighting", () => {
        const actual = recommend(testEvents, queryGenres);
        expect(actual.length).toBe(2);
        expect(actual[0].name).toBe("techno event");
        let weighting = actual[0].weighting;
        actual.forEach(event => {
            expect(event.weighting).toBeLessThanOrEqualTo(weighting);
            weighting = event.weighting;
        });
    });
});