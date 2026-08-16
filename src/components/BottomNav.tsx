import React from 'react';
import { NavigationTab } from '../types';
import { 
  Sparkles, 
  Calendar as CalendarIcon, 
  BrainCircuit, 
  CheckSquare, 
  User,
  Plus
} from 'lucide-react';

interface BottomNavProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  pendingTasksCount: number;
  onOpenAddTask: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  pendingTasksCount,
  onOpenAddTask,
}) => {
  const tabs = [
    {
      id: 'home' as NavigationTab,
      label: 'Trang chủ',
      icon: Sparkles,
    },
    {
      id: 'calendar' as NavigationTab,
      label: 'Lịch học',
      icon: CalendarIcon,
    },
    {
      id: 'ai_plan' as NavigationTab,
      label: 'Kế hoạch AI',
      icon: BrainCircuit,
      highlight: true,
    },
    {
      id: 'tasks' as NavigationTab,
      label: 'Nhiệm vụ',
      icon: CheckSquare,
      badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
    },
    {
      id: 'profile' as NavigationTab,
      label: 'Hồ sơ',
      icon: User,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
      <div className="max-w-md sm:max-w-lg mx-auto px-3 py-1.5 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              id={`nav-tab-${tab.id}`}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 min-w-[56px] ${
                isActive
                  ? 'text-indigo-600 font-bold scale-105'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              {/* Active Indicator Glow */}
              {isActive && (
                <span className="absolute -top-1.5 w-7 h-1 bg-indigo-600 rounded-full" />
              )}

              {/* Icon Container with Badge */}
              <div className="relative">
                <div
                  className={`p-1 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-slate-500'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
                </div>

                {tab.badge && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {tab.badge}
                  </span>
                )}

                {tab.highlight && !isActive && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
                )}
              </div>

              {/* Label */}
              <span className={`text-[11px] mt-0.5 leading-tight ${isActive ? 'text-indigo-600' : 'text-slate-500'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
