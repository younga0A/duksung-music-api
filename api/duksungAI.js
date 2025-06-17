import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "POST 요청만 허용됩니다." });

  const body = await new Promise((resolve, reject) => {
    let data = "";
    req.on("data", chunk => (data += chunk));
    req.on("end", () => resolve(data));
    req.on("error", err => reject(err));
  });

  if (!body) return res.status(400).json({ error: "빈 요청입니다." });

  const { weather, mood } = JSON.parse(body);
  if (!weather || !mood) {
    return res.status(400).json({ error: "날씨(weather)와 기분(mood)이 필요합니다." });
  }

  try {
    const today = new Date().toISOString().slice(0, 10);

    const prompt = `
오늘은 ${today}이고, 날씨는 "${weather}"이며, 기분은 "${mood}"야.
이런 상황에서 듣기 좋은 노래를 하나 추천해줘.
노래는 보이넥스트도어라는 보이그룹 노래 중에 추천해주고,
왜 추천하는지도 간단히 설명해줘.
`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // 쿼터 줄이기 위해 flash
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.status(200).json({ result: text });
  } catch (err) {
    console.error("🔥 Gemini API Error:", err);
    res.status(500).json({
      error: "Gemini API 오류 발생",
      message: err.message
    });
  }
}
