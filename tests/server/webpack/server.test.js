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
            server.stop();
            done();
        });
    });

    it("should return a JSON list of event sorted by weighting", (done) => {
        var testOptions = Object.assign({}, postOptions, {payload: validPayload});
        server
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
                server.stop();
                done();
            });
    }).timeout(5000);

    it("should return 400 Bad Request for a bad radius", (done) => {
        var testOptions = Object.assign({}, postOptions, {payload: validPayload});
        testOptions.payload.radius = "dsfdsfs";
        server
            .injectThen(testOptions)
            .then(resp => {
                expect(resp.statusCode).toBe(400);
                server.stop();
                done();
            });
    }).timeout(5000);

    it("should return 400 Bad Request for an empty query", (done) => {
        var testOptions = Object.assign({}, postOptions, {payload: validPayload});
        testOptions.payload.query = "";
        server
            .injectThen(testOptions)
            .then(resp => {
                expect(resp.statusCode).toBe(400);
                server.stop();
                done();
            });
    }).timeout(5000);

    it("should return 200 OK for unicode", (done) => {
        var testOptions = Object.assign({}, postOptions, {payload: validPayload});
        testOptions.payload.query = "björk";
        testOptions.payload.radius = 3.0; // Otherwise it uses nonsense string for radius (Webpack not updating?)
        server
            .injectThen(testOptions)
            .then(resp => {
                expect(resp.statusCode).toBe(200);
                server.stop();
                done();
            });
    }).timeout(5000);

    it("should return 400 Bad Request for invalid lat/lng", (done) => {
        var testOptions = Object.assign({}, postOptions, {payload: validPayload});
        testOptions.payload.lng = 240.3;
        server
            .injectThen(testOptions)
            .then(resp => {
                expect(resp.statusCode).toBe(400);
                server.stop();
                done();
            });
    }).timeout(5000);

    it("should return 400 Bad Request for invalid dates", (done) => {
        var testOptions = Object.assign({}, postOptions, {payload: validPayload});
        testOptions.payload.mindate = "2013-02-02";
        server
            .injectThen(testOptions)
            .then(resp => {
                expect(resp.statusCode).toBe(400);
                server.stop();
                done();
            });
    }).timeout(5000);

    it("should return 400 Bad Request for negative radius", (done) => {
        var testOptions = Object.assign({}, postOptions, {payload: validPayload});
        testOptions.payload.radius = -5;
        server
            .injectThen(testOptions)
            .then(resp => {
                expect(resp.statusCode).toBe(400);
                server.stop();
                done();
            });
    }).timeout(5000);

    it("should return 400 Bad Request for zero radius", (done) => {
        var testOptions = Object.assign({}, postOptions, {payload: validPayload});
        testOptions.payload.radius = 0;
        server
            .injectThen(testOptions)
            .then(resp => {
                expect(resp.statusCode).toBe(400);
                server.stop();
                done();
            });
    }).timeout(5000);
});
