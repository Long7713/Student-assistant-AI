import React, { useState } from 'react';
import { ReplanDiff } from '../types';
import { getCourseColor } from '../utils/courseColors';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  Calendar, 
  X,
  RefreshCw,
  Zap,
  Check,
  ChevronDown
} from 'lucide-react';

interface ReplanBottomSheetProps {
  diff: ReplanDiff | null;
  isOpen: boolean;
  onClose: () => void;
  onApplyReplan: (diff: ReplanDiff) => void;
}

export const ReplanBottomSheet: React.FC<ReplanBottomSheetProps> = ({
  diff,
  isOpen,
  onClose,
  onApplyReplan,
}) => {
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  if (!isOpen || !diff) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      
      {/* Mobile Slide-up Bottom Sheet */}
      <div 
        id="replan-bottom-sheet"
        className="w-full max-w-md sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
      >
        
        {/* Drag Handle & Header */}
        <div className="p-4 pb-2 border-b border-slate-100 bg-white sticky top-0 z-10">
          <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-3" />

          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <RefreshCw className="w-5 h-5 animate-spin-slow" />
              </div>
              <div>
                <h2 className="font-extrabold text-slate-900 text-base">
                  AI Đã Điều Chỉnh Lại Kế Hoạch
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Tự động xếp bù thời gian • Không bị dồn bài
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 space-y-4 overflow-y-auto">
          
          {/* 1. Context Reassurance Notice */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-amber-950">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Bạn vừa bỏ lỡ một phiên học</span>
            </div>
            <p className="text-amber-800 leading-relaxed">
              Đừng lo lắng! AI đã tính toán lại để phiên học này không bị mất đi và bạn vẫn nộp bài đúng hạn.
            </p>
          </div>

          {/* 2. Student-Friendly Reassurance Badges */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-2xl flex items-center space-x-2 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold text-emerald-900">
                ✓ Không có bài nào bị trễ hạn
              </span>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 p-2.5 rounded-2xl flex items-center space-x-2 text-xs">
              <Zap className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="font-bold text-indigo-900">
                ✓ Tổng giờ học hôm nay: {diff.workloadSummary.todayHoursAfter}h
              </span>
            </div>
          </div>

          {/* 3. AI Pedagogical Rationale (Why it changed) */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 space-y-1.5 text-xs text-slate-700">
            <div className="flex items-center space-x-1.5 text-indigo-900 font-bold text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Lý do AI sắp xếp:</span>
            </div>
            <p className="leading-relaxed text-slate-600">
              {diff.aiRationale}
            </p>
          </div>

          {/* 4. Concrete What Changed List */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Các điều chỉnh cụ thể ({diff.changes.length} thay đổi)
            </h3>

            <div className="space-y-2">
              {diff.changes.map((change) => {
                const colors = getCourseColor(change.courseColor);

                return (
                  <div
                    key={change.id}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${colors.badgeBg} ${colors.badgeText}`}>
                          {change.courseCode}
                        </span>
                        <span className="font-bold text-slate-800 truncate max-w-[170px]">
                          {change.taskTitle}
                        </span>
                      </div>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                        {change.type === 'moved'
                          ? 'Chuyển giờ tối nay'
                          : change.type === 'rescheduled_tomorrow'
                          ? 'Dời sang chiều mai'
                          : 'Điều chỉnh'}
                      </span>
                    </div>

                    {/* Before & After Timeline */}
                    <div className="flex items-center space-x-2 text-[11px] bg-slate-50 p-2 rounded-xl">
                      <span className="text-slate-400 line-through">
                        {change.previousSession?.startTime} - {change.previousSession?.endTime}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span className="font-bold text-indigo-600">
                        {change.newSession?.date !== change.previousSession?.date ? 'Chiều mai ' : 'Tối nay '}
                        {change.newSession?.startTime} - {change.newSession?.endTime}
                      </span>
                    </div>

                    <p className="text-slate-500 text-[11px] leading-relaxed">
                      💡 {change.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Sticky Bottom Actions */}
        <div className="p-4 bg-white border-t border-slate-100 space-y-2">
          <button
            onClick={() => onApplyReplan(diff)}
            id="replan-apply-btn"
            className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-extrabold text-sm shadow-md flex items-center justify-center space-x-2 transition-all active:scale-[0.98]"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Áp dụng kế hoạch mới</span>
          </button>

          <button
            onClick={onClose}
            id="replan-cancel-btn"
            className="w-full py-2.5 px-4 rounded-2xl text-slate-500 hover:bg-slate-50 font-semibold text-xs transition-colors text-center"
          >
            Giữ nguyên lịch cũ
          </button>
        </div>

      </div>

    </div>
  );
};
