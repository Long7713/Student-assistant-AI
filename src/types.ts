export type Priority = 'high' | 'medium' | 'low';

export type TaskType = 'assignment' | 'exam_prep' | 'reading' | 'project' | 'lab_report';

export type SessionStatus = 'scheduled' | 'in_progress' | 'completed' | 'missed';

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Sun, 1=Mon, ..., 6=Sat

export interface Course {
  id: string;
  code: string;
  name: string;
  color: string; // Tailwind color token or hex e.g. 'indigo', 'emerald', 'amber', 'rose', 'sky', 'purple'
  credits: number;
  professor?: string;
}

export interface ClassSchedule {
  id: string;
  courseId: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // "09:30"
  endTime: string;   // "11:00"
  location?: string;
  type: 'lecture' | 'lab' | 'discussion' | 'office_hours';
}

export interface StudyWindow {
  id: string;
  start: string; // "08:00"
  end: string;   // "12:00"
  label: string; // "Morning Focus"
  days: DayOfWeek[];
}

export interface StudentPreferences {
  name: string;
  major: string;
  university: string;
  studyWindows: StudyWindow[];
  maxDailyStudyHours: number;
  preferredSessionLength: number; // in minutes e.g. 60 or 90
  breakLength: number; // minutes
  peakFocusTime: 'morning' | 'afternoon' | 'evening';
  isOnboarded: boolean;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  type: TaskType;
  deadline: string; // ISO date string e.g. "2026-08-18T23:59"
  estimatedMinutes: number;
  completedMinutes: number;
  priority: Priority;
  difficulty: 1 | 2 | 3 | 4 | 5;
  status: 'not_started' | 'in_progress' | 'completed';
  subtasks?: Subtask[];
  createdAt: string;
}
export interface StudySession {
  id: string;
  taskId?: string;
  courseId?: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  status: SessionStatus;
  goal: string;
  missedReason?: string;
  replanTag?: string;
}

export interface SessionChange {
  id: string;
  type: 'moved' | 'rescheduled_tomorrow' | 'split' | 'added' | 'extended' | 'deprioritized';
  taskId: string;
  taskTitle: string;
  courseCode: string;
  courseColor: string;
  priority: Priority;
  previousSession?: {
    date: string;
    startTime: string;
    endTime: string;
  };
  newSession?: {
    date: string;
    startTime: string;
    endTime: string;
  };
  explanation: string;
  urgencyImpact: 'protected_high_priority' | 'safely_deferred' | 'balanced_workload';
}

export interface ReplanDiff {
  id: string;
  timestamp: string;
  triggerSessionId?: string;
  triggerReason: string;
  aiRationale: string;
  workloadSummary: {
    todayHoursBefore: number;
    todayHoursAfter: number;
    tomorrowHours: number;
    deadlinesSafeCount: number;
    atRiskCount: number;
  };
  keyAdjustments: string[];
  changes: SessionChange[];
  beforeSessions: StudySession[];
  proposedSessions: StudySession[];
}

export type NavigationTab = 'home' | 'calendar' | 'ai_plan' | 'tasks' | 'profile';

export type ActiveScreen = 'onboarding' | 'dashboard' | 'add_task' | 'replan_modal';

