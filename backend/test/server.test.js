const moment = require("moment");
const initialiseServer = require("../server");
const Code = require("code");
const expect = Code.expect;
const Lab = require("lab");
const lab = exports.lab = Lab.script();

lab.test("GET / returns successfully", async () => {
    const server = await initialiseServer();
    const response = await server.inject({ method: "GET", url: "/" });

    expect(response.statusCode).to.equal(200);
});

lab.experiment("POST to /api", async () => {
    const server = await initialiseServer();
    const postOptions = {
        method: "POST",
        url: "/api/search",
        headers: {
            "content-type": "application/json"
        }
    };

    lab.experiment("with a valid payload", () => {
        const payload = {
            query: "ben UFO",
            mindate: moment().format("YYYY-MM-DD"),
            maxdate: moment().add(3, "days").format("YYYY-MM-DD"),
            lat: 51.5,
            lng: -0.12,
            radius: 2.0
        };

        const expectedFields = [
            "artists",
            "date",
            "description",
            "genres",
            "id",
            "imageurl",
            "largeimageurl",
            "link",
            "price",
            "tickets",
            "title",
            "venue",
            "times",
            "active",
            "weighting"
        ];


        const maxWeighting = 100;

        lab.test("returns a JSON list of events", async () => {
            const response = await server.inject({ ...postOptions, payload });

            expect(response.statusCode).to.equal(200);
            expect(response.headers["content-type"])
                .to.equal("application/json; charset=utf-8");
            expect(response.result.events).to.be.an.array();
        });

        lab.test("returns events with required fields", async () => {
            const response = await server.inject({ ...postOptions, payload });
            const event = response.result.events[0];

            expect(event).to.only.include(expectedFields);
        });

        lab.test("returns events in descending order of weighting", async () => {
            const response = await server.inject({ ...postOptions, payload });
            const events = response.result.events;

            let weighting = maxWeighting;

            events.forEach(event => {
                expect(event.weighting).to.satisfy(w => w <= weighting);
                weighting = event.weighting;
            });
        });
    });

    lab.experiment("with an invalid payload", () => {
        lab.experiment("non-number radius", () => {
            const payload = {
                query: "ben UFO",
                mindate: moment().format("YYYY-MM-DD"),
                maxdate: moment().add(3, "days").format("YYYY-MM-DD"),
                lat: 51.5,
                lng: -0.12,
                radius: "dfdfdf",
            };

            lab.test("returns 400", async () => {
                const response = await server.inject({ ...postOptions, payload });

                expect(response.statusCode).to.equal(400);
            });
        });

        lab.experiment("zero radius", () => {
            const payload = {
                query: "ben UFO",
                mindate: moment().format("YYYY-MM-DD"),
                maxdate: moment().add(3, "days").format("YYYY-MM-DD"),
                lat: 51.5,
                lng: -0.12,
                radius: 0,
            };

            lab.test("returns 400", async () => {
                const response = await server.inject({ ...postOptions, payload });

                expect(response.statusCode).to.equal(400);
            });
        });

        lab.experiment("negative radius", () => {
            const payload = {
                query: "ben UFO",
                mindate: moment().format("YYYY-MM-DD"),
                maxdate: moment().add(3, "days").format("YYYY-MM-DD"),
                lat: 51.5,
                lng: -0.12,
                radius: -2,
            };

            lab.test("returns 400", async () => {
                const response = await server.inject({ ...postOptions, payload });

                expect(response.statusCode).to.equal(400);
            });
        });

        lab.experiment("lat", () => {
            const payload = {
                query: "ben UFO",
                mindate: moment().format("YYYY-MM-DD"),
                maxdate: moment().add(3, "days").format("YYYY-MM-DD"),
                lat: 351.5,
                lng: -0.12,
                radius: 3,
            };

            lab.test("returns 400", async () => {
                const response = await server.inject({ ...postOptions, payload });

                expect(response.statusCode).to.equal(400);
            });
        });

        lab.experiment("lng", () => {
            const payload = {
                query: "ben UFO",
                mindate: moment().format("YYYY-MM-DD"),
                maxdate: moment().add(3, "days").format("YYYY-MM-DD"),
                lat: 51.5,
                lng: -1000.12,
                radius: 3,
            };

            lab.test("returns 400", async () => {
                const response = await server.inject({ ...postOptions, payload });

                expect(response.statusCode).to.equal(400);
            });
        });

        lab.experiment("empty query", () => {
            const payload = {
                query: "",
                mindate: moment().format("YYYY-MM-DD"),
                maxdate: moment().add(3, "days").format("YYYY-MM-DD"),
                lat: 51.5,
                lng: -0.12,
                radius: 3,
            };

            lab.test("returns 400", async () => {
                const response = await server.inject({ ...postOptions, payload });

                expect(response.statusCode).to.equal(400);
            });
        });

        lab.experiment("malformed mindate", () => {
            const payload = {
                query: "",
                mindate: "20182-32-32",
                maxdate: moment().add(3, "days").format("YYYY-MM-DD"),
                lat: 51.5,
                lng: -0.12,
                radius: 3,
            };

            lab.test("returns 400", async () => {
                const response = await server.inject({ ...postOptions, payload });

                expect(response.statusCode).to.equal(400);
            });
        });

        lab.experiment("mindate in the past", () => {
            const payload = {
                query: "",
                mindate: "2013-02-02",
                maxdate: moment().add(3, "days").format("YYYY-MM-DD"),
                lat: 51.5,
                lng: -0.12,
                radius: 3,
            };

            lab.test("returns 400", async () => {
                const response = await server.inject({ ...postOptions, payload });

                expect(response.statusCode).to.equal(400);
            });
        });

        lab.experiment("malformed maxdate", () => {
            const payload = {
                query: "",
                mindate: moment().format("YYYY-MM-DD"),
                maxdate: "20182-32-32",
                lat: 51.5,
                lng: -0.12,
                radius: 3,
            };

            lab.test("returns 400", async () => {
                const response = await server.inject({ ...postOptions, payload });

                expect(response.statusCode).to.equal(400);
            });
        });

        lab.experiment("maxdate in the past", () => {
            const payload = {
                query: "",
                mindate: moment().format("YYYY-MM-DD"),
                maxdate: "2013-02-02",
                lat: 51.5,
                lng: -0.12,
                radius: 3,
            };

            lab.test("returns 400", async () => {
                const response = await server.inject({ ...postOptions, payload });

                expect(response.statusCode).to.equal(400);
            });
        });
    });
});
