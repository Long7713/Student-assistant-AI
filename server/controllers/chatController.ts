import { Request, Response } from "express";
import { getGeminiClient } from "../config/gemini";
import { GENZ_CHAT_SYSTEM_INSTRUCTION } from "../prompts/chatPrompts";

const FALLBACK_CHAT_REPLY = `Chào bạn! Mình là AI Gen Z trợ lý của EduMind 🚀. Hiện tại mình thấy bạn có 2 deadline quan trọng cần nộp trong 48h tới (Bài tập lớn Cấu trúc Dữ liệu & Essay Tiếng Anh). Hãy vào tab "Tối ưu TKB" để sắp xếp thời gian cày cuốc hiệu quả nhé! ✨`;

export async function chatHandler(req: Request, res: Response) {
  const { message, context } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    return res.json({
      success: true,
      reply: FALLBACK_CHAT_REPLY,
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `Câu hỏi của sinh viên: "${message || ""}". Dữ liệu học tập sinh viên: ${JSON.stringify(
        context || {}
      )}`,
      config: {
        systemInstruction: GENZ_CHAT_SYSTEM_INSTRUCTION,
      },
    });

    return res.json({
      success: true,
      reply: response.text || FALLBACK_CHAT_REPLY,
    });
  } catch (error: any) {
    console.error("Gemini chat error:", error);
    return res.json({
      success: true,
      reply: "Xin lỗi bạn, kết nối AI đang bận chút xíu. Nhưng tinh thần học tập thì không được nguội nha! Thử hỏi lại mình nhé! 🌟",
    });
  }
}
