import React from 'react';
import { Course, Task, StudySession, StudentPreferences } from '../types';
import { 
  getTodayString, 
  formatTime12h, 
  formatMinutesToDuration 
} from '../utils/dateUtils';
import { getCourseColor } from '../utils/courseColors';
import { 
  BrainCircuit, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Play, 
  RefreshCw, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  Flame,
  Info
} from 'lucide-react';

interface AIPlanScreenProps {
  courses: Course[];
  tasks: Task[];
  sessions: StudySession[];
  preferences: StudentPreferences;
  onOpenFocusTimer: (session: StudySession) => void;
  onTriggerReplanForSession: (session: StudySession, reason?: string) => void;
  onCompleteSession: (sessionId: string) => void;
  onSimulateDemoMissed: () => void;
}

export const AIPlanScreen: React.FC<AIPlanScreenProps> = ({
  courses,
  tasks,
  sessions,
  preferences,
  onOpenFocusTimer,
  onTriggerReplanForSession,
  onCompleteSession,
  onSimulateDemoMissed,
}) => {
  const today = getTodayString();
  const todaySessions = sessions.filter((s) => s.date === today);

  const totalMinutes = todaySessions
    .filter((s) => s.status !== 'missed')
    .reduce((acc, s) => acc + s.durationMinutes, 0);

  return (
    <div className="max-w-md sm:max-w-lg mx-auto px-4 py-5 space-y-5 pb-24">
      
      {/* 1. Header with Conversational Summary */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider">
              Trợ lý Lập Kế Hoạch AI
            </span>
          </div>

          <h1 className="text-xl font-extrabold text-white tracking-tight">
            🤖 Kế hoạch hôm nay
          </h1>

          <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
            Bạn có <span className="font-extrabold text-amber-300">{formatMinutesToDuration(totalMinutes)}</span> học tập hiệu quả sau khi đã trừ các tiết học cố định.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-indigo-800/80 text-[11px] text-indigo-200">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Bảo vệ 100% deadline</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Không học dồn ban đêm</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Conversational AI Strategy Explanation */}
      <div className="bg-white rounded-3xl border border-indigo-100 shadow-sm p-4 space-y-2.5">
        <div className="flex items-center space-x-2 text-indigo-900 font-bold text-xs">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Tại sao AI sắp xếp lịch như vậy?</span>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          "Tôi ưu tiên xếp môn <strong className="text-indigo-950">Học máy (CS 189)</strong> vào khung giờ vàng buổi chiều vì kỳ thi giữa kỳ chỉ còn 2 ngày nữa. Phiên học tối dành cho bài tập Xác suất, và bài đọc ít gấp hơn đã được dời sang chiều mai để bạn không bị mệt mỏi."
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="bg-indigo-50/70 p-2 rounded-xl text-[11px] text-indigo-900 font-medium flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>Ưu tiên thi cử cấp bách</span>
          </div>
          <div className="bg-emerald-50/70 p-2 rounded-xl text-[11px] text-emerald-900 font-medium flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Phân bổ nghỉ ngơi hợp lý</span>
          </div>
        </div>
      </div>

      {/* 3. Structured Step-by-Step AI Recommendation List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>Lộ trình AI đề xuất cho bạn ({todaySessions.length} phiên)</span>
          </h2>
          <span className="text-[11px] text-slate-400 font-medium">Hôm nay</span>
        </div>

        <div className="space-y-3">
          {todaySessions.map((session, index) => {
            const task = tasks.find((t) => t.id === session.taskId);
            const course = courses.find((c) => c.id === task?.courseId);
            const colors = getCourseColor(course?.color);

            return (
              <div
                key={session.id}
                className={`p-4 rounded-2xl bg-white border transition-all ${
                  session.status === 'completed'
                    ? 'border-emerald-200 bg-emerald-50/30'
                    : session.status === 'missed'
                    ? 'border-red-200 bg-red-50/30 line-through'
                    : 'border-slate-100 shadow-xs hover:border-indigo-100'
                }`}
              >
                <div className="space-y-2.5">
                  
                  {/* Step Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {index + 1}
                      </div>
                      <div className="font-bold text-slate-900 text-xs">
                        {formatTime12h(session.startTime)} - {formatTime12h(session.endTime)}
                        <span className="text-slate-400 font-normal ml-1">
                          ({session.durationMinutes} phút)
                        </span>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${colors.badgeBg} ${colors.badgeText}`}>
                      {course?.code}
                    </span>
                  </div>

                  {/* Task Name & Goal */}
                  <div className="pl-8 space-y-1">
                    <h3 className="font-extrabold text-slate-900 text-sm">
                      {task?.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      🎯 <span className="font-medium">Mục tiêu:</span> {session.goal}
                    </p>

                    {session.replanTag && (
                      <div className="pt-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {session.replanTag}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions for Scheduled Blocks */}
                  {session.status === 'scheduled' && (
                    <div className="pl-8 pt-1 flex items-center justify-end space-x-2">
                      <button
                        onClick={() =>
                          onTriggerReplanForSession(
                            session,
                            `Sinh viên bận đột xuất và bỏ lỡ phiên học lúc ${formatTime12h(session.startTime)}`
                          )
                        }
                        id={`ai-plan-miss-${session.id}`}
                        className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-semibold transition-colors"
                      >
                        Bỏ lỡ
                      </button>

                      <button
                        onClick={() => onCompleteSession(session.id)}
                        id={`ai-plan-done-${session.id}`}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition-colors flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Xong</span>
                      </button>

                      <button
                        onClick={() => onOpenFocusTimer(session)}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center space-x-1.5 transition-all active:scale-95"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Bắt đầu</span>
                      </button>
                    </div>
                  )}

                  {session.status === 'completed' && (
                    <div className="pl-8 pt-1 text-xs font-bold text-emerald-600 flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Đã hoàn thành xuất sắc!</span>
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Adaptive Re-plan Demo Action Box */}
      <div className="p-4 rounded-3xl bg-amber-50/90 border border-amber-200 shadow-xs space-y-2.5">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-4 h-4 text-amber-600 animate-spin-slow" />
          <h3 className="font-bold text-amber-900 text-xs uppercase tracking-wider">
            Thử nghiệm khả năng tự thích ứng của AI
          </h3>
        </div>

        <p className="text-xs text-amber-800 leading-relaxed">
          Nếu bạn bận đột xuất và bỏ lỡ phiên học chiều, AI sẽ tự động phân tích lại các môn học và sắp xếp lại kế hoạch buổi tối & ngày mai mà không làm bạn bị trễ hạn nộp bài.
        </p>

        <button
          onClick={onSimulateDemoMissed}
          id="ai-plan-demo-missed-btn"
          className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs transition-all flex items-center justify-center space-x-1.5 active:scale-98"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Giả lập bỏ lỡ phiên học 14:30 (Xem AI Re-plan)</span>
        </button>
      </div>

    </div>
  );
};
