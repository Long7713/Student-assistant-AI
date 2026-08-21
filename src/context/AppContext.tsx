import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Course,
  SchedulePlan,
  DeadlineTask,
  SmartDoc,
  LeaderboardUser,
} from "../types";
import {
  INITIAL_COURSES,
  INITIAL_SCHEDULE_PLANS,
  INITIAL_DEADLINES,
  INITIAL_DOCS,
  INITIAL_LEADERBOARD,
} from "../mockData";
import { generateUniqueId } from "../utils/idGenerator";

export interface UserProfile {
  name: string;
  mssv: string;
  major: string;
  faculty: string;
  university: string;
  academicYear: string;
  avatar: string;
  gpa: number;
  drl: number;
  rank: number;
  streak: number;
  xp: number;
  tier: "Đồng" | "Bạc" | "Vàng" | "Bạch Kim" | "Kim Cương" | "Cao Thủ";
  badges: string[];
}

const DEFAULT_USER_PROFILE: UserProfile = {
  name: "Võ Thành Long",
  mssv: "23110892",
  major: "Kỹ thuật Phần mềm (Chất lượng cao)",
  faculty: "Khoa Khoa học Máy tính",
  university: "Trường ĐH Bách Khoa - ĐHQG-HCM",
  academicYear: "2023 - 2027 (K23)",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  gpa: 3.68,
  drl: 88,
  rank: 4,
  streak: 16,
  xp: 4850,
  tier: "Kim Cương",
  badges: ["Học bá Bách Khoa", "Top 5% Toàn trường", "Thợ săn Deadline", "Streak Master 16d"],
};

function getStoredItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.warn(`Error reading localStorage key "${key}":`, e);
    return defaultValue;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing localStorage key "${key}":`, e);
  }
}

interface AppContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Timetable & Courses
  courses: Course[];
  plans: SchedulePlan[];
  activePlanId: string;
  selectPlan: (planId: string) => void;
  applyAiPlan: (plan: SchedulePlan) => void;
  updateCourseClass: (courseCode: string, newClassCode: string) => void;
  addCourse: (course: Course) => void;
  deleteCourse: (courseId: string) => void;

  // Deadlines
  deadlines: DeadlineTask[];
  toggleSubtask: (deadlineId: string, subtaskId: string) => void;
  completeDeadline: (deadlineId: string) => void;
  addNewDeadline: (newTask: Partial<DeadlineTask>) => void;
  deleteDeadline: (deadlineId: string) => void;

  // Documents
  docs: SmartDoc[];
  addDoc: (newDoc: SmartDoc) => void;
  likeDoc: (docId: string) => void;

  // Leaderboard & Users
  leaderboardUsers: LeaderboardUser[];

  // User Profile & Stats
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  addXp: (amount: number) => void;

  // Modals & UI Drawers
  aiOptimizerOpen: boolean;
  setAiOptimizerOpen: (open: boolean) => void;
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  profileModalOpen: boolean;
  setProfileModalOpen: (open: boolean) => void;

  // Reset
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>("schedule");

  // State with LocalStorage Persistence
  const [courses, setCourses] = useState<Course[]>(() =>
    getStoredItem("edumind_courses", INITIAL_COURSES)
  );
  const [plans, setPlans] = useState<SchedulePlan[]>(() =>
    getStoredItem("edumind_plans", INITIAL_SCHEDULE_PLANS)
  );
  const [activePlanId, setActivePlanId] = useState<string>(() =>
    getStoredItem("edumind_active_plan", "plan-1")
  );
  const [deadlines, setDeadlines] = useState<DeadlineTask[]>(() =>
    getStoredItem("edumind_deadlines", INITIAL_DEADLINES)
  );
  const [docs, setDocs] = useState<SmartDoc[]>(() =>
    getStoredItem("edumind_docs", INITIAL_DOCS)
  );
  const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>(() =>
    getStoredItem("edumind_leaderboard", INITIAL_LEADERBOARD)
  );
  const [userProfile, setUserProfile] = useState<UserProfile>(() =>
    getStoredItem("edumind_user_profile", DEFAULT_USER_PROFILE)
  );

  // Modals
  const [aiOptimizerOpen, setAiOptimizerOpen] = useState<boolean>(false);
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);

  // Sync to LocalStorage on change
  useEffect(() => setStoredItem("edumind_courses", courses), [courses]);
  useEffect(() => setStoredItem("edumind_plans", plans), [plans]);
  useEffect(() => setStoredItem("edumind_active_plan", activePlanId), [activePlanId]);
  useEffect(() => setStoredItem("edumind_deadlines", deadlines), [deadlines]);
  useEffect(() => setStoredItem("edumind_docs", docs), [docs]);
  useEffect(() => setStoredItem("edumind_leaderboard", leaderboardUsers), [leaderboardUsers]);
  useEffect(() => setStoredItem("edumind_user_profile", userProfile), [userProfile]);

  // Actions
  const selectPlan = (planId: string) => {
    setActivePlanId(planId);
    const plan = plans.find((p) => p.id === planId);
    if (plan) {
      setCourses(plan.courses);
    }
  };

  const applyAiPlan = (plan: SchedulePlan) => {
    setPlans((prev) => [plan, ...prev.filter((p) => p.id !== plan.id)]);
    setActivePlanId(plan.id);
    setCourses(plan.courses);
  };

  const updateCourseClass = (courseCode: string, newClassCode: string) => {
    setCourses((prev) =>
      prev.map((c) => (c.code === courseCode ? { ...c, classCode: newClassCode } : c))
    );
  };

  const addCourse = (course: Course) => {
    setCourses((prev) => [...prev, course]);
  };

  const deleteCourse = (courseId: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
  };

  const toggleSubtask = (deadlineId: string, subtaskId: string) => {
    setDeadlines((prev) =>
      prev.map((d) => {
        if (d.id !== deadlineId) return d;
        const newSubtasks = d.subtasks.map((st) =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        const completedCount = newSubtasks.filter((s) => s.completed).length;
        const newProgress = Math.round((completedCount / (newSubtasks.length || 1)) * 100);
        return {
          ...d,
          subtasks: newSubtasks,
          progress: newProgress,
        };
      })
    );
  };

  const addXp = (amount: number) => {
    setUserProfile((prev) => {
      const newXp = prev.xp + amount;
      let newTier = prev.tier;
      if (newXp >= 5000) newTier = "Cao Thủ";
      else if (newXp >= 4000) newTier = "Kim Cương";
      else if (newXp >= 3000) newTier = "Bạch Kim";
      else if (newXp >= 2000) newTier = "Vàng";
      else if (newXp >= 1000) newTier = "Bạc";

      return {
        ...prev,
        xp: newXp,
        tier: newTier,
      };
    });
  };

  const completeDeadline = (deadlineId: string) => {
    const task = deadlines.find((d) => d.id === deadlineId);
    if (!task || task.completed) return;

    setDeadlines((prev) =>
      prev.map((d) => (d.id === deadlineId ? { ...d, completed: true, progress: 100 } : d))
    );

    addXp(task.xpReward);
  };

  const addNewDeadline = (newTask: Partial<DeadlineTask>) => {
    const task: DeadlineTask = {
      id: generateUniqueId("dl"),
      title: newTask.title || "Nhiệm vụ mới",
      courseCode: newTask.courseCode || "CSE102",
      courseName: newTask.courseName || "Môn học",
      dueDate: newTask.dueDate || "2026-08-25T23:59:00",
      hoursLeft: newTask.hoursLeft || 72,
      importance: newTask.importance || "high",
      isHighImpactProject: newTask.isHighImpactProject || false,
      progress: 0,
      xpReward: newTask.xpReward || 100,
      completed: false,
      subtasks: newTask.subtasks || [
        { id: generateUniqueId("st"), title: "Nghiên cứu yêu cầu & tài liệu", completed: false },
        { id: generateUniqueId("st"), title: "Hoàn thiện bài nộp chính thức", completed: false },
      ],
    };
    setDeadlines((prev) => [task, ...prev]);
  };

  const deleteDeadline = (deadlineId: string) => {
    setDeadlines((prev) => prev.filter((d) => d.id !== deadlineId));
  };

  const addDoc = (newDoc: SmartDoc) => {
    setDocs((prev) => [newDoc, ...prev]);
    addXp(50); // +50 XP for sharing study material
  };

  const likeDoc = (docId: string) => {
    setDocs((prev) =>
      prev.map((doc) => (doc.id === docId ? { ...doc, likes: doc.likes + 1 } : doc))
    );
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updates }));
  };

  const resetAllData = () => {
    localStorage.clear();
    setCourses(INITIAL_COURSES);
    setPlans(INITIAL_SCHEDULE_PLANS);
    setActivePlanId("plan-1");
    setDeadlines(INITIAL_DEADLINES);
    setDocs(INITIAL_DOCS);
    setLeaderboardUsers(INITIAL_LEADERBOARD);
    setUserProfile(DEFAULT_USER_PROFILE);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        courses,
        plans,
        activePlanId,
        selectPlan,
        applyAiPlan,
        updateCourseClass,
        addCourse,
        deleteCourse,
        deadlines,
        toggleSubtask,
        completeDeadline,
        addNewDeadline,
        deleteDeadline,
        docs,
        addDoc,
        likeDoc,
        leaderboardUsers,
        userProfile,
        updateUserProfile,
        addXp,
        aiOptimizerOpen,
        setAiOptimizerOpen,
        chatOpen,
        setChatOpen,
        profileModalOpen,
        setProfileModalOpen,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
