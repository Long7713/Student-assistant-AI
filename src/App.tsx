import React, { useState } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { TimetableView } from "./components/TimetableView";
import { DeadlinesView } from "./components/DeadlinesView";
import { DocsView } from "./components/DocsView";
import { LeaderboardView } from "./components/LeaderboardView";
import { ScholarshipAndGPAView } from "./components/ScholarshipAndGPAView";
import { DRLView } from "./components/DRLView";
import { ScheduleOptimizerModal } from "./components/ScheduleOptimizerModal";
import { GenZChatDrawer } from "./components/GenZChatDrawer";
import { 
  INITIAL_COURSES, 
  INITIAL_SCHEDULE_PLANS, 
  INITIAL_DEADLINES, 
  INITIAL_DOCS, 
  INITIAL_LEADERBOARD 
} from "./mockData";
import { Course, SchedulePlan, DeadlineTask, SmartDoc, LeaderboardUser } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("schedule");
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [plans, setPlans] = useState<SchedulePlan[]>(INITIAL_SCHEDULE_PLANS);
  const [activePlanId, setActivePlanId] = useState<string>("plan-1");
  
  const [deadlines, setDeadlines] = useState<DeadlineTask[]>(INITIAL_DEADLINES);
  const [docs, setDocs] = useState<SmartDoc[]>(INITIAL_DOCS);
  const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>(INITIAL_LEADERBOARD);
  
  const [userGpa, setUserGpa] = useState<number>(3.68);
  const [userDrl, setUserDrl] = useState<number>(88);
  const [userRank, setUserRank] = useState<number>(4);
  const [userStreak, setUserStreak] = useState<number>(16);
  const [userXp, setUserXp] = useState<number>(4850);

  // Modals & Chat state
  const [aiOptimizerOpen, setAiOptimizerOpen] = useState<boolean>(false);
  const [chatOpen, setChatOpen] = useState<boolean>(false);

  // Switch Plan
  const handleSelectPlan = (planId: string) => {
    setActivePlanId(planId);
    const plan = plans.find((p) => p.id === planId);
    if (plan) {
      setCourses(plan.courses);
    }
  };

  // Apply plan from Gemini optimizer
  const handleApplyAiPlan = (plan: SchedulePlan) => {
    setPlans((prev) => [plan, ...prev]);
    setActivePlanId(plan.id);
    setCourses(plan.courses);
  };

  // Quick class code switcher from bottom course cards
  const handleUpdateCourseClass = (courseCode: string, newClassCode: string) => {
    setCourses((prev) =>
      prev.map((c) => (c.code === courseCode ? { ...c, classCode: newClassCode } : c))
    );
  };

  // Toggle Subtask
  const handleToggleSubtask = (deadlineId: string, subtaskId: string) => {
    setDeadlines((prev) =>
      prev.map((d) => {
        if (d.id !== deadlineId) return d;
        const newSubtasks = d.subtasks.map((st) =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        const completedCount = newSubtasks.filter((s) => s.completed).length;
        const newProgress = Math.round((completedCount / newSubtasks.length) * 100);
        return {
          ...d,
          subtasks: newSubtasks,
          progress: newProgress,
        };
      })
    );
  };

  // Complete Deadline & Earn XP
  const handleCompleteDeadline = (deadlineId: string) => {
    const task = deadlines.find((d) => d.id === deadlineId);
    if (!task || task.completed) return;

    setDeadlines((prev) =>
      prev.map((d) => (d.id === deadlineId ? { ...d, completed: true, progress: 100 } : d))
    );

    // Increase user XP
    setUserXp((prev) => prev + task.xpReward);
  };

  // Add new deadline
  const handleAddNewDeadline = (newTask: Partial<DeadlineTask>) => {
    const task: DeadlineTask = {
      id: `dl-${Date.now()}`,
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
      subtasks: newTask.subtasks || [],
    };
    setDeadlines((prev) => [task, ...prev]);
  };

  // Add new document
  const handleAddDoc = (newDoc: SmartDoc) => {
    setDocs((prev) => [newDoc, ...prev]);
    setUserXp((prev) => prev + 50); // +50 XP for sharing study material
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-900 antialiased font-sans">
      {/* Top Header with compact navigation and profile trigger */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        gpa={userGpa}
        drl={userDrl}
        rank={userRank}
        streak={userStreak}
        xp={userXp}
      />

      {/* Main Content Layout with Left Sidebar + Page View */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Left Vertical Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          openAiChat={() => setChatOpen(true)}
          streak={userStreak}
        />

        {/* Dynamic View Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
          {activeTab === "schedule" && (
            <TimetableView
              courses={courses}
              plans={plans}
              activePlanId={activePlanId}
              onSelectPlan={handleSelectPlan}
              onOpenAiOptimizer={() => setAiOptimizerOpen(true)}
              onAddCourse={() => setAiOptimizerOpen(true)}
              onUpdateCourseClass={handleUpdateCourseClass}
            />
          )}

          {activeTab === "deadlines" && (
            <DeadlinesView
              deadlines={deadlines}
              onToggleSubtask={handleToggleSubtask}
              onCompleteDeadline={handleCompleteDeadline}
              onAddNewDeadline={handleAddNewDeadline}
            />
          )}

          {activeTab === "gpa" && <ScholarshipAndGPAView />}

          {activeTab === "drl" && <DRLView />}

          {activeTab === "docs" && <DocsView docs={docs} onAddDoc={handleAddDoc} />}

          {activeTab === "leaderboard" && (
            <LeaderboardView users={leaderboardUsers} currentUserXp={userXp} />
          )}
        </main>
      </div>

      {/* Gemini AI Schedule Optimizer Modal */}
      <ScheduleOptimizerModal
        isOpen={aiOptimizerOpen}
        onClose={() => setAiOptimizerOpen(false)}
        onApplyPlan={handleApplyAiPlan}
        currentCourses={courses}
      />

      {/* Floating Gen Z AI Chat Assistant Button & Drawer */}
      <GenZChatDrawer
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        onOpen={() => setChatOpen(true)}
        gpa={userGpa}
        drl={userDrl}
        streak={userStreak}
      />
    </div>
  );
}
