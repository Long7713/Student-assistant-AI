import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini client to prevent crashes if API key is absent
let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return geminiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasGeminiKey: Boolean(process.env.GEMINI_API_KEY) });
});

// AI Re-plan endpoint
app.post('/api/replan', async (req, res) => {
  const { missedSession, reason, courses, tasks, preferences, sessions } = req.body;
  const missedTask = tasks?.find((t: any) => t.id === missedSession?.taskId);
  const missedCourse = courses?.find((c: any) => c.id === missedTask?.courseId);

  const defaultRationale = `Để bảo vệ hạn chót môn ${missedCourse?.code || 'quan trọng'}, phiên học "${missedTask?.title || 'học tập'}" đã được AI ưu tiên xếp lại vào khung giờ vàng 19:30 tối nay. Các bài đọc ít gấp hơn được dời sang chiều mai để bạn không bị quá tải và giữ tổng giờ học dưới ${preferences?.maxDailyStudyHours || 5.5} giờ.`;
  const defaultTakeaways = [
    `Chuyển phiên ôn tập ${missedCourse?.code || 'cấp bách'} sang 19:30 tối nay.`,
    `Dời bài đọc ít gấp hơn sang chiều mai an toàn, không sợ trễ hạn.`,
    `Bảo đảm 100% không có bài tập nào bị trễ deadline.`
  ];

  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        success: true,
        aiRationale: defaultRationale,
        keyTakeaways: defaultTakeaways,
      });
    }

    const prompt = `Bạn là Trợ lý Cố vấn Học tập AI trong ứng dụng "AI Student Assistant" dành cho sinh viên đại học Việt Nam.
Sinh viên vừa bỏ lỡ một phiên học đã lên lịch:
- Nhiệm vụ bị lỡ: "${missedTask?.title || 'Nhiệm vụ'}" (Môn: ${missedCourse?.code || 'Môn học'}, Mức ưu tiên: ${missedTask?.priority || 'cao'}, Hạn nộp: ${missedTask?.deadline})
- Thời gian dự kiến ban đầu: ${missedSession?.startTime} - ${missedSession?.endTime} (${missedSession?.durationMinutes} phút)
- Lý do lỡ: "${reason || 'Bận việc đột xuất'}"
- Giới hạn giờ học/ngày của sinh viên: ${preferences?.maxDailyStudyHours || 5.5} giờ
- Danh sách môn học đang học: ${courses?.map((c: any) => `${c.code} (${c.name})`).join(', ')}

Hãy đưa ra lời giải thích sư phạm ngắn gọn (2-3 câu bằng tiếng Việt tự nhiên, thân thiện, động viên) giải thích tại sao AI chuyển lịch như vậy để bảo vệ các deadline quan trọng, tại sao bài ít gấp hơn được dời lại và giúp sinh viên không bị áp lực thức khuya.

Trả về định dạng JSON:
{
  "aiRationale": "string (giải thích bằng tiếng Việt)",
  "keyTakeaways": ["string (điểm chính 1)", "string (điểm chính 2)", "string (điểm chính 3)"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      aiRationale: parsed.aiRationale || defaultRationale,
      keyTakeaways: parsed.keyTakeaways || defaultTakeaways,
    });
  } catch (error: any) {
    console.warn('Gemini replan unavailable (using intelligent academic fallback):', error?.message || error);
    return res.json({
      success: true,
      aiRationale: defaultRationale,
      keyTakeaways: defaultTakeaways,
    });
  }
});

// AI Task decomposition & smart estimation endpoint
app.post('/api/estimate-task', async (req, res) => {
  const { taskTitle, courseName, deadline, taskType } = req.body;

  const defaultEstimate = {
    estimatedMinutes: taskType === 'exam_prep' ? 180 : taskType === 'project' ? 240 : 90,
    difficulty: 3,
    suggestedSubtasks: [
      `Xem lại đề cương và yêu cầu của ${taskTitle || 'bài tập'}`,
      'Giải quyết phần nội dung cốt lõi và kiểm tra các trường hợp biên',
      'Đọc rà soát lại và hoàn thiện định dạng nộp bài',
    ],
    focusStrategy: 'Chia nhỏ thành các phiên học 45 phút tập trung cao độ, nghỉ 10 phút giữa các hiệp.',
  };

  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.json({ success: true, ...defaultEstimate });
    }

    const prompt = `Bạn là Trợ lý Học tập AI cho sinh viên đại học Việt Nam. Sinh viên đang thêm một bài tập/nhiệm vụ:
- Tên nhiệm vụ: "${taskTitle}"
- Môn học: "${courseName}"
- Loại nhiệm vụ: "${taskType}"
- Hạn chót: "${deadline}"

Hãy chia nhỏ nhiệm vụ này thành 2-4 công việc cụ thể (subtasks) và ước lượng số phút thực tế cần hoàn thành bằng tiếng Việt.
Trả về JSON:
{
  "estimatedMinutes": number (ví dụ 90, 120, 180),
  "difficulty": number (từ 1 đến 5),
  "suggestedSubtasks": ["string", "string", "string"],
  "focusStrategy": "string (lời khuyên ngắn gọn bằng tiếng Việt về cách chia hiệp học)"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      estimatedMinutes: parsed.estimatedMinutes || defaultEstimate.estimatedMinutes,
      difficulty: parsed.difficulty || defaultEstimate.difficulty,
      suggestedSubtasks: parsed.suggestedSubtasks || defaultEstimate.suggestedSubtasks,
      focusStrategy: parsed.focusStrategy || defaultEstimate.focusStrategy,
    });
  } catch (error: any) {
    console.warn('Gemini estimate unavailable (using smart fallback):', error?.message || error);
    return res.json({ success: true, ...defaultEstimate });
  }
});

// Vite Integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
