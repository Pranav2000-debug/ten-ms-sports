import { Router } from "express";
import { createMatch, getMatches } from "../controllers/matches.controller.js";

export const matchRouter = Router();

matchRouter.get("/", getMatches);
matchRouter.post("/", createMatch);

export default matchRouter;
