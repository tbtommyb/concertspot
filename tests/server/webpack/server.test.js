var expect = require("expect");
var moment = require("moment");
var server = require("../../../src/backend-hapi/server");

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
        radius: 0.8
    };
    const invalidPayload = {
        query: "ben UFO",
        mindate: moment().format("YYYY-MM-DD"),
        maxdate: moment().add(3, "days").format("YYYY-MM-DD"),
        lat: 51.5,
        lng: -0.12,
        radius: "dfsgdff"
    };

    it("should return 200 OK for index", (done) => {
        server.inject(options, resp => {
            expect(resp.statusCode).toBe(200);
            server.stop();
            done();
        });
    });

    it("should return a JSON list of event sorted by weighting", (done) => {
        const testOptions = Object.assign({}, postOptions, {payload: validPayload});
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
        const testOptions = Object.assign({}, postOptions, {payload: invalidPayload});
        server
            .injectThen(testOptions)
            .then(resp => {
                expect(resp.statusCode).toBe(400);
                server.stop();
                done();
            });
    }).timeout(5000);

    it("should return 400 Bad Request for an empty query", (done) => {
        let testOptions = Object.assign({}, postOptions, {payload: invalidPayload});
        testOptions.payload.query = "";
        server
            .injectThen(testOptions)
            .then(resp => {
                expect(resp.statusCode).toBe(400);
                server.stop();
                done();
            });
    }).timeout(5000);

    it("should return 400 Bad Request for a query of spaces", (done) => {
        let testOptions = Object.assign({}, postOptions, {payload: invalidPayload});
        testOptions.payload.query = "      ";
        server
            .injectThen(testOptions)
            .then(resp => {
                expect(resp.statusCode).toBe(400);
                server.stop();
                done();
            });
    }).timeout(5000);

    it("should return 200 OK for unicode", (done) => {
        let testOptions = Object.assign({}, postOptions, {payload: invalidPayload});
        testOptions.payload.query = "björk";
        server
            .injectThen(testOptions)
            .then(resp => {
                expect(resp.statusCode).toBe(200);
                server.stop();
                done();
            });
    }).timeout(5000);

    it("should return 400 Bad Request for invalid lat/lng", (done) => {
        let testOptions = Object.assign({}, postOptions, {payload: invalidPayload});
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
        let testOptions = Object.assign({}, postOptions, {payload: invalidPayload});
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
        let testOptions = Object.assign({}, postOptions, {payload: invalidPayload});
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
        let testOptions = Object.assign({}, postOptions, {payload: invalidPayload});
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
