import express from "express";
import cors from "cors";
import { chatRouter } from "./routes/chat";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "API running" });
});

app.use("/api/chat", chatRouter);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
