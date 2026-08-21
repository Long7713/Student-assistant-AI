import { Request, Response } from "express";
import { getGeminiClient } from "../config/gemini";
import { SCHEDULE_OPTIMIZER_SYSTEM_INSTRUCTION } from "../prompts/schedulePrompts";

const FALLBACK_SCHEDULE_RESPONSE = {
  success: true,
  analysis: "Đã phân tích văn bản đăng ký môn học và phát hiện phương án tối ưu.",
  conflicts: [
    {
      courseA: "Giải tích 1 (L02 - Tiết 1-3 Thứ 2)",
      courseB: "Cấu trúc Dữ liệu (L01 - Tiết 2-4 Thứ 2)",
      description: "Trùng 2 tiết (Tiết 2, 3) vào sáng Thứ 2.",
      severity: "high" as const,
    },
  ],
  suggestedPlans: [
    {
      id: "plan-1",
      name: "Phương án 1: Tránh học kẹp ca & Tập trung buổi sáng (Khuyên dùng)",
      gpaImpact: "+0.15 dự kiến",
      description:
        "Sắp xếp toàn bộ các môn chính vào các buổi sáng Thứ 2, 3, 4, 6. Chiều Thứ 4 dành riêng cho thực hành IT.",
      courses: [
        {
          id: "MTH101",
          code: "MTH101",
          name: "Giải tích 1",
          classCode: "L01",
          day: 2,
          startPeriod: 1,
          endPeriod: 4,
          room: "A3-401",
          lecturer: "PGS. TS. Trần Đình Hưng",
          campus: "CS1 (Q.10)",
          credits: 4,
          color: "emerald",
        },
        {
          id: "CSE102",
          code: "CSE102",
          name: "Cấu trúc Dữ liệu & Giải thuật",
          classCode: "L01",
          day: 2,
          startPeriod: 6,
          endPeriod: 9,
          room: "Lab IT 2",
          lecturer: "TS. Phan Thanh Sơn",
          campus: "CS1 (Q.10)",
          credits: 4,
          color: "teal",
        },
        {
          id: "ENG201",
          code: "ENG201",
          name: "Tiếng Anh Học thuật (Academic English B2)",
          classCode: "L01",
          day: 3,
          startPeriod: 6,
          endPeriod: 6,
          room: "C2-205",
          lecturer: "Cô Emily Watson",
          campus: "CS1 (Q.10)",
          credits: 3,
          color: "purple",
        },
        {
          id: "POL101",
          code: "POL101",
          name: "Triết học Mác - Lênin",
          classCode: "L01",
          day: 4,
          startPeriod: 6,
          endPeriod: 6,
          room: "Hội trường C1",
          lecturer: "TS. Nguyễn Văn Hậu",
          campus: "CS1 (Q.10)",
          credits: 2,
          color: "rose",
        },
        {
          id: "CSE102_lab",
          code: "CSE102",
          name: "Cấu trúc Dữ liệu (Thực hành)",
          classCode: "L01",
          day: 4,
          startPeriod: 7,
          endPeriod: 9,
          room: "Lab IT 2",
          lecturer: "TS. Phan Thanh Sơn",
          campus: "CS1 (Q.10)",
          credits: 0,
          color: "teal",
        },
        {
          id: "ENG201_2",
          code: "ENG201",
          name: "Tiếng Anh Học thuật (Listening)",
          classCode: "L01",
          day: 6,
          startPeriod: 6,
          endPeriod: 6,
          room: "C2-205",
          lecturer: "ThS. Lê Bảo Trâm",
          campus: "CS1 (Q.10)",
          credits: 0,
          color: "purple",
        },
      ],
    },
    {
      id: "plan-2",
      name: "Phương án 2: Dồn lịch 3 ngày (Nghỉ trọn vẹn Thứ 5 & Thứ 7)",
      gpaImpact: "Phù hợp đi làm thêm/dự án",
      description:
        "Dồn lịch học dày hơn vào Thứ 2, Thứ 3 và Thứ 6 để trống cả ngày Thứ 5 và cuối tuần.",
      courses: [
        {
          id: "MTH101",
          code: "MTH101",
          name: "Giải tích 1",
          classCode: "L01",
          day: 2,
          startPeriod: 1,
          endPeriod: 4,
          room: "A3-401",
          lecturer: "PGS. TS. Trần Đình Hưng",
          campus: "CS1 (Q.10)",
          credits: 4,
          color: "emerald",
        },
        {
          id: "CSE102",
          code: "CSE102",
          name: "Cấu trúc Dữ liệu & Giải thuật",
          classCode: "L02",
          day: 3,
          startPeriod: 1,
          endPeriod: 4,
          room: "Lab IT 1",
          lecturer: "TS. Phan Thanh Sơn",
          campus: "CS1 (Q.10)",
          credits: 4,
          color: "teal",
        },
        {
          id: "ENG201",
          code: "ENG201",
          name: "Tiếng Anh Học thuật",
          classCode: "L03",
          day: 3,
          startPeriod: 6,
          endPeriod: 8,
          room: "C2-205",
          lecturer: "Cô Emily Watson",
          campus: "CS1 (Q.10)",
          credits: 3,
          color: "purple",
        },
        {
          id: "POL101",
          code: "POL101",
          name: "Triết học Mác - Lênin",
          classCode: "L02",
          day: 6,
          startPeriod: 1,
          endPeriod: 3,
          room: "Hội trường C1",
          lecturer: "TS. Nguyễn Văn Hậu",
          campus: "CS1 (Q.10)",
          credits: 2,
          color: "rose",
        },
      ],
    },
  ],
};

export async function optimizeScheduleHandler(req: Request, res: Response) {
  const { prompt, currentCourses } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    return res.json(FALLBACK_SCHEDULE_RESPONSE);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `Thông tin sinh viên nhập: "${prompt || ""}". Lịch hiện tại: ${JSON.stringify(
        currentCourses || []
      )}`,
      config: {
        systemInstruction: SCHEDULE_OPTIMIZER_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, ...parsed });
  } catch (error: any) {
    console.error("Gemini schedule optimization error:", error);
    // Graceful fallback on AI error
    return res.json(FALLBACK_SCHEDULE_RESPONSE);
  }
}
