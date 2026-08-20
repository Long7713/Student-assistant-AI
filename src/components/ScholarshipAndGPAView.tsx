import React, { useState } from "react";
import { 
  GraduationCap, 
  Target, 
  TrendingUp, 
  Award, 
  Calculator, 
  CheckCircle2, 
  Info,
  DollarSign
} from "lucide-react";

export const ScholarshipAndGPAView: React.FC = () => {
  const [targetGpa, setTargetGpa] = useState<number>(3.80);
  const currentGpa = 3.68;

  const coursesGpa = [
    { code: "MTH101", name: "Giải tích 1", credits: 4, midTerm: 8.5, finalNeeded: 8.8, currentScore: "A-" },
    { code: "CSE102", name: "Cấu trúc Dữ liệu & Giải thuật", credits: 4, midTerm: 9.0, finalNeeded: 8.5, currentScore: "A" },
    { code: "ENG201", name: "Tiếng Anh Học thuật B2", credits: 3, midTerm: 8.0, finalNeeded: 9.0, currentScore: "B+" },
    { code: "POL101", name: "Triết học Mác - Lênin", credits: 2, midTerm: 8.5, finalNeeded: 8.0, currentScore: "A-" },
  ];

  const scholarships = [
    {
      name: "Học bổng Khuyến khích Học tập - Loại Xuất sắc (ĐHQG)",
      reward: "10.000.000 VNĐ / Kỳ",
      gpaReq: "≥ 3.60",
      drlReq: "≥ 90/100",
      status: "Đủ điều kiện GPA (Cần thêm +2 ĐRL)",
      eligible: true,
    },
    {
      name: "Học bổng Tài năng Trẻ Google & Doanh nghiệp Công nghệ",
      reward: "25.000.000 VNĐ + Suất Thực tập",
      gpaReq: "≥ 3.75",
      drlReq: "≥ 85/100",
      status: "Cần nâng GPA từ 3.68 -> 3.75",
      eligible: false,
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Săn Học Bổng & Chiến Lược Kéo GPA Hệ 4
            </h2>
            <span className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-slate-200">
              Mục tiêu: {targetGpa.toFixed(2)} / 4.0
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Tính toán điểm thi cuối kỳ tối thiểu cho từng môn để đạt danh hiệu Sinh viên Giỏi / Xuất Sắc
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl">
          <Target className="w-4 h-4 text-emerald-600" />
          <div className="text-xs font-semibold text-slate-700">
            Cần tăng thêm: <strong className="text-slate-900 font-bold">+0.12 GPA</strong>
          </div>
        </div>
      </div>

      {/* Target Simulator & Scholarships */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GPA Simulator */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-slate-700" />
              <span>Dự Toán Điểm Cuối Kỳ Tối Thiểu</span>
            </h3>
            <span className="text-xs text-slate-400">Trọng số 30% GK - 70% CK</span>
          </div>

          <div className="space-y-3">
            {coursesGpa.map((c, idx) => (
              <div key={idx} className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{c.name} ({c.credits} TC)</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Giữa kỳ: {c.midTerm} • Dự kiến: {c.currentScore}</p>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Cần thi cuối kỳ</div>
                  <div className="text-sm font-bold text-slate-900">≥ {c.finalNeeded} đ</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Scholarships */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-slate-700" />
              <span>Danh Sách Học Bổng Đang Mở Đơn</span>
            </h3>
            <span className="text-xs text-slate-600 font-medium">2 Học bổng phù hợp</span>
          </div>

          <div className="space-y-3">
            {scholarships.map((s, idx) => (
              <div key={idx} className="bg-slate-50/50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-900">{s.name}</h4>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md shrink-0">
                    {s.reward}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-600">
                  <span>Yêu cầu GPA: <strong>{s.gpaReq}</strong></span>
                  <span>•</span>
                  <span>ĐRL: <strong>{s.drlReq}</strong></span>
                </div>
                <div className={`text-[11px] font-semibold px-2 py-1 rounded-md ${
                  s.eligible ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-slate-100 text-slate-700 border border-slate-200"
                }`}>
                  {s.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
