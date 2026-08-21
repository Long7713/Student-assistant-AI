import { 
  Calendar, 
  GraduationCap, 
  Sparkles, 
  BookOpen, 
  Trophy, 
  Bot, 
  Flame,
  CheckSquare
} from "lucide-react";
import { useApp } from "../context/AppContext";

interface SidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  openAiChat?: () => void;
  streak?: number;
}

export const Sidebar = (props: SidebarProps) => {
  const app = useApp();

  const activeTab = props.activeTab ?? app.activeTab;
  const setActiveTab = props.setActiveTab ?? app.setActiveTab;
  const openAiChat = props.openAiChat ?? (() => app.setChatOpen(true));
  const streak = props.streak ?? app.userProfile.streak;
  const avatar = app.userProfile.avatar;

  const navItems = [
    { id: "schedule", label: "TKB", icon: Calendar },
    { id: "deadlines", label: "TASK", icon: CheckSquare },
    { id: "gpa", label: "GPA", icon: GraduationCap },
    { id: "drl", label: "ĐRL", icon: Sparkles },
    { id: "docs", label: "DOC", icon: BookOpen },
    { id: "leaderboard", label: "TOP", icon: Trophy },
  ];

  return (
    <aside className="w-16 bg-white border-r border-slate-200 flex flex-col items-center py-4 justify-between select-none z-20 shrink-0">
      {/* Brand Logo */}
      <div className="flex flex-col items-center gap-6">
        <button 
          id="btn-brand-home"
          onClick={() => setActiveTab("schedule")}
          className="flex flex-col items-center group cursor-pointer"
          title="GenZ Study"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-base shadow-xs group-hover:bg-slate-800 transition-colors">
            GZ
          </div>
          <span className="text-[9px] font-bold tracking-wider text-slate-700 mt-1">GENZ STUDY</span>
        </button>

        {/* Vertical Navigation Icons */}
        <nav className="flex flex-col items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center transition-all relative cursor-pointer ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}
                title={item.label}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : ""}`} />
                <span className="text-[9px] font-semibold mt-0.5">{item.label}</span>
              </button>
            );
          })}

          {/* Direct AI trigger button */}
          <button
            id="sidebar-btn-ai-chat"
            onClick={openAiChat}
            className="w-10 h-10 rounded-lg flex flex-col items-center justify-center bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all border border-slate-200 shadow-2xs group mt-1 cursor-pointer"
            title="Hỏi AI Gen Z ✨"
          >
            <Bot className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            <span className="text-[9px] font-bold mt-0.5">AI</span>
          </button>
        </nav>
      </div>

      {/* Bottom Streak badge & Profile thumbnail */}
      <div className="flex flex-col items-center gap-3">
        <div 
          className="bg-amber-50/80 border border-amber-200 rounded-lg px-2 py-1 text-center cursor-pointer hover:bg-amber-100/80 transition-colors shadow-2xs"
          title={`Chuỗi ${streak} ngày học liên tiếp`}
        >
          <div className="flex items-center gap-1 text-amber-900 text-[10px] font-bold">
            <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
            <span>{streak}D</span>
          </div>
        </div>

        <button 
          id="btn-user-avatar-profile"
          onClick={() => setActiveTab("gpa")}
          className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 hover:ring-2 hover:ring-slate-300 transition-all cursor-pointer"
        >
          <img
            src={avatar}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </button>
      </div>
    </aside>
  );
};
