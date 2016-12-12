import expect from "expect";
import moment from "moment";
import server from "../../src/backend-hapi/server";

describe("The basic server routes", () => {
    let options = {
        method: "GET",
        url: "/"
    };
    let postOptions = {
        method: "POST",
        url: "/api/search",
        headers: {
            "content-type": "application/json"
        },
        payload: {
            query: "ben UFO",
            mindate: moment().format("YYYY-MM-DD"),
            maxdate: moment().add(3, "days").format("YYYY-MM-DD"),
            lat: 51.5,
            lng: -0.12,
            radius: 0.8
        }
    };

    it("should return 200 OK for index", (done) => {
        server.inject(options, response => {
            expect(response.statusCode).toBe(200);
            server.stop();
            done();
        });
    });
    it("should return a JSON list of event sorted by weighting", (done) => {
        server
            .injectThen(postOptions)
            .then(resp => {
                expect(resp.statusCode).toBe(200);
                const events = JSON.parse(resp.payload);
                expect(events.length).toBeGreaterThan(0);
                let weighting = events[0].weighting;
                events.forEach(event => {
                    expect(event.weighting).toBeLessThanOrEqualTo(weighting);
                    weighting = event.weighting;
                });
                server.stop();
                done();
            });
    });
});
