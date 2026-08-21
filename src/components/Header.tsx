import { useState } from "react";
import { 
  Calendar, 
  GraduationCap, 
  Users, 
  Trophy, 
  Flame, 
  Sparkles,
  BookOpen,
  CheckSquare,
  User,
  ChevronDown
} from "lucide-react";
import { ProfileModal } from "./ProfileModal";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  gpa: number;
  drl: number;
  rank: number;
  streak: number;
  xp?: number;
}

export const Header = ({
  activeTab,
  setActiveTab,
  gpa,
  drl,
  rank,
  streak,
  xp = 2450,
}: HeaderProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const tabs = [
    { id: "schedule", label: "TỐI ƯU TKB", icon: Calendar },
    { id: "deadlines", label: "DEADLINE & NHIỆM VỤ", icon: CheckSquare },
    { id: "gpa", label: "SĂN HỌC BỔNG & GPA", icon: GraduationCap },
    { id: "drl", label: "HOẠT ĐỘNG & ĐRL", icon: Users },
    { id: "docs", label: "KHO TÀI LIỆU & ĐỀ THI", icon: BookOpen },
    { id: "leaderboard", label: "BẢNG XẾP HẠNG", icon: Trophy },
  ];

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="px-4 lg:px-6 max-w-[1600px] mx-auto flex items-center justify-between h-14 gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-2xs">
                EM
              </div>
              <div>
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-sm font-bold text-slate-900 tracking-tight">EduMind AI</span>
                  <span className="bg-slate-100 text-slate-600 border border-slate-200 text-[9px] font-semibold px-1.5 py-0.2 rounded font-mono">
                    ĐHQG
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Trợ lý học tập thông minh</span>
              </div>
            </div>
          </div>

          {/* Main Feature Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-slate-900 text-white shadow-2xs"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Side: Profile Pill Button */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Streak indicator */}
            <div className="hidden sm:flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-900 px-2 py-1 rounded-md text-xs font-semibold shadow-2xs">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{streak}D</span>
            </div>

            {/* Profile Trigger Button */}
            <button
              id="btn-open-profile"
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer group"
              title="Xem thông tin cá nhân & thành tích"
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                  alt="Nam Trần"
                  className="w-7 h-7 rounded-full border border-slate-200 object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border border-white rounded-full"></span>
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1">
                  <span>Nam Trần</span>
                  <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-700 transition-transform" />
                </div>
                <div className="text-[10px] text-slate-500">K23 • Khoa CNTT</div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="md:hidden px-3 py-1.5 border-t border-slate-100 overflow-x-auto no-scrollbar flex items-center gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Dedicated Personal Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        gpa={gpa}
        drl={drl}
        rank={rank}
        streak={streak}
        xp={xp}
        onNavigateTab={setActiveTab}
      />
    </>
  );
};

