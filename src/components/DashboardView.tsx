import React, { useState } from 'react';
import { 
  Course, 
  ClassSchedule, 
  StudentPreferences, 
  Task, 
  StudySession, 
  DayOfWeek 
} from '../types';
import { 
  getTodayString, 
  getRelativeDateString, 
  formatTime12h, 
  formatFriendlyDate, 
  getDeadlineUrgency,
  formatMinutesToDuration 
} from '../utils/dateUtils';
import { getCourseColor } from '../utils/courseColors';
import { 
  Sparkles, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Play, 
  AlertTriangle, 
  ShieldCheck, 
  Lock, 
  Flame, 
  Layers, 
  ArrowRight, 
  RefreshCw, 
  PlusCircle, 
  GraduationCap,
  Sliders,
  ChevronRight,
  BookOpen,
  Info,
  Zap
} from 'lucide-react';

interface DashboardViewProps {
  courses: Course[];
  classSchedule: ClassSchedule[];
  preferences: StudentPreferences;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  sessions: StudySession[];
  setSessions: React.Dispatch<React.SetStateAction<StudySession[]>>;
  onOpenAddTask: () => void;
  onOpenSetup: () => void;
  onTriggerReplanForSession: (session: StudySession, reason?: string) => void;
  onOpenFocusTimer: (session: StudySession) => void;
  onSimulateDemoMissed: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  courses,
  classSchedule,
  preferences,
  tasks,
  setTasks,
  sessions,
  setSessions,
  onOpenAddTask,
  onOpenSetup,
  onTriggerReplanForSession,
  onOpenFocusTimer,
  onSimulateDemoMissed,
}) => {
  const today = getTodayString();
  const tomorrow = getRelativeDateString(1);
  const in2Days = getRelativeDateString(2);

  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [viewMode, setViewMode] = useState<'timeline' | 'three_day' | 'week'>('timeline');

  // Filter tasks & sessions
  const todaySessions = sessions.filter((s) => s.date === today);
  const activeSelectedSessions = sessions.filter((s) => s.date === selectedDate);
  
  // Calculate day metrics
  const totalPlannedTodayMinutes = todaySessions
    .filter((s) => s.status !== 'missed')
    .reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalPlannedTodayHours = (totalPlannedTodayMinutes / 60).toFixed(1);
  const maxStudyHours = preferences.maxDailyStudyHours || 5.5;
  const capacityPercent = Math.min(100, Math.round((Number(totalPlannedTodayHours) / maxStudyHours) * 100));

  // Determine current day of week (1=Mon)
  const currentDayOfWeek = new Date().getDay() as DayOfWeek;
  const todayClasses = classSchedule.filter((cs) => cs.dayOfWeek === currentDayOfWeek);

  // Focus queue: high priority upcoming session today
  const primaryFocusSession = todaySessions.find(
    (s) => s.status === 'scheduled' || s.status === 'in_progress'
  ) || todaySessions[0];
  const primaryFocusTask = tasks.find((t) => t.id === primaryFocusSession?.taskId);
  const primaryFocusCourse = courses.find((c) => c.id === primaryFocusTask?.courseId);

  // Complete session action
  const handleMarkCompleted = (sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          return { ...s, status: 'completed' as const };
        }
        return s;
      })
    );

    // Also update task completed minutes
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      setTasks((prevTasks) =>
        prevTasks.map((t) => {
          if (t.id === session.taskId) {
            const newCompleted = t.completedMinutes + session.durationMinutes;
            return {
              ...t,
              completedMinutes: newCompleted,
              status: newCompleted >= t.estimatedMinutes ? 'completed' : 'in_progress',
            };
          }
          return t;
        })
      );
    }
  };

  // Toggle subtask completion
  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId && t.subtasks) {
          return {
            ...t,
            subtasks: t.subtasks.map((st) =>
              st.id === subtaskId ? { ...st, completed: !st.completed } : st
            ),
          };
        }
        return t;
      })
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* 1. Core Value Proposition & Demo Interactive Bar */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-indigo-800/60 rounded-2xl p-4 sm:p-6 text-white shadow-lg relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Sparkles className="w-3 h-3 mr-1" /> Core Principle
              </span>
              <span className="text-xs text-indigo-200/75">Interactive Academic Workflow</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              "AI doesn't do your homework. It helps you know what to do today — and adapts when your plan changes."
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Classes are locked. Deadlines are fixed. When life happens and a study block is missed, the AI rebalances your schedule without cramming.
            </p>
          </div>

          {/* Demo Journey Steps & Quick Trigger */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white/5 border border-white/10 p-3.5 rounded-xl backdrop-blur-xs">
            <div className="hidden xl:flex items-center space-x-2 text-[11px] text-slate-300 font-medium">
              <span className="px-1.5 py-0.5 bg-white/10 rounded">1. Setup</span>
              <ArrowRight className="w-3 h-3 text-slate-500" />
              <span className="px-1.5 py-0.5 bg-white/10 rounded">2. Add Task</span>
              <ArrowRight className="w-3 h-3 text-slate-500" />
              <span className="px-1.5 py-0.5 bg-indigo-500/40 text-indigo-200 font-bold rounded">3. AI Plan</span>
              <ArrowRight className="w-3 h-3 text-slate-500" />
              <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-300 font-bold rounded">4. Miss Session</span>
              <ArrowRight className="w-3 h-3 text-slate-500" />
              <span className="px-1.5 py-0.5 bg-indigo-500/40 text-indigo-200 font-bold rounded">5. AI Re-Plan</span>
            </div>

            <button
              type="button"
              onClick={onSimulateDemoMissed}
              id="dashboard-simulate-missed-btn"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Simulate Missed Session (Demo)</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. Top Metric Bar & Daily Cognitive Load */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Today's Study Load */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Today's Planned Study
            </span>
            <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              {totalPlannedTodayHours}h
            </span>
            <span className="text-xs text-slate-500">
              / {maxStudyHours}h Daily Limit
            </span>
          </div>
          <div className="mt-3 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                capacityPercent > 90 ? 'bg-amber-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${capacityPercent}%` }}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-[10px] text-slate-400">
            <span>{capacityPercent}% Capacity</span>
            <span>{todaySessions.filter((s) => s.status === 'completed').length} / {todaySessions.length} Blocks Done</span>
          </div>
        </div>

        {/* Metric 2: Fixed Classes */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Fixed Class Commitments
            </span>
            <Lock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              {todayClasses.length}
            </span>
            <span className="text-xs text-slate-500">
              Classes Today (Locked)
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-600 dark:text-slate-400 flex items-center space-x-1 truncate">
            {todayClasses.length > 0 ? (
              todayClasses.map((c, i) => {
                const crs = courses.find((co) => co.id === c.courseId);
                return (
                  <span key={c.id} className="font-semibold text-slate-700 dark:text-slate-300">
                    {crs?.code}{i < todayClasses.length - 1 ? ', ' : ''}
                  </span>
                );
              })
            ) : (
              <span className="text-slate-400">No classes today</span>
            )}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Study sessions wrap around these</p>
        </div>

        {/* Metric 3: Upcoming Deadlines */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Active Deadlines
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              {tasks.filter((t) => t.status !== 'completed').length}
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              100% On Schedule
            </span>
          </div>
          <div className="mt-2 flex items-center space-x-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium truncate">
            <Zap className="w-3.5 h-3.5" />
            <span>Next: CS 189 Midterm (in 2 days)</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">All study hours pre-allocated</p>
        </div>

        {/* Metric 4: Academic Workload Pace */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Schedule Health
            </span>
            <Sparkles className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
              Optimal
            </span>
            <span className="text-xs text-slate-500">
              Zero Cramming
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">
            Peak focus: <span className="font-semibold capitalize">{preferences.peakFocusTime}</span>
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Evening buffer open for recovery</p>
        </div>

      </div>

      {/* 3. Main Dashboard Layout (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Today's Focus & Interactive Timeline */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Today's High-Priority Focus Card */}
          {primaryFocusSession && primaryFocusTask && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-indigo-500/40 dark:border-indigo-500/30 p-5 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300">
                    {primaryFocusCourse?.code}
                  </span>
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center space-x-1">
                    <Flame className="w-3.5 h-3.5 text-rose-500" />
                    <span>Next High-Impact Focus Block</span>
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {formatTime12h(primaryFocusSession.startTime)} - {formatTime12h(primaryFocusSession.endTime)}
                  </span>
                  <span>({formatMinutesToDuration(primaryFocusSession.durationMinutes)})</span>
                </div>
              </div>

              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
                {primaryFocusTask.title}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 flex items-center space-x-1.5">
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">Session Goal:</span>
                <span>{primaryFocusSession.goal}</span>
              </p>

              {/* Subtasks checklist preview */}
              {primaryFocusTask.subtasks && primaryFocusTask.subtasks.length > 0 && (
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 mb-4 space-y-2">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Action Checklist
                  </span>
                  {primaryFocusTask.subtasks.map((st) => (
                    <label
                      key={st.id}
                      className="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer hover:text-slate-900"
                    >
                      <input
                        type="checkbox"
                        checked={st.completed}
                        onChange={() => handleToggleSubtask(primaryFocusTask.id, st.id)}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className={st.completed ? 'line-through text-slate-400' : ''}>
                        {st.title}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => onOpenFocusTimer(primaryFocusSession)}
                  id="primary-start-focus-btn"
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Focus Session ({primaryFocusSession.durationMinutes}m)</span>
                </button>

                <div className="flex items-center space-x-2">
                  {/* Mark Missed Action */}
                  <button
                    type="button"
                    onClick={() =>
                      onTriggerReplanForSession(
                        primaryFocusSession,
                        'Student marked session as Missed during afternoon schedule'
                      )
                    }
                    id="primary-mark-missed-btn"
                    className="px-3 py-2 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-semibold hover:bg-amber-100 transition-colors"
                  >
                    Mark Missed
                  </button>

                  {/* Mark Complete Action */}
                  <button
                    type="button"
                    onClick={() => handleMarkCompleted(primaryFocusSession.id)}
                    id="primary-mark-complete-btn"
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Complete</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* Interactive Calendar & Timeline Visualization */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            
            {/* Timeline Controls & Date Filter */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  Daily Timeline & Schedule
                </h3>
              </div>

              <div className="flex items-center space-x-2">
                {/* Date Quick Selector */}
                <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-50 dark:bg-slate-800">
                  <button
                    type="button"
                    onClick={() => setSelectedDate(today)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                      selectedDate === today
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDate(tomorrow)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                      selectedDate === tomorrow
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Tomorrow
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDate(in2Days)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                      selectedDate === in2Days
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    In 2 Days
                  </button>
                </div>
              </div>
            </div>

            {/* Schedule Items List for Selected Date */}
            <div className="space-y-3">
              
              {/* If viewing Today, include locked classes */}
              {selectedDate === today ? (
                todayClasses.map((c) => {
                  const course = courses.find((co) => co.id === c.courseId);
                  const colors = getCourseColor(course?.color);

                  return (
                    <div
                      key={`class-${c.id}`}
                      className="p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-800/80 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                          <Lock className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${colors.badgeBg} ${colors.badgeText}`}>
                              {course?.code}
                            </span>
                            <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                              {course?.name} ({c.type})
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                              Fixed Commitment
                            </span>
                          </div>
                          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                            {formatTime12h(c.startTime)} - {formatTime12h(c.endTime)} {c.location ? `• ${c.location}` : ''}
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400">Class Lecture</span>
                    </div>
                  );
                })
              ) : null}

              {/* Study Sessions */}
              {activeSelectedSessions.map((session) => {
                const task = tasks.find((t) => t.id === session.taskId);
                const course = courses.find((c) => c.id === task?.courseId);
                const colors = getCourseColor(course?.color);

                return (
                  <div
                    key={session.id}
                    className={`p-4 rounded-xl border transition-all ${
                      session.status === 'completed'
                        ? 'border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/50 dark:bg-emerald-950/20 opacity-80'
                        : session.status === 'missed'
                        ? 'border-red-200 bg-red-50/40 dark:border-red-900/50 dark:bg-red-950/20 line-through'
                        : `${colors.border} ${colors.bg}`
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      
                      {/* Left: Course + Task Title + Time */}
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${colors.badgeBg} ${colors.badgeText}`}>
                            {course?.code}
                          </span>
                          <span className={`font-bold text-sm ${session.status === 'missed' ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-slate-100'}`}>
                            {task?.title}
                          </span>

                          {/* Replan Tag Badge if present */}
                          {session.replanTag && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/80 dark:text-indigo-200 animate-pulse">
                              {session.replanTag}
                            </span>
                          )}

                          {/* Status Badge */}
                          {session.status === 'completed' && (
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Completed</span>
                            </span>
                          )}
                          {session.status === 'missed' && (
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                              <XCircle className="w-3 h-3" />
                              <span>Missed & Re-planned</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-3 text-xs text-slate-600 dark:text-slate-400 mt-1">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                              {formatTime12h(session.startTime)} - {formatTime12h(session.endTime)}
                            </span>
                          </span>
                          <span>({formatMinutesToDuration(session.durationMinutes)})</span>
                          <span className="text-slate-400">• Goal: {session.goal}</span>
                        </div>
                      </div>

                      {/* Right: Actions for scheduled sessions */}
                      {session.status === 'scheduled' && (
                        <div className="flex items-center space-x-2 pt-2 sm:pt-0">
                          <button
                            type="button"
                            onClick={() => onOpenFocusTimer(session)}
                            title="Start Timer"
                            className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              onTriggerReplanForSession(
                                session,
                                `Student missed ${course?.code || 'Course'} session at ${formatTime12h(session.startTime)}`
                              )
                            }
                            id={`session-mark-missed-${session.id}`}
                            className="px-2.5 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-semibold hover:bg-amber-100 transition-colors"
                          >
                            Missed
                          </button>

                          <button
                            type="button"
                            onClick={() => handleMarkCompleted(session.id)}
                            id={`session-mark-complete-${session.id}`}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center space-x-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Done</span>
                          </button>
                        </div>
                      )}

                    </div>
                  </div>
                );
              })}

              {activeSelectedSessions.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-xs italic">
                  No study sessions scheduled for this date.
                </div>
              )}

            </div>

          </div>

        </div>

        {/* Right Column: Upcoming Deadlines & Urgency Rail */}
        <div className="space-y-6">
          
          {/* Upcoming Deadlines with Urgency Indicators */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Flame className="w-4 h-4 text-rose-500" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  Upcoming Deadlines ({tasks.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={onOpenAddTask}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="space-y-3">
              {tasks.map((task) => {
                const course = courses.find((c) => c.id === task.courseId);
                const colors = getCourseColor(course?.color);
                const urgency = getDeadlineUrgency(task.deadline);
                const progress = Math.min(100, Math.round((task.completedMinutes / task.estimatedMinutes) * 100));

                return (
                  <div
                    key={task.id}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${colors.badgeBg} ${colors.badgeText}`}>
                          {course?.code}
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                          {task.title}
                        </span>
                      </div>

                      {/* Urgency Badge */}
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap ${urgency.badgeClass}`}>
                        {urgency.label}
                      </span>
                    </div>

                    {/* Progress Bar & Workload */}
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                        <span>Workload: {formatMinutesToDuration(task.estimatedMinutes)}</span>
                        <span>{progress}% Finished</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Enrolled Courses Quick Rail */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Semester Courses</span>
              </h3>
              <button
                type="button"
                onClick={onOpenSetup}
                className="text-xs text-indigo-600 hover:underline font-semibold"
              >
                Edit Setup
              </button>
            </div>

            <div className="space-y-2">
              {courses.map((c) => {
                const colors = getCourseColor(c.color);
                const classCount = classSchedule.filter((cs) => cs.courseId === c.id).length;
                const taskCount = tasks.filter((t) => t.courseId === c.id).length;

                return (
                  <div
                    key={c.id}
                    className={`p-2.5 rounded-xl border ${colors.border} ${colors.bg} flex items-center justify-between text-xs`}
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-1.5">
                        <span>{c.code}</span>
                        <span className="font-normal text-slate-500 truncate max-w-[140px]">
                          {c.name}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {c.credits} Credits • {classCount} fixed blocks
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
