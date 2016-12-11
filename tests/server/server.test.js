import expect from "expect";
import server from "../../src/backend-hapi/server";

describe("The basic server routes", () => {
    let options = {
        method: "GET",
        url: "/"
    };
    it("should return 200 OK for index", (done) => {
        server.inject(options, response => {
            expect(response.statusCode).toBe(200);
            server.stop();
            done();
        });
    });
});
