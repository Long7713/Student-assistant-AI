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
import { AppProvider, useApp } from "./context/AppContext";

function AppContent() {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-900 antialiased font-sans">
      {/* Top Header with navigation and personal profile */}
      <Header />

      {/* Main Layout: Left Sidebar + Active View */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Left Vertical Navigation Sidebar */}
        <Sidebar />

        {/* Dynamic View Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
          {activeTab === "schedule" && <TimetableView />}
          {activeTab === "deadlines" && <DeadlinesView />}
          {activeTab === "gpa" && <ScholarshipAndGPAView />}
          {activeTab === "drl" && <DRLView />}
          {activeTab === "docs" && <DocsView />}
          {activeTab === "leaderboard" && <LeaderboardView />}
        </main>
      </div>

      {/* Gemini AI Schedule Optimizer Modal */}
      <ScheduleOptimizerModal />

      {/* Floating Gen Z AI Chat Assistant Drawer */}
      <GenZChatDrawer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
