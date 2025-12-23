import axios from "axios";

const OLLAMA_BASE = "http://localhost:11434";

export async function generateText(prompt: string, model = "llama3") {
  const res = await axios.post(`${OLLAMA_BASE}/api/generate`, {
    model,
    prompt,
    stream: false,
  });
  return res.data.response as string;
}
