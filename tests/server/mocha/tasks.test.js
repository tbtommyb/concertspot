import expect from "expect";
import { sanitise } from "../../../src/backend/tasks";

describe("Sanitise function", () => {
    it("should return 'techno' from 'TECHNO music'", () => {
        expect(sanitise("TECHNO music")).toEqual("techno");
    });
});