import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import express from "express";
import request from "supertest";

const dbMock = {
  insert: jest.fn().mockReturnThis(),
  values: jest.fn().mockReturnThis(),
  returning: jest.fn(),
};

jest.unstable_mockModule("../../src/db/db.js", () => ({
  db: dbMock,
  pool: {},
}));

const { default: matchRouter } = await import("../../src/routes/matches.routes.js");

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api/matches", matchRouter);
  return app;
};

describe("matches POST api tests with mocked drizzle db", () => {
  beforeEach(() => {
    dbMock.insert.mockClear().mockReturnThis();
    dbMock.values.mockClear().mockReturnThis();
    dbMock.returning.mockReset();
  });

  it("POST /api/matches should return 201 when db insert succeeds", async () => {
    const fakeEvent = {
      id: 1,
      sport: "football",
      homeTeam: "Team A",
      awayTeam: "Team B",
    };

    dbMock.returning.mockResolvedValue([fakeEvent]);

    const response = await request(buildApp()).post("/api/matches").send({
      sport: "football",
      homeTeam: "Team A",
      awayTeam: "Team B",
      startTime: "2026-03-04T10:00:00Z",
      endTime: "2026-03-04T12:00:00Z",
      homeScore: 0,
      awayScore: 0,
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "Match created successfully",
      data: fakeEvent,
    });
    expect(dbMock.insert).toHaveBeenCalledTimes(1);
    expect(dbMock.values).toHaveBeenCalledTimes(1);
    expect(dbMock.returning).toHaveBeenCalledTimes(1);
  });

  it("POST /api/matches should return 500 when db insert fails", async () => {
    dbMock.returning.mockRejectedValue(new Error("db insert failed"));

    const response = await request(buildApp()).post("/api/matches").send({
      sport: "football",
      homeTeam: "Team A",
      awayTeam: "Team B",
      startTime: "2026-03-04T10:00:00Z",
      endTime: "2026-03-04T12:00:00Z",
      homeScore: 0,
      awayScore: 0,
    });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Failed to create a match");
    expect(response.body).toHaveProperty("details");
  });
});
