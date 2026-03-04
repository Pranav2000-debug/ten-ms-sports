import { describe, expect, it, jest } from "@jest/globals";
import { getMatches } from "../../src/controllers/matches.controller.js";

describe("matches controller unit tests", () => {
  it("getMatches should return 200 with matches list message", () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    getMatches(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Matches List" });
  });
});
