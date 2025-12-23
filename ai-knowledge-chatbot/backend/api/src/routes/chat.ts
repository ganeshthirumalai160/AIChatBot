import { Router } from "express";
import { generateText } from "../services/ollamaService";

export const chatRouter = Router();

chatRouter.post("/simple", async (req, res) => {
  try {
    const { question } = req.body;
    const answer = await generateText(`Answer this question:\n${question}`);
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ollama error" });
  }
});
