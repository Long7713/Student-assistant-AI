import React, { useState } from 'react';
import { 
  NavigationTab,
  Course, 
  ClassSchedule, 
  StudentPreferences, 
  Task, 
  StudySession, 
  ReplanDiff 
} from './types';
import { 
  initialCourses, 
  initialClassSchedule, 
  initialPreferences, 
  initialTasks, 
  initialSessions 
} from './data/initialData';
import { useLocalStorage } from './hooks/useLocalStorage';
import { STORAGE_KEYS, resetAllStorageToDefaults } from './utils/storage';
import { calculatePlannerRebalance } from './utils/plannerEngine';
import { getTodayString } from './utils/dateUtils';
import { MobileHeader } from './components/MobileHeader';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { CalendarScreen } from './components/CalendarScreen';
import { AIPlanScreen } from './components/AIPlanScreen';
import { TasksScreen } from './components/TasksScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { AddTaskModal } from './components/AddTaskModal';
import { ReplanBottomSheet } from './components/ReplanBottomSheet';
import { FocusTimerModal } from './components/FocusTimerModal';
import { Sparkles, X, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [courses, setCourses] = useLocalStorage<Course[]>(STORAGE_KEYS.COURSES, initialCourses);
  const [classSchedule, setClassSchedule] = useLocalStorage<ClassSchedule[]>(STORAGE_KEYS.CLASS_SCHEDULE, initialClassSchedule);
  const [preferences, setPreferences] = useLocalStorage<StudentPreferences>(STORAGE_KEYS.PREFERENCES, initialPreferences);
  const [tasks, setTasks] = useLocalStorage<Task[]>(STORAGE_KEYS.TASKS, initialTasks);
  const [sessions, setSessions] = useLocalStorage<StudySession[]>(STORAGE_KEYS.SESSIONS, initialSessions);

  // Modals state
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isReplanOpen, setIsReplanOpen] = useState(false);
  const [replanDiff, setReplanDiff] = useState<ReplanDiff | null>(null);

  const [isFocusTimerOpen, setIsFocusTimerOpen] = useState(false);
  const [activeFocusSession, setActiveFocusSession] = useState<StudySession | null>(null);

  // Toast notification state
  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);

  const showToast = (title: string, message: string) => {
    setToast({ title, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Add Task Handler
  const handleAddTask = (newTask: Task, autoSessions: StudySession[]) => {
    setTasks((prev) => [newTask, ...prev]);
    if (autoSessions.length > 0) {
      setSessions((prev) => [...prev, ...autoSessions]);
    }
    showToast(
      'Đã thêm nhiệm vụ & xếp lịch học',
      `AI đã lên lịch các phiên học cho "${newTask.title}" bao quanh các tiết học cố định.`
    );
  };

  // Edit Task Handler
  const handleEditTask = (updatedTask: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    // Synchronize linked study sessions
    setSessions((prev) =>
      prev.map((s) => {
        if (s.taskId === updatedTask.id) {
          return {
            ...s,
            courseId: updatedTask.courseId,
          };
        }
        return s;
      })
    );
    showToast(
      'Đã cập nhật bài tập',
      `Thông tin nhiệm vụ "${updatedTask.title}" đã được lưu thành công.`
    );
  };

  // Delete Task Handler (Cascading delete of linked study sessions)
  const handleDeleteTask = (taskId: string) => {
    const deletedTask = tasks.find((t) => t.id === taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    // Clean up associated study sessions from calendar
    setSessions((prev) => prev.filter((s) => s.taskId !== taskId));
    showToast(
      'Đã xoá nhiệm vụ',
      `Đã gỡ bỏ bài tập "${deletedTask?.title || 'nhiệm vụ'}" và các phiên học trên lịch.`
    );
  };

  // Core Demo Moment & Re-plan Trigger
  const handleTriggerReplan = async (
    targetSession: StudySession,
    reason: string = 'Bỏ lỡ khung giờ học đã lên lịch'
  ) => {
    // 1. Calculate deterministic baseline rebalance immediately
    const diff = calculatePlannerRebalance({
      missedSession: targetSession,
      reason,
      courses,
      tasks,
      preferences,
      sessions,
    });

    setReplanDiff(diff);
    setIsReplanOpen(true);

    // 2. Fetch intelligent AI academic explanation via backend
    try {
      const response = await fetch('/api/replan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missedSession: targetSession,
          reason,
          courses,
          tasks,
          preferences,
          sessions,
        }),
      });

      const data = await response.json();
      if (data?.aiRationale) {
        setReplanDiff((prev) => (prev ? { ...prev, aiRationale: data.aiRationale } : prev));
      }
      if (data?.keyTakeaways && Array.isArray(data.keyTakeaways)) {
        setReplanDiff((prev) => (prev ? { ...prev, keyAdjustments: data.keyTakeaways } : prev));
      }
    } catch (e) {
      console.log('Using local Vietnamese planner engine');
    }
  };

  // Trigger Demo Moment for the 14:30 CS 189 session
  const handleSimulateDemoMissed = () => {
    const todayStr = getTodayString();
    const demoSession =
      sessions.find((s) => s.date === todayStr && s.startTime === '14:30') ||
      sessions.find((s) => s.date === todayStr && s.status === 'scheduled') ||
      sessions[0];

    if (demoSession) {
      handleTriggerReplan(
        demoSession,
        'Sinh viên bận đột xuất và bỏ lỡ phiên học chiều môn Học máy (CS 189)'
      );
    }
  };

  // Apply Re-plan Action
  const handleApplyReplan = (diff: ReplanDiff) => {
    setSessions(diff.proposedSessions);
    setIsReplanOpen(false);
    showToast(
      '⚡ Đã cập nhật kế hoạch học mới',
      'Phiên ôn thi quan trọng đã được chuyển sang 19:30 tối nay. Các deadline được bảo vệ an toàn!'
    );
  };

  // Focus Timer actions
  const handleOpenFocusTimer = (session: StudySession) => {
    setActiveFocusSession(session);
    setIsFocusTimerOpen(true);
  };

  const handleCompleteSession = (sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, status: 'completed' as const } : s))
    );
    showToast('Hoàn thành xuất sắc! 🎉', 'Đã ghi nhận tiến độ và khối lượng học tập.');
  };

  const handleMissFromTimer = (sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      handleTriggerReplan(session, 'Sinh viên không thể hoàn thành phiên học');
    }
  };

  // Reset to sample student data
  const handleResetSampleData = () => {
    const defaults = resetAllStorageToDefaults();
    setCourses(defaults.courses);
    setClassSchedule(defaults.classSchedule);
    setPreferences(defaults.preferences);
    setTasks(defaults.tasks);
    setSessions(defaults.sessions);
    showToast('Đã đặt lại dữ liệu mẫu', 'Khôi phục lịch học và bài tập mẫu của sinh viên CNTT.');
  };

  // Active focus task and course for timer modal
  const activeFocusTask = tasks.find((t) => t.id === activeFocusSession?.taskId) || null;
  const activeFocusCourse = courses.find((c) => c.id === activeFocusTask?.courseId) || null;

  const pendingTasksCount = tasks.filter((t) => t.status !== 'completed').length;

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-16 left-4 right-4 sm:left-auto sm:right-4 z-50 max-w-sm mx-auto bg-slate-900 text-white rounded-2xl p-3.5 shadow-2xl border border-indigo-500/30 animate-in slide-in-from-top-4 duration-300 flex items-start space-x-3">
          <div className="w-7 h-7 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold text-white">
              {toast.title}
            </h4>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Mobile Top Header */}
      <MobileHeader
        studentName={preferences.name || 'Minh Khoa'}
        onOpenAddTask={() => setIsAddTaskOpen(true)}
        onSimulateMissedSession={handleSimulateDemoMissed}
      />

      {/* Main Screen Router */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomeScreen
            courses={courses}
            tasks={tasks}
            sessions={sessions}
            classSchedule={classSchedule}
            preferences={preferences}
            onOpenFocusTimer={handleOpenFocusTimer}
            onTriggerReplanForSession={handleTriggerReplan}
            onCompleteSession={handleCompleteSession}
            onNavigateTab={setCurrentTab}
            onOpenAddTask={() => setIsAddTaskOpen(true)}
            onSimulateDemoMissed={handleSimulateDemoMissed}
          />
        )}

        {currentTab === 'calendar' && (
          <CalendarScreen
            courses={courses}
            tasks={tasks}
            sessions={sessions}
            classSchedule={classSchedule}
            onOpenFocusTimer={handleOpenFocusTimer}
            onTriggerReplanForSession={handleTriggerReplan}
            onCompleteSession={handleCompleteSession}
            onOpenAddTask={() => setIsAddTaskOpen(true)}
          />
        )}

        {currentTab === 'ai_plan' && (
          <AIPlanScreen
            courses={courses}
            tasks={tasks}
            sessions={sessions}
            preferences={preferences}
            onOpenFocusTimer={handleOpenFocusTimer}
            onTriggerReplanForSession={handleTriggerReplan}
            onCompleteSession={handleCompleteSession}
            onSimulateDemoMissed={handleSimulateDemoMissed}
          />
        )}

        {currentTab === 'tasks' && (
          <TasksScreen
            courses={courses}
            tasks={tasks}
            setTasks={setTasks}
            preferences={preferences}
            onOpenAddTask={() => setIsAddTaskOpen(true)}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileScreen
            preferences={preferences}
            setPreferences={setPreferences}
            courses={courses}
            setCourses={setCourses}
            classSchedule={classSchedule}
            setClassSchedule={setClassSchedule}
            onResetSampleData={handleResetSampleData}
          />
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        pendingTasksCount={pendingTasksCount}
        onOpenAddTask={() => setIsAddTaskOpen(true)}
      />

      {/* Add Task Modal / Bottom Sheet */}
      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        courses={courses}
        preferences={preferences}
        onAddTask={handleAddTask}
      />

      {/* AI Re-plan Bottom Sheet */}
      <ReplanBottomSheet
        isOpen={isReplanOpen}
        onClose={() => setIsReplanOpen(false)}
        diff={replanDiff}
        onApplyReplan={handleApplyReplan}
      />

      {/* Focus Timer Modal */}
      <FocusTimerModal
        isOpen={isFocusTimerOpen}
        onClose={() => setIsFocusTimerOpen(false)}
        session={activeFocusSession}
        task={activeFocusTask}
        course={activeFocusCourse}
        onCompleteSession={handleCompleteSession}
        onMissSession={handleMissFromTimer}
      />

    </div>
  );
}
