import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST 요청만 허용됩니다." });

  const { weather, mood } = req.body;

  if (!weather || !mood) {
    return res.status(400).json({ error: "날씨와 기분이 필요합니다." });
  }

  try {
    const today = new Date().toISOString().slice(0, 10);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
오늘은 ${today}, 날씨는 "${weather}", 기분은 "${mood}"입니다.
이런 날에 어울리는 노래를 1곡 이내로 추천해주세요.
노래는 짧은 추천 이유를 포함해주세요. 보이넥스트도어라는 남자 아이돌 그룹으로 범위를 제한하겠습니다.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    res.status(200).json({ answer: text });
  } catch (error) {
    console.error("🔥 Gemini API Error:", error);
    res.status(500).json({ error: "서버 에러가 발생했습니다." });
  }
}