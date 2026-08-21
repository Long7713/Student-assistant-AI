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
import { useApp } from "../context/AppContext";

export const ScholarshipAndGPAView: React.FC = () => {
  const { userProfile, updateUserProfile } = useApp();
  const [targetGpa, setTargetGpa] = useState<number>(3.80);
  const currentGpa = userProfile.gpa;

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
      status: `Đủ điều kiện GPA (${currentGpa.toFixed(2)} ≥ 3.60). Cần thêm +${Math.max(0, 90 - userProfile.drl)} ĐRL`,
      eligible: currentGpa >= 3.60,
    },
    {
      name: "Học bổng Tài năng Trẻ Google & Doanh nghiệp Công nghệ",
      reward: "25.000.000 VNĐ + Suất Thực tập",
      gpaReq: "≥ 3.75",
      drlReq: "≥ 85/100",
      status: currentGpa >= 3.75 ? "Đủ điều kiện toàn diện" : `Cần nâng GPA từ ${currentGpa.toFixed(2)} -> 3.75`,
      eligible: currentGpa >= 3.75,
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

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">GPA Hiện tại</span>
            <div className="text-lg font-bold text-slate-900">{currentGpa.toFixed(2)} / 4.0</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-2xs">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Target Adjuster Slider */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-slate-700" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Tùy Chỉnh Mục Tiêu GPA Học Kỳ Này
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
            {targetGpa.toFixed(2)} / 4.0
          </span>
        </div>

        <input 
          type="range" 
          min="3.20" 
          max="4.00" 
          step="0.05"
          value={targetGpa}
          onChange={(e) => setTargetGpa(parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
        />

        <div className="flex justify-between text-[11px] text-slate-400 font-medium">
          <span>3.20 (Khá)</span>
          <span>3.60 (Giỏi - Học bổng KKHT)</span>
          <span>3.80 (Xuất sắc)</span>
          <span>4.00 (Thủ khoa)</span>
        </div>
      </div>

      {/* Course Grade Breakdown Matrix */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Calculator className="w-4 h-4 text-slate-600" />
            <span>Kịch Bản Điểm Thi Cuối Kỳ Tối Thiểu Cần Đạt</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">Trọng số: Giữa kỳ 40% + Cuối kỳ 60%</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {coursesGpa.map((c) => (
            <div key={c.code} className="bg-slate-50/50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{c.code}</span>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                  {c.credits} TC
                </span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-1">{c.name}</p>

              <div className="pt-2 border-t border-slate-200/70 space-y-1 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Điểm GK đã có:</span>
                  <span className="font-semibold text-slate-800">{c.midTerm}</span>
                </div>
                <div className="flex justify-between text-emerald-800 font-bold bg-emerald-50/80 px-2 py-1 rounded">
                  <span>Cần thi CK:</span>
                  <span>≥ {c.finalNeeded}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scholarships Matched */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-slate-600" />
            <span>Danh Sách Học Bổng Đang Mở Đơn & Độ Tương Thích</span>
          </h3>
        </div>

        <div className="space-y-3">
          {scholarships.map((s, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900">{s.name}</h4>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span>Yêu cầu: GPA {s.gpaReq}</span>
                  <span>•</span>
                  <span>ĐRL {s.drlReq}</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-semibold">{s.reward}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1.5">{s.status}</p>
              </div>

              <button 
                onClick={() => alert(`Đã lưu học bổng "${s.name}" vào danh sách theo dõi!`)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-all shadow-2xs whitespace-nowrap cursor-pointer"
              >
                Nộp Hồ Sơ
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
