import { getGenreList, getGenresForArtist } from "../../../src/backend/db/queries";
import expect from "expect";

describe("Querying the database", () => {

    it("should return a list of genres", (done) => {
        getGenreList((err, rows) => {
            expect(rows.length).toExist();
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