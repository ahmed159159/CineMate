import { FIREWORKS_KEY, FIREWORKS_MODEL } from "../../assets/key";
const FIREWORKS_BASE = "https://api.fireworks.ai/inference/v1";
export async function getMoviePromptResponse(promptText){
  const res = await fetch(`${FIREWORKS_BASE}/chat/completions`, {
    method: "POST",
    headers: {"Content-Type":"application/json","Authorization":`Bearer ${FIREWORKS_KEY}`},
    body: JSON.stringify({model:FIREWORKS_MODEL,messages:[{role:"system",content:"You are CineMate assistant. Reply concisely."},{role:"user",content:promptText}],max_tokens:300,temperature:0.7})
  });
  const data = await res.json();
  return data?.choices?.[0]?.message?.content || "";
}
