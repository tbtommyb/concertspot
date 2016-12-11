import { getGenres, getGenresForArtist } from "../../src/backend-hapi/db";
import expect from "expect";

describe("Querying the database", () => {

    it("should return a list of genres", (done) => {
        getGenres((err, rows) => {
            expect(rows.length).toExist();
            expect(rows[0]).toIncludeKey("name");
            done();
        });
    });

    it("should return a list of genres for query 'metallica'", (done) => {
        getGenresForArtist("metallica", (err, rows) => {
            expect(rows.length).toEqual(3);
            expect(rows[0]).toIncludeKeys(["name", "weighting"]);
            done();
        });
    });
});