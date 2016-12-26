var expect = require("expect");
var moment = require("moment");
var server = require("../../../src/backend/server/server");

describe("The basic server routes", () => {
    const options = {
        method: "GET",
        url: "/"
    };
    const postOptions = {
        method: "POST",
        url: "/api/search",
        headers: {
            "content-type": "application/json"
        }
    };
    const validPayload = {
        query: "ben UFO",
        mindate: moment().format("YYYY-MM-DD"),
        maxdate: moment().add(3, "days").format("YYYY-MM-DD"),
        lat: 51.5,
        lng: -0.12,
        radius: 2.0
    };

    it("should return 200 OK for index", (done) => {
        server.inject(options, resp => {
            expect(resp.statusCode).toBe(200);
            done();
        });
    });

    it("should return a JSON list of event sorted by weighting", () => {
        var testOptions = Object.assign({}, postOptions, {payload: validPayload});
        return server
            .injectThen(testOptions)
            .then(resp => {
                expect(resp.statusCode).toBe(200);
                const events = JSON.parse(resp.payload).events;
                expect(events.length).toBeGreaterThan(0);
                let weighting = events[0].weighting;
                events.forEach(event => {
                    expect(event.weighting).toBeLessThanOrEqualTo(weighting);
                    weighting = event.weighting;
                });
            });
    });

    it("should return 400 Bad Request for a bad radius", () => {
        var testOptions = Object.assign({}, postOptions, {payload: validPayload});
        testOptions.payload.radius = "dsfdsfs";
        return server
            .injectThen(testOptions)
            .then(resp => {
                expect(resp.statusCode).toBe(400);
            });
    });

    it("should return 400 Bad Request for an empty query", () => {
        var testOptions = Object.assign({}, postOptions, {payload: validPayload});
        testOptions.payload.query = "";
        return server
            .injectThen(testOptions)
            .then(resp => {
                expect(resp.statusCode).toBe(400);
            });
    });

    it("should return 200 OK for unicode", () => {
        var testOptions = Object.assign({}, postOptions, {payload: validPayload});
        testOptions.payload.query = "björk";
        testOptions.payload.radius = 3.0; // Otherwise it uses nonsense string for radius (Webpack not updating?)
        return server
            .injectThen(testOptions)
            .then(resp => {
                expect(resp.statusCode).toBe(200);
            });
    });

    it("should return 400 Bad Request for invalid lat/lng", () => {
        var testOptions = Object.assign({}, postOptions, {payload: validPayload});
        testOptions.payload.lng = 240.3;
        return server
            .injectThen(testOptions)
            .then(resp => {
                expect(resp.statusCode).toBe(400);
            });
    });

    it("should return 400 Bad Request for invalid dates", () => {
        var testOptions = Object.assign({}, postOptions, {payload: validPayload});
        testOptions.payload.mindate = "2013-02-02";
        return server
            .injectThen(testOptions)
            .then(resp => {
                expect(resp.statusCode).toBe(400);
            });
    });

    it("should return 400 Bad Request for negative radius", () => {
        var testOptions = Object.assign({}, postOptions, {payload: validPayload});
        testOptions.payload.radius = -5;
        return server
            .injectThen(testOptions)
            .then(resp => {
                expect(resp.statusCode).toBe(400);
            });
    });

    it("should return 400 Bad Request for zero radius", () => {
        var testOptions = Object.assign({}, postOptions, {payload: validPayload});
        testOptions.payload.radius = 0;
        return server
            .injectThen(testOptions)
            .then(resp => {
                expect(resp.statusCode).toBe(400);
            });
    });

    after(done => {
        server.stop({timeout: 0}, () => {
            done();
            process.exit(0); // Hack to deal with Mocha's refusal to quit.
        });
    });
});
