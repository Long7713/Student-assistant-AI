import { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Send, 
  Loader2, 
  ArrowRight, 
  Calendar,
  Layers,
  RotateCcw
} from "lucide-react";
import { Course, SchedulePlan } from "../types";
import { scheduleService } from "../services/scheduleService";
import { useApp } from "../context/AppContext";

interface ScheduleOptimizerModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onApplyPlan?: (plan: SchedulePlan) => void;
  currentCourses?: Course[];
}

export const ScheduleOptimizerModal = (props: ScheduleOptimizerModalProps) => {
  const app = useApp();

  const isOpen = props.isOpen ?? app.aiOptimizerOpen;
  const onClose = props.onClose ?? (() => app.setAiOptimizerOpen(false));
  const onApplyPlan = props.onApplyPlan ?? app.applyAiPlan;
  const currentCourses = props.currentCourses ?? app.courses;

  const [prompt, setPrompt] = useState<string>(
    "Tôi muốn đăng ký thêm môn Mạng máy tính (IT005) Thứ 4 tiết 6-8 hoặc Chiều Thứ 5, và môn Trí tuệ nhân tạo (IT008) sáng Thứ 2 tiết 1-3. Hãy kiểm tra xem có bị trùng lịch với Cấu trúc Dữ liệu hoặc Triết học không và gợi ý lịch tối ưu nhất nhé!"
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  if (!isOpen) return null;

  const handleRunOptimizer = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setErrorMessage(null);
    setResult(null);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const data = await scheduleService.optimizeSchedule(
        prompt,
        currentCourses,
        abortControllerRef.current.signal
      );
      if (data.success) {
        setResult({
          analysis: data.analysis,
          conflicts: data.conflicts || [],
          suggestedPlans: data.suggestedPlans || [],
        });
      } else {
        setErrorMessage("Không thể xử lý yêu cầu tối ưu lịch trình vào lúc này.");
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setErrorMessage("Lỗi kết nối máy chủ Gemini AI.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-lg border border-slate-200 animate-in zoom-in-95 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-2xs">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Trợ Lý Tối Ưu Lịch Học (Gemini AI Engine)
              </h3>
              <p className="text-xs text-slate-500">
                Phân tích xung đột tiết học & Tự động tạo phương án xếp lịch tối ưu
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Current Enrolled Courses Chips */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Các môn học hiện có trong TKB ({currentCourses.length} môn):
            </label>
            <div className="flex flex-wrap gap-2">
              {currentCourses.map((c) => (
                <div
                  key={c.id}
                  className="bg-slate-50 border border-slate-200 text-slate-800 text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5 font-medium"
                >
                  <span className="w-2 h-2 rounded-full bg-slate-900"></span>
                  <span>
                    {c.code} (T{c.day}: {c.startPeriod}-{c.endPeriod})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* User Prompt Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Yêu cầu xếp lịch / Thêm môn học mới:
              </label>
              <button
                type="button"
                onClick={() =>
                  setPrompt(
                    "Tôi muốn đăng ký thêm môn Mạng máy tính (IT005) Thứ 4 tiết 6-8 hoặc Chiều Thứ 5, và môn Trí tuệ nhân tạo (IT008) sáng Thứ 2 tiết 1-3. Hãy kiểm tra xem có bị trùng lịch với Cấu trúc Dữ liệu hoặc Triết học không và gợi ý lịch tối ưu nhất nhé!"
                  )
                }
                className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Ví dụ mẫu</span>
              </button>
            </div>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Nhập mong muốn của bạn (VD: Muốn học dồn vào buổi sáng, tránh ca học chiều thứ 6, không trùng tiết 4-5...)"
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl p-3 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 leading-relaxed"
            />
          </div>

          {/* Action Trigger */}
          <button
            onClick={handleRunOptimizer}
            disabled={loading || !prompt.trim()}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-xs font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-300" />
                <span>Gemini đang tính toán tổ hợp ma trận lịch học...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Phân Tích & Đề Xuất Phương Án Tối Ưu</span>
              </>
            )}
          </button>

          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-xl">
              {errorMessage}
            </div>
          )}

          {/* Results Display */}
          {result && (
            <div className="space-y-4 pt-3 border-t border-slate-200 animate-in fade-in duration-200">
              {/* Conflict Warnings */}
              {result.conflicts && result.conflicts.length > 0 ? (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>PHÁT HIỆN XUNG ĐỘT TRÙNG LỊCH ({result.conflicts.length} trường hợp)</span>
                  </div>
                  {result.conflicts.map((c, i) => (
                    <div
                      key={i}
                      className="text-xs bg-white/80 p-2.5 rounded-lg border border-rose-200 text-slate-800"
                    >
                      <div className="font-semibold text-rose-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        <span>
                          {c.courseA} ⚡ {c.courseB}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-0.5">{c.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center gap-2 text-emerald-800 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Không phát hiện xung đột lịch trình nào! Tất cả các ca học đều hợp lệ.</span>
                </div>
              )}

              {/* AI Suggested Optimal Plans */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-slate-700" />
                  <span>Các phương án sắp xếp được đề xuất bởi AI:</span>
                </h4>

                <div className="space-y-3">
                  {result.suggestedPlans.map((plan, idx) => (
                    <div
                      key={plan.id || idx}
                      className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl p-4 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                              Phương án {idx + 1}
                            </span>
                            <h5 className="text-sm font-bold text-slate-900">{plan.name}</h5>
                          </div>
                          <p className="text-xs text-slate-600 mt-1">{plan.description}</p>
                        </div>

                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/80 border border-emerald-200 px-2 py-1 rounded-md shrink-0">
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
                            <span>
                              {c.name} (T{c.day}: {c.startPeriod}-{c.endPeriod})
                            </span>
                          </span>
                        ))}
                      </div>

                      {/* Apply button */}
                      <button
                        onClick={() => {
                          onApplyPlan(plan);
                          onClose();
                        }}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
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
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-semibold text-xs rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
