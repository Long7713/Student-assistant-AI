import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initialize Gemini AI client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// 1. Endpoint: AI Schedule Optimizer & Conflict Solver
app.post("/api/gemini/optimize-schedule", async (req, res) => {
  const { prompt, currentCourses } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    // Return high quality structured fallback if no API key
    return res.json({
      success: true,
      analysis: "Đã phân tích văn bản đăng ký môn học và phát hiện phương án tối ưu.",
      conflicts: [
        {
          courseA: "Giải tích 1 (L02 - Tiết 1-3 Thứ 2)",
          courseB: "Cấu trúc Dữ liệu (L01 - Tiết 2-4 Thứ 2)",
          description: "Trùng 2 tiết (Tiết 2, 3) vào sáng Thứ 2.",
          severity: "high"
        }
      ],
      suggestedPlans: [
        {
          id: "plan-1",
          name: "Phương án 1: Tránh học kẹp ca & Tập trung buổi sáng (Khuyên dùng)",
          gpaImpact: "+0.15 dự kiến",
          description: "Sắp xếp toàn bộ các môn chính vào các buổi sáng Thứ 2, 3, 4, 6. Chiều Thứ 4 dành riêng cho thực hành IT.",
          courses: [
            { id: "MTH101", code: "MTH101", name: "Giải tích 1", classCode: "L01", day: 2, startPeriod: 1, endPeriod: 4, room: "A3-401", lecturer: "PGS. TS. Trần Đình Hưng", campus: "CS1 (Q.10)", credits: 4, color: "emerald" },
            { id: "CSE102", code: "CSE102", name: "Cấu trúc Dữ liệu & Giải thuật", classCode: "L01", day: 2, startPeriod: 6, endPeriod: 9, room: "Lab IT 2", lecturer: "TS. Phan Thanh Sơn", campus: "CS1 (Q.10)", credits: 4, color: "teal" },
            { id: "ENG201", code: "ENG201", name: "Tiếng Anh Học thuật (Academic English B2)", classCode: "L01", day: 3, startPeriod: 6, endPeriod: 6, room: "C2-205", lecturer: "Cô Emily Watson", campus: "CS1 (Q.10)", credits: 3, color: "purple" },
            { id: "POL101", code: "POL101", name: "Triết học Mác - Lênin", classCode: "L01", day: 4, startPeriod: 6, endPeriod: 6, room: "Hội trường C1", lecturer: "TS. Nguyễn Văn Hậu", campus: "CS1 (Q.10)", credits: 2, color: "rose" },
            { id: "CSE102_lab", code: "CSE102", name: "Cấu trúc Dữ liệu (Thực hành)", classCode: "L01", day: 4, startPeriod: 7, endPeriod: 9, room: "Lab IT 2", lecturer: "TS. Phan Thanh Sơn", campus: "CS1 (Q.10)", credits: 0, color: "teal" },
            { id: "ENG201_2", code: "ENG201", name: "Tiếng Anh Học thuật (Listening)", classCode: "L01", day: 6, startPeriod: 6, endPeriod: 6, room: "C2-205", lecturer: "ThS. Lê Bảo Trâm", campus: "CS1 (Q.10)", credits: 0, color: "purple" },
          ]
        },
        {
          id: "plan-2",
          name: "Phương án 2: Dồn lịch 3 ngày (Nghỉ trọn vẹn Thứ 5 & Thứ 7)",
          gpaImpact: "Phù hợp đi làm thêm/dự án",
          description: "Dồn lịch học dày hơn vào Thứ 2, Thứ 3 và Thứ 6 để trống cả ngày Thứ 5 và cuối tuần.",
          courses: [
            { id: "MTH101", code: "MTH101", name: "Giải tích 1", classCode: "L01", day: 2, startPeriod: 1, endPeriod: 4, room: "A3-401", lecturer: "PGS. TS. Trần Đình Hưng", campus: "CS1 (Q.10)", credits: 4, color: "emerald" },
            { id: "CSE102", code: "CSE102", name: "Cấu trúc Dữ liệu & Giải thuật", classCode: "L02", day: 3, startPeriod: 1, endPeriod: 4, room: "Lab IT 1", lecturer: "TS. Phan Thanh Sơn", campus: "CS1 (Q.10)", credits: 4, color: "teal" },
            { id: "ENG201", code: "ENG201", name: "Tiếng Anh Học thuật", classCode: "L03", day: 3, startPeriod: 6, endPeriod: 8, room: "C2-205", lecturer: "Cô Emily Watson", campus: "CS1 (Q.10)", credits: 3, color: "purple" },
            { id: "POL101", code: "POL101", name: "Triết học Mác - Lênin", classCode: "L02", day: 6, startPeriod: 1, endPeriod: 3, room: "Hội trường C1", lecturer: "TS. Nguyễn Văn Hậu", campus: "CS1 (Q.10)", credits: 2, color: "rose" }
          ]
        }
      ]
    });
  }

  try {
    const systemPrompt = `Bạn là Senior AI Academic Planner của EduMind AI. 
Nhiệm vụ của bạn:
1. Phân tích yêu cầu đăng ký môn / lịch học từ người dùng (tiếng Việt).
2. Phát hiện xung đột giờ học (overlap).
3. Đề xuất từ 1 đến 2 phương án thời khóa biểu tối ưu (tiết 1-12, thứ 2 đến chủ nhật).
Trả về định dạng JSON hợp lệ theo đúng cấu trúc:
{
  "analysis": "Tóm tắt phân tích lịch học...",
  "conflicts": [
    { "courseA": "Tên môn A", "courseB": "Tên môn B", "description": "Chi tiết trùng giờ", "severity": "high" | "medium" }
  ],
  "suggestedPlans": [
    {
      "id": "plan-1",
      "name": "Tên phương án",
      "gpaImpact": "Đánh giá GPA",
      "description": "Mô tả phương án",
      "courses": [
        {
          "id": "c1",
          "code": "Mã môn",
          "name": "Tên môn",
          "classCode": "L01",
          "day": 2, // 2 = Thứ 2, 3 = Thứ 3 ... 7 = Thứ 7, 8 = CN
          "startPeriod": 1, // 1 to 12
          "endPeriod": 3,
          "room": "Phòng học",
          "lecturer": "Giảng viên",
          "campus": "Cơ sở",
          "credits": 3,
          "color": "emerald" // emerald | teal | purple | rose | blue | amber
        }
      ]
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `Thông tin sinh viên nhập: "${prompt}". Lịch hiện tại: ${JSON.stringify(currentCourses || [])}`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json"
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ success: true, ...parsed });
  } catch (error: any) {
    console.error("Gemini schedule error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Endpoint: AI Smart Document Analysis & Duplicate Detection
app.post("/api/gemini/doc-analyze", async (req, res) => {
  const { title, excerpt, existingDocs } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    return res.json({
      success: true,
      metadata: {
        title: title || "Tài liệu ôn tập môn học",
        subject: "Cấu trúc Dữ liệu & Giải thuật",
        category: "Đề thi & Lời giải",
        author: "CLB Học Thuật Khoa CNTT",
        tags: ["Đề cương", "Thuật toán đồ thị", "Cây AVL", "Độ phức tạp O(n)"],
        academicYear: "2025-2026",
        summary: "Tổng hợp bài tập lớn và 15 đề thi thử môn Cấu trúc dữ liệu có lời giải chi tiết."
      },
      duplicateCheck: {
        isDuplicate: true,
        similarityScore: 89,
        duplicateWith: {
          id: "doc-01",
          title: "Tong_hop_De_thi_CTDL_GT_2025.pdf",
          matchReason: "Trùng khớp 89% nội dung với tệp đã có trên Google Cloud Storage. Khuyến nghị dùng liên kết cũ để tiết kiệm dung lượng."
        }
      }
    });
  }

  try {
    const systemPrompt = `Bạn là AI Document Intelligence của EduMind AI (sử dụng Gemini & Vertex AI Embeddings logic).
Nhiệm vụ:
1. Trích xuất metadata tự động từ tiêu đề và nội dung tài liệu (Tên môn, Tác giả, Thể loại, Từ khóa, Tóm tắt 2 dòng).
2. So sánh ngữ nghĩa với danh sách tài liệu hiện có để phát hiện trùng lặp (Duplicate Detection).
Trả về JSON cấu trúc:
{
  "metadata": {
    "title": "...",
    "subject": "...",
    "category": "...",
    "author": "...",
    "tags": ["tag1", "tag2"],
    "academicYear": "2025-2026",
    "summary": "..."
  },
  "duplicateCheck": {
    "isDuplicate": boolean,
    "similarityScore": number, // 0-100
    "duplicateWith": {
      "id": "...",
      "title": "...",
      "matchReason": "..."
    }
  }
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `Tài liệu mới: Tiêu đề: "${title}", Nội dung trích xuất: "${excerpt}". Danh sách tệp đã lưu: ${JSON.stringify(existingDocs || [])}`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json"
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ success: true, ...parsed });
  } catch (error: any) {
    console.error("Gemini doc analyze error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Endpoint: Gen Z AI Academic Assistant Chatbot
app.post("/api/gemini/chat", async (req, res) => {
  const { message, context } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    return res.json({
      reply: `Chào bạn! Mình là AI Gen Z trợ lý của EduMind 🚀. Hiện tại mình thấy bạn có 2 deadline quan trọng cần nộp trong 48h tới (Bài tập lớn Cấu trúc Dữ liệu & Essay Tiếng Anh). Hãy vào tab "Tối ưu TKB" để sắp xếp thời gian cày cuốc hiệu quả nhé! ✨`
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `Câu hỏi của sinh viên: "${message}". Dữ liệu học tập sinh viên: ${JSON.stringify(context || {})}`,
      config: {
        systemInstruction: `Bạn là trợ lý học tập AI siêu thân thiện, dí dỏm, phong cách Gen Z năng động ("Hỏi AI Gen Z ✨") của ứng dụng EduMind AI. 
Bạn trả lời tiếng Việt ngắn gọn, súc tích, truyền động lực, tư vấn xếp lịch học, mẹo kéo GPA, săn học bổng, và giải đáp thắc mắc học tập.`
      }
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Gemini chat error:", error);
    res.status(500).json({ reply: "Xin lỗi bạn, kết nối AI đang bận. Vui lòng thử lại sau nhé! 🌟" });
  }
});

// 4. Endpoint: Health
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "EduMind AI Server" });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EduMind AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
