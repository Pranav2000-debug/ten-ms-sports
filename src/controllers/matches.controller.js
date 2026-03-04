import { createMatchSchema, listMatchesQuerySchema } from "../validation/matches.js";
import { matches } from "../db/schema.js";
import { db } from "../db/db.js";
import { getMatchStatus } from "../utils/match-status.js";
import * as z from "zod";
import { desc } from "drizzle-orm";

const MAX_LIMIT = 100;
// GET
export const getMatches = async (req, res) => {
  try {
    const parsed = listMatchesQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      const flattenedErrors = z.flattenError(parsed.error);
      console.log(flattenedErrors);
      return res.status(400).json({ message: "Invalid Query", details: flattenedErrors });
    }
    const limit = Math.min(parsed.data.limit ?? 50, MAX_LIMIT);
    const matchesList = await db.select().from(matches).orderBy(desc(matches.createdAt)).limit(limit);
    return res.status(200).json({ message: "Matches List", data: matchesList });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch matches", details: error });
  }
};
// POST
export const createMatch = async (req, res) => {
  const parsed = createMatchSchema.safeParse(req.body);
  if (!parsed.success) {
    const flattenedErrors = z.flattenError(parsed.error);
    console.log(flattenedErrors);
    return res.status(400).json({ message: "Invalid Payload", details: flattenedErrors });
  }

  try {
    const [event] = await db
      .insert(matches)
      .values({
        ...parsed.data,
        startTime: new Date(parsed.data.startTime),
        endTime: new Date(parsed.data.endTime),
        status: getMatchStatus(parsed.data.startTime, parsed.data.endTime),
        homeScore: parsed.data.homeScore ?? 0,
        awayScore: parsed.data.awayScore ?? 0,
      })
      .returning();

    res.status(201).json({ message: "Match created successfully", data: event });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: "Failed to create a match", details: errorMessage });
  }
};
