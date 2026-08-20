import React, { useState } from "react";
import { 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Send, 
  Loader2, 
  ArrowRight, 
  BookOpen, 
  Calendar,
  Layers,
  Zap,
  RotateCcw
} from "lucide-react";
import { Course, SchedulePlan } from "../types";

interface ScheduleOptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPlan: (plan: SchedulePlan) => void;
  currentCourses: Course[];
}

export const ScheduleOptimizerModal: React.FC<ScheduleOptimizerModalProps> = ({
  isOpen,
  onClose,
  onApplyPlan,
  currentCourses,
}) => {
  const [prompt, setPrompt] = useState<string>(
    "Tôi muốn đăng ký thêm môn Mạng máy tính (IT005) Thứ 4 tiết 6-8 hoặc Chiều Thứ 5, và môn Trí tuệ nhân tạo (IT008) sáng Thứ 2 tiết 1-3. Hãy kiểm tra xem có bị trùng lịch với Cấu trúc Dữ liệu hoặc Triết học không và gợi ý lịch tối ưu nhất nhé!"
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<{
    analysis: string;
    conflicts: Array<{
      courseA: string;
      courseB: string;
      description: string;
      severity: "high" | "medium";
    }>;
    suggestedPlans: SchedulePlan[];
  } | null>(null);

  if (!isOpen) return null;

  const handleRunOptimizer = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const response = await fetch("/api/gemini/optimize-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, currentCourses }),
      });
      const data = await response.json();
      if (data.success) {
        setResult({
          analysis: data.analysis || "Đã phân tích yêu cầu thành công.",
          conflicts: data.conflicts || [],
          suggestedPlans: data.suggestedPlans || [],
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    "Đăng ký môn Mạng máy tính thứ 4 tiết 6-8 & Trí tuệ nhân tạo sáng thứ 2",
    "Tối ưu lịch dồn vào 3 ngày trong tuần (T2, T3, T6) để đi thực tập",
    "Tránh kẹp ca trưa 11h25 - 13h00 và xếp các môn cùng cơ sở Q.10",
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-300/40 text-amber-300 flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold">
                  Gemini AI Trợ Lý Xếp Lịch & Đăng Ký Môn
                </h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full border border-emerald-400/30 font-semibold">
                  Gemini 3.7 Flash
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Nhập văn bản thô hoặc yêu cầu bằng ngôn ngữ tự nhiên để kiểm tra xung đột & tạo phương án
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-slate-800">
          {/* Input Box */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>Yêu cầu đăng ký môn & nguyện vọng lịch học</span>
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ví dụ: Đăng ký môn Mạng máy tính thứ 4 tiết 6-8..."
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-3.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
            />

            {/* Quick chips */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
              <span className="text-[11px] text-slate-400 font-semibold shrink-0">Gợi ý:</span>
              {samplePrompts.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(s)}
                  className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-full shrink-0 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Action Trigger Button */}
          <button
            id="btn-trigger-gemini-optimizer"
            onClick={handleRunOptimizer}
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Gemini đang phân tích cú pháp & kiểm tra trùng lịch...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Phân tích xung đột & Tạo phương án tối ưu</span>
              </>
            )}
          </button>

          {/* Results Display */}
          {result && (
            <div className="space-y-4 pt-3 border-t border-slate-200 animate-in fade-in duration-200">
              {/* Conflict Warnings */}
              {result.conflicts && result.conflicts.length > 0 ? (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>PHÁT HIỆN XUNG ĐỘT TRÙNG LỊCH ({result.conflicts.length} trường hợp)</span>
                  </div>
                  {result.conflicts.map((c, i) => (
                    <div key={i} className="text-xs bg-white/80 p-2.5 rounded-xl border border-rose-200 text-slate-800">
                      <div className="font-semibold text-rose-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        <span>{c.courseA} ⚡ {c.courseB}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-0.5">{c.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center gap-2 text-emerald-800 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Không phát hiện xung đột lịch trình nào! Tất cả các ca học đều hợp lệ.</span>
                </div>
              )}

              {/* AI Suggested Optimal Plans */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>Các phương án sắp xếp được đề xuất bởi AI:</span>
                </h4>

                <div className="space-y-3">
                  {result.suggestedPlans.map((plan, idx) => (
                    <div
                      key={plan.id || idx}
                      className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl p-4 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                              Phương án {idx + 1}
                            </span>
                            <h5 className="text-sm font-bold text-slate-900">{plan.name}</h5>
                          </div>
                          <p className="text-xs text-slate-600 mt-1">{plan.description}</p>
                        </div>

                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 border border-emerald-200 px-2 py-1 rounded-lg shrink-0">
                          {plan.gpaImpact}
                        </span>
                      </div>

                      {/* Course preview chips */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {plan.courses.map((c, ci) => (
                          <span
                            key={ci}
                            className="bg-white border border-slate-200 text-slate-700 text-[10px] font-medium px-2 py-1 rounded-md flex items-center gap-1"
                          >
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{c.name} (T{c.day}: {c.startPeriod}-{c.endPeriod})</span>
                          </span>
                        ))}
                      </div>

                      {/* Apply button */}
                      <button
                        onClick={() => {
                          onApplyPlan(plan);
                          onClose();
                        }}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>Áp dụng phương án này vào Thời Khóa Biểu</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Tự động đồng bộ hóa lịch sau khi áp dụng
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-100 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
