import { Sparkles, CalendarCheck, Plus, CheckCircle2 } from "lucide-react";
import { SchedulePlan } from "../../types";

interface TimetableHeaderProps {
  plans: SchedulePlan[];
  activePlanId: string;
  onSelectPlan: (planId: string) => void;
  onOpenAiOptimizer: () => void;
  onAddCourse: () => void;
  isCalendarSynced: boolean;
  syncing: boolean;
  onToggleSync: () => void;
}

export const TimetableHeader = ({
  plans,
  activePlanId,
  onSelectPlan,
  onOpenAiOptimizer,
  onAddCourse,
  isCalendarSynced,
  syncing,
  onToggleSync,
}: TimetableHeaderProps) => {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-2xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
      {/* Left: Plan selector & Active status */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          {plans.map((p) => (
            <button
              key={p.id}
              id={`btn-plan-${p.id}`}
              onClick={() => onSelectPlan(p.id)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                activePlanId === p.id
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          0 Trùng lịch • Tiết kiệm 4.5h di chuyển
        </span>
      </div>

      {/* Right: AI Optimizer & Google Calendar Sync Buttons */}
      <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto">
        <button
          id="btn-ai-schedule-optimizer"
          onClick={onOpenAiOptimizer}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold px-4 py-2.5 rounded-lg shadow-2xs transition-all cursor-pointer group"
        >
          <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
          <span>AI Xếp Lịch & Tránh Trùng</span>
        </button>

        <button
          id="btn-google-calendar-sync"
          onClick={onToggleSync}
          disabled={syncing}
          className={`flex items-center justify-center gap-2 text-xs font-semibold px-3.5 py-2.5 rounded-lg border transition-all cursor-pointer ${
            isCalendarSynced
              ? "bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100/70"
              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
          title="Đồng bộ 2 chiều với Google Calendar"
        >
          <CalendarCheck
            className={`w-4 h-4 ${
              syncing ? "animate-spin text-blue-600" : isCalendarSynced ? "text-blue-600" : "text-slate-400"
            }`}
          />
          <span className="hidden sm:inline">
            {isCalendarSynced ? "Đã Sync Google Calendar" : "Đồng bộ Google Calendar"}
          </span>
        </button>

        <button
          id="btn-add-new-course"
          onClick={onAddCourse}
          className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3 py-2.5 rounded-lg transition-all cursor-pointer"
          title="Thêm lớp học hoặc buổi học bù"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Thêm lớp</span>
        </button>
      </div>
    </div>
  );
};
