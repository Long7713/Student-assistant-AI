import React, { useState } from 'react';
import { Course, Task, StudySession, ClassSchedule, DayOfWeek } from '../types';
import { 
  getTodayString, 
  getRelativeDateString, 
  formatTime12h, 
  formatFriendlyDate, 
  formatMinutesToDuration 
} from '../utils/dateUtils';
import { getCourseColor } from '../utils/courseColors';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Lock, 
  CheckCircle2, 
  XCircle, 
  Play, 
  RefreshCw, 
  Flame,
  ChevronRight,
  Filter,
  Plus
} from 'lucide-react';

interface CalendarScreenProps {
  courses: Course[];
  tasks: Task[];
  sessions: StudySession[];
  classSchedule: ClassSchedule[];
  onOpenFocusTimer: (session: StudySession) => void;
  onTriggerReplanForSession: (session: StudySession, reason?: string) => void;
  onCompleteSession: (sessionId: string) => void;
  onOpenAddTask: () => void;
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({
  courses,
  tasks,
  sessions,
  classSchedule,
  onOpenFocusTimer,
  onTriggerReplanForSession,
  onCompleteSession,
  onOpenAddTask,
}) => {
  const today = getTodayString();
  const tomorrow = getRelativeDateString(1);
  const in2Days = getRelativeDateString(2);
  const in3Days = getRelativeDateString(3);

  const dateOptions = [
    { label: 'Hôm nay', value: today },
    { label: 'Ngày mai', value: tomorrow },
    { label: '2 ngày nữa', value: in2Days },
    { label: '3 ngày nữa', value: in3Days },
  ];

  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [filterType, setFilterType] = useState<'all' | 'sessions' | 'classes'>('all');

  // Filter study sessions for selected date
  const selectedSessions = sessions.filter((s) => s.date === selectedDate);

  // Determine day of week for selected date
  const [y, m, d] = selectedDate.split('-').map(Number);
  const selectedDayOfWeek = new Date(y, m - 1, d).getDay() as DayOfWeek;

  // Filter class schedule for selected day of week
  const selectedClasses = classSchedule.filter((cs) => cs.dayOfWeek === selectedDayOfWeek);

  // Deadlines on this date
  const deadlinesOnDate = tasks.filter((t) => t.deadline.startsWith(selectedDate));

  // Compute total planned study minutes on selected date
  const totalStudyMinutes = selectedSessions
    .filter((s) => s.status !== 'missed')
    .reduce((acc, s) => acc + s.durationMinutes, 0);

  return (
    <div className="max-w-md sm:max-w-lg mx-auto px-4 py-5 space-y-5 pb-24">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5 text-indigo-600" />
            <span>Lịch học & Timeline</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">Tiết học cố định & phiên học AI tự động</p>
        </div>

        <button
          onClick={onOpenAddTask}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-xs hover:bg-indigo-700 active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm</span>
        </button>
      </div>

      {/* Date Carousel Selector */}
      <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {dateOptions.map((opt) => {
          const isSelected = selectedDate === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setSelectedDate(opt.value)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm scale-[1.02]'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Day Overview Summary */}
      <div className="bg-white rounded-2xl border border-slate-100 p-3.5 shadow-xs flex items-center justify-between text-xs">
        <div>
          <span className="text-[11px] text-slate-400 font-medium">Tổng giờ học AI lên lịch:</span>
          <div className="font-bold text-indigo-600 text-sm">
            {formatMinutesToDuration(totalStudyMinutes)} ({selectedSessions.length} phiên học)
          </div>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-slate-400 font-medium">Tiết học trên trường:</span>
          <div className="font-bold text-slate-800 text-sm">
            {selectedClasses.length} tiết cố định
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center space-x-1.5 text-xs">
        <span className="text-slate-400 text-[11px] font-medium mr-1">Lọc:</span>
        <button
          onClick={() => setFilterType('all')}
          className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-colors ${
            filterType === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 border border-slate-100'
          }`}
        >
          Tất cả
        </button>
        <button
          onClick={() => setFilterType('sessions')}
          className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-colors ${
            filterType === 'sessions'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-slate-600 border border-slate-100'
          }`}
        >
          Phiên học AI ({selectedSessions.length})
        </button>
        <button
          onClick={() => setFilterType('classes')}
          className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-colors ${
            filterType === 'classes'
              ? 'bg-slate-700 text-white'
              : 'bg-white text-slate-600 border border-slate-100'
          }`}
        >
          Tiết học ({selectedClasses.length})
        </button>
      </div>

      {/* Timeline Items List */}
      <div className="space-y-3">
        
        {/* Deadlines Warning Banner on this day */}
        {deadlinesOnDate.length > 0 && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200/80 text-xs text-rose-900 flex items-center space-x-2">
            <Flame className="w-4 h-4 text-rose-600 shrink-0" />
            <div>
              <span className="font-bold block">Hạn nộp bài hôm nay!</span>
              <span>{deadlinesOnDate.map((t) => t.title).join(', ')}</span>
            </div>
          </div>
        )}

        {/* 1. Locked Classes on this day */}
        {(filterType === 'all' || filterType === 'classes') &&
          selectedClasses.map((c) => {
            const course = courses.find((co) => co.id === c.courseId);
            const colors = getCourseColor(course?.color);

            return (
              <div
                key={`class-${c.id}`}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${colors.badgeBg} ${colors.badgeText}`}>
                        {course?.code}
                      </span>
                      <span className="font-bold text-slate-800">
                        {course?.name} ({c.type === 'lecture' ? 'Lý thuyết' : c.type === 'lab' ? 'Thực hành' : 'Bài tập'})
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      {formatTime12h(c.startTime)} - {formatTime12h(c.endTime)} {c.location ? `• ${c.location}` : ''}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-semibold text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-200 shrink-0">
                  Cố định
                </span>
              </div>
            );
          })}

        {/* 2. AI Study Sessions on this day */}
        {(filterType === 'all' || filterType === 'sessions') &&
          selectedSessions.map((session) => {
            const task = tasks.find((t) => t.id === session.taskId);
            const course = courses.find((c) => c.id === task?.courseId);
            const colors = getCourseColor(course?.color);

            return (
              <div
                key={session.id}
                className={`p-4 rounded-2xl border transition-all ${
                  session.status === 'completed'
                    ? 'border-emerald-200 bg-emerald-50/40 opacity-85'
                    : session.status === 'missed'
                    ? 'border-red-200 bg-red-50/40 line-through opacity-75'
                    : `bg-white border-slate-100 shadow-xs hover:border-indigo-100`
                }`}
              >
                <div className="flex flex-col space-y-2.5">
                  
                  {/* Top Bar: Course, Title, Tags */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${colors.badgeBg} ${colors.badgeText}`}>
                          {course?.code}
                        </span>

                        {session.replanTag && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                            {session.replanTag}
                          </span>
                        )}

                        {session.status === 'completed' && (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Đã xong</span>
                          </span>
                        )}

                        {session.status === 'missed' && (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">
                            <XCircle className="w-3 h-3" />
                            <span>Đã bỏ lỡ</span>
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm leading-snug">
                        {task?.title}
                      </h3>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-bold text-indigo-600 text-xs">
                        {formatTime12h(session.startTime)} - {formatTime12h(session.endTime)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {formatMinutesToDuration(session.durationMinutes)}
                      </div>
                    </div>
                  </div>

                  {/* Session Goal */}
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="font-semibold text-slate-700">Mục tiêu: </span>
                    <span>{session.goal}</span>
                  </p>

                  {/* Actions for Scheduled Sessions */}
                  {session.status === 'scheduled' && (
                    <div className="flex items-center justify-end space-x-2 pt-1">
                      <button
                        onClick={() =>
                          onTriggerReplanForSession(
                            session,
                            `Sinh viên bỏ lỡ phiên học ${course?.code || ''} lúc ${formatTime12h(session.startTime)}`
                          )
                        }
                        id={`calendar-miss-${session.id}`}
                        className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-semibold transition-colors"
                      >
                        Bỏ lỡ
                      </button>

                      <button
                        onClick={() => onCompleteSession(session.id)}
                        id={`calendar-done-${session.id}`}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition-colors flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Đã xong</span>
                      </button>

                      <button
                        onClick={() => onOpenFocusTimer(session)}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center space-x-1.5 transition-all active:scale-95"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Học ngay</span>
                      </button>
                    </div>
                  )}

                </div>
              </div>
            );
          })}

        {selectedSessions.length === 0 && selectedClasses.length === 0 && (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-100 text-slate-400 text-xs space-y-2">
            <CalendarIcon className="w-8 h-8 mx-auto text-slate-300" />
            <p>Không có phiên học hoặc tiết học nào vào ngày này.</p>
          </div>
        )}

      </div>

    </div>
  );
};
