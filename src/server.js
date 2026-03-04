import express from "express";
import cookieParser from "cookie-parser";

// Routes Imports
import matchRouter from "./routes/matches.routes.js";

const app = express();
const PORT = 8000;

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(cookieParser())

// Routes
app.use('/api/matches', matchRouter)

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
