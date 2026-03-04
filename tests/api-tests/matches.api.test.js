import { describe, expect, it } from "@jest/globals";
import express from "express";
import request from "supertest";
import matchRouter from "../../src/routes/matches.routes.js";

describe("matches api tests", () => {
  it("GET /api/matches?limit=1 should return up to one match from real db", async () => {
    const app = express();
    app.use(express.json());
    app.use("/api/matches", matchRouter);

    const response = await request(app).get("/api/matches?limit=1");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Matches List");
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeLessThanOrEqual(1);
  });
});
