import React from 'react';
import { Course, Task, StudySession, ClassSchedule, StudentPreferences } from '../types';
import { 
  getTodayString, 
  formatTime12h, 
  formatMinutesToDuration, 
  getVietnameseGreeting, 
  getDeadlineUrgency,
  formatFullVietnameseDate 
} from '../utils/dateUtils';
import { getCourseColor } from '../utils/courseColors';
import { 
  Sparkles, 
  Play, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Flame, 
  ChevronRight, 
  AlertCircle, 
  ShieldCheck, 
  Lock,
  ArrowRight,
  RefreshCw,
  BookOpen
} from 'lucide-react';

interface HomeScreenProps {
  courses: Course[];
  tasks: Task[];
  sessions: StudySession[];
  classSchedule: ClassSchedule[];
  preferences: StudentPreferences;
  onOpenFocusTimer: (session: StudySession) => void;
  onTriggerReplanForSession: (session: StudySession, reason?: string) => void;
  onCompleteSession: (sessionId: string) => void;
  onNavigateTab: (tab: any) => void;
  onOpenAddTask: () => void;
  onSimulateDemoMissed: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  courses,
  tasks,
  sessions,
  classSchedule,
  preferences,
  onOpenFocusTimer,
  onTriggerReplanForSession,
  onCompleteSession,
  onNavigateTab,
  onOpenAddTask,
  onSimulateDemoMissed,
}) => {
  const today = getTodayString();
  const { greeting } = getVietnameseGreeting();

  // Find today's sessions
  const todaySessions = sessions.filter((s) => s.date === today);
  const scheduledToday = todaySessions.filter((s) => s.status === 'scheduled');
  const completedToday = todaySessions.filter((s) => s.status === 'completed');

  // Next best action: Next scheduled study block
  const nextSession = scheduledToday[0] || todaySessions[0];
  const nextTask = tasks.find((t) => t.id === nextSession?.taskId);
  const nextCourse = courses.find((c) => c.id === nextTask?.courseId);
  const nextColors = getCourseColor(nextCourse?.color);

  // Subsequent tasks today (excluding the hero action)
  const subsequentSessions = scheduledToday.slice(1);

  // Workload calculations
  const totalMinutesPlanned = todaySessions
    .filter((s) => s.status !== 'missed')
    .reduce((acc, s) => acc + s.durationMinutes, 0);
  const completedMinutesPlanned = completedToday.reduce((acc, s) => acc + s.durationMinutes, 0);
  const maxStudyHours = preferences.maxDailyStudyHours || 5.5;
  const plannedHours = (totalMinutesPlanned / 60).toFixed(1);
  const progressPercent = totalMinutesPlanned > 0 ? Math.min(100, Math.round((completedMinutesPlanned / totalMinutesPlanned) * 100)) : 0;

  // Upcoming urgent deadlines (sorted by closest deadline)
  const urgentTasks = [...tasks]
    .filter((t) => t.status !== 'completed')
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 3);

  return (
    <div className="max-w-md sm:max-w-lg mx-auto px-4 py-5 space-y-6 pb-20">
      
      {/* 1. Top Greeting Header */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-1.5">
            <span>{greeting}</span>
            <span>👋</span>
          </h1>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
            {formatFullVietnameseDate()}
          </span>
        </div>
        <p className="text-xs text-slate-500 font-medium flex items-center space-x-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>AI đã lên kế hoạch tối ưu cho hôm nay</span>
        </p>
      </div>

      {/* 2. HERO: YOUR NEXT BEST ACTION */}
      {nextSession && nextTask ? (
        <div className="bg-gradient-to-br from-white to-indigo-50/40 rounded-3xl border-2 border-indigo-200/80 shadow-md p-5 relative overflow-hidden transition-all">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Tag & Urgency */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${nextColors.badgeBg} ${nextColors.badgeText}`}>
                {nextCourse?.code}
              </span>
              <span className="text-slate-500 text-xs font-medium truncate max-w-[140px]">
                {nextCourse?.name}
              </span>
            </div>

            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
              <Flame className="w-3 h-3 text-rose-500" />
              <span>Ưu tiên cao nhất</span>
            </span>
          </div>

          {/* Task Title */}
          <div className="mb-3">
            <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block mb-0.5">
              VIỆC QUAN TRỌNG NHẤT BÂY GIỜ
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
              {nextTask.title}
            </h2>
          </div>

          {/* Key Info Pills */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-white/90 p-2.5 rounded-xl border border-slate-100 flex items-center space-x-2 text-xs">
              <Clock className="w-4 h-4 text-indigo-500 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 font-medium">Thời gian đề xuất</div>
                <div className="font-bold text-slate-800">
                  {formatTime12h(nextSession.startTime)} - {formatTime12h(nextSession.endTime)}
                </div>
              </div>
            </div>

            <div className="bg-white/90 p-2.5 rounded-xl border border-slate-100 flex items-center space-x-2 text-xs">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 font-medium">Thời lượng phiên</div>
                <div className="font-bold text-slate-800">
                  {formatMinutesToDuration(nextSession.durationMinutes)}
                </div>
              </div>
            </div>
          </div>

          {/* AI Explanation Box */}
          <div className="bg-indigo-50/80 border border-indigo-100/90 rounded-2xl p-3.5 mb-4 text-xs text-slate-700 space-y-1">
            <div className="flex items-center space-x-1.5 text-indigo-900 font-bold text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Lời khuyên từ Trợ lý AI:</span>
            </div>
            <p className="leading-relaxed text-slate-600">
              "Bạn nên hoàn thành việc này trước vì hạn ôn thi chỉ còn 2 ngày nữa và đây là nhiệm vụ có mức ưu tiên cao nhất trong tuần."
            </p>
          </div>

          {/* Primary & Secondary Action Buttons */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => onOpenFocusTimer(nextSession)}
              id="home-start-focus-btn"
              className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm shadow-sm flex items-center justify-center space-x-2 transition-all active:scale-[0.98]"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Bắt đầu tập trung ({nextSession.durationMinutes} phút)</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onCompleteSession(nextSession.id)}
                id="home-complete-session-btn"
                className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Hoàn thành</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  onTriggerReplanForSession(
                    nextSession,
                    'Sinh viên bận việc đột xuất và bỏ lỡ phiên học chiều'
                  )
                }
                id="home-miss-session-btn"
                className="py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
                <span>Bỏ lỡ (Nhờ AI xếp lại)</span>
              </button>
            </div>
          </div>

        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">Tuyệt vời! Bạn đã hoàn thành các phiên học hôm nay</h3>
          <p className="text-xs text-slate-500">Hãy thư giãn hoặc xem trước kế hoạch ngày mai trong mục Kế hoạch AI.</p>
        </div>
      )}

      {/* 3. SECTION 1: VIỆC TIẾP THEO */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>1. Việc tiếp theo hôm nay</span>
          </h3>
          <button
            onClick={() => onNavigateTab('calendar')}
            className="text-xs font-semibold text-indigo-600 hover:underline flex items-center space-x-0.5"
          >
            <span>Xem lịch đầy đủ</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {subsequentSessions.length > 0 ? (
            subsequentSessions.map((session) => {
              const task = tasks.find((t) => t.id === session.taskId);
              const course = courses.find((c) => c.id === task?.courseId);
              const colors = getCourseColor(course?.color);

              return (
                <div
                  key={session.id}
                  className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-xs hover:border-slate-200 transition-all flex items-center justify-between text-xs"
                >
                  <div className="space-y-1 max-w-[70%]">
                    <div className="flex items-center space-x-1.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${colors.badgeBg} ${colors.badgeText}`}>
                        {course?.code}
                      </span>
                      <span className="font-bold text-slate-800 truncate">
                        {task?.title}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{formatTime12h(session.startTime)} - {formatTime12h(session.endTime)}</span>
                      <span>• {session.durationMinutes} phút</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenFocusTimer(session)}
                    className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors"
                  >
                    <Play className="w-4 h-4 fill-current" />
                  </button>
                </div>
              );
            })
          ) : (
            <div className="p-3 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400">
              Không còn phiên học nào khác cần làm hôm nay.
            </div>
          )}
        </div>
      </div>

      {/* 4. SECTION 2: TIẾN ĐỘ HÔM NAY */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
              2
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Tiến độ hôm nay</h3>
              <p className="text-[11px] text-slate-400">Khối lượng học tập cân bằng</p>
            </div>
          </div>
          <span className="text-xs font-bold text-indigo-600">
            {plannedHours} / {maxStudyHours} giờ mục tiêu
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
          <span className="flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Đã xong {completedToday.length}/{todaySessions.length} phiên</span>
          </span>
          <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
            ✓ Không bị quá tải
          </span>
        </div>
      </div>

      {/* 5. SECTION 3: HẠN SẮP TỚI */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span>3. Hạn nộp sắp tới</span>
          </h3>
          <button
            onClick={() => onNavigateTab('tasks')}
            className="text-xs font-semibold text-indigo-600 hover:underline flex items-center space-x-0.5"
          >
            <span>Tất cả ({tasks.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {urgentTasks.map((task) => {
            const course = courses.find((c) => c.id === task.courseId);
            const colors = getCourseColor(course?.color);
            const urgency = getDeadlineUrgency(task.deadline);

            return (
              <div
                key={task.id}
                className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-center justify-between text-xs"
              >
                <div className="space-y-1 max-w-[65%]">
                  <div className="flex items-center space-x-1.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${colors.badgeBg} ${colors.badgeText}`}>
                      {course?.code}
                    </span>
                    <span className="font-bold text-slate-800 truncate">
                      {task.title}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Khối lượng: {formatMinutesToDuration(task.estimatedMinutes)}
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${urgency.badgeClass}`}>
                  {urgency.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Demo Trigger Banner for Easy Testing */}
      <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2 text-xs text-amber-900">
          <RefreshCw className="w-4 h-4 text-amber-600 shrink-0" />
          <div>
            <span className="font-bold block text-[11px]">Trải nghiệm AI thích ứng</span>
            <span className="text-[11px] text-amber-800">Thử bấm bỏ lỡ phiên học để xem AI re-plan</span>
          </div>
        </div>
        <button
          onClick={onSimulateDemoMissed}
          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold text-xs transition-all shrink-0"
        >
          Thử ngay
        </button>
      </div>

    </div>
  );
};
