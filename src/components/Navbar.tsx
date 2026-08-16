import React from 'react';
import { ActiveScreen } from '../types';
import { 
  Sparkles, 
  Calendar, 
  PlusCircle, 
  Settings, 
  GraduationCap, 
  RefreshCw,
  Clock,
  BookOpen
} from 'lucide-react';

interface NavbarProps {
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  onOpenAddTask: () => void;
  onSimulateMissedSession: () => void;
  todayStudyHours: number;
  maxStudyHours: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeScreen,
  setActiveScreen,
  onOpenAddTask,
  onSimulateMissedSession,
  todayStudyHours,
  maxStudyHours,
}) => {
  const percentComplete = Math.min(100, Math.round((todayStudyHours / maxStudyHours) * 100));

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Product Tagline */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveScreen('dashboard')}
              className="flex items-center space-x-2.5 text-left group focus:outline-none"
              id="app-brand-logo-btn"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center shadow-sm shadow-indigo-200 dark:shadow-none group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-lg tracking-tight">
                    AI Student Assistant
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800">
                    <Sparkles className="w-2.5 h-2.5 mr-0.5" /> Adaptive
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                  Smart daily study planner around fixed classes & deadlines
                </p>
              </div>
            </button>
          </div>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveScreen('dashboard')}
              id="nav-dashboard-tab"
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeScreen === 'dashboard'
                  ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Today's AI Plan</span>
            </button>

            <button
              onClick={() => setActiveScreen('onboarding')}
              id="nav-setup-tab"
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeScreen === 'onboarding'
                  ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Classes & Capacity</span>
            </button>
          </nav>

          {/* Right Actions & Quick Demo Trigger */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Quick Demo Re-plan Trigger */}
            <button
              onClick={onSimulateMissedSession}
              id="demo-missed-replan-btn"
              title="Test the AI Re-plan flow immediately"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700 transition-colors shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-spin-hover" />
              <span>Demo Missed Re-plan</span>
            </button>

            {/* Add Task Button */}
            <button
              onClick={onOpenAddTask}
              id="header-add-task-btn"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Add Task</span>
              <span className="sm:hidden">Add</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
