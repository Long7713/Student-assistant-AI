import React from 'react';
import { Sparkles, Plus, RefreshCw, Zap } from 'lucide-react';

interface MobileHeaderProps {
  studentName: string;
  onOpenAddTask: () => void;
  onSimulateMissedSession: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  studentName,
  onOpenAddTask,
  onSimulateMissedSession,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 py-3">
      <div className="max-w-md sm:max-w-lg mx-auto flex items-center justify-between">
        
        {/* Brand & Student Indicator */}
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-slate-900 text-sm tracking-tight">AI Student</span>
              <span className="px-1.5 py-0.2 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded">Trợ lý học</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Học đúng lúc • Thích ứng linh hoạt</p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Demo Button */}
          <button
            onClick={onSimulateMissedSession}
            id="mobile-header-simulate-btn"
            title="Giả lập bỏ lỡ phiên học để xem AI điều chỉnh lại lịch"
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-bold hover:bg-amber-100 active:scale-95 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin-slow" />
            <span className="hidden xs:inline">Thử</span>
            <span>Bỏ lỡ</span>
          </button>

          {/* Add Task Button */}
          <button
            onClick={onOpenAddTask}
            id="mobile-header-add-task-btn"
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Thêm</span>
          </button>
        </div>

      </div>
    </header>
  );
};
