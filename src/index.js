import express from "express";
import cookieParser from "cookie-parser";

const app = express();
const PORT = 8000;

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(cookieParser())

app.get("/", (req, res) => {
  res.json({ message: "Server is running." });
});

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
