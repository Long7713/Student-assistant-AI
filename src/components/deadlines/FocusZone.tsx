import { Pin } from "lucide-react";
import { DeadlineTask } from "../../types";
import { DeadlineCard } from "./DeadlineCard";

interface FocusZoneProps {
  urgentTasks: DeadlineTask[];
  highImpactProjects: DeadlineTask[];
  onToggleSubtask: (deadlineId: string, subtaskId: string) => void;
  onCompleteDeadline: (deadline: DeadlineTask) => void;
}

export const FocusZone = ({
  urgentTasks,
  highImpactProjects,
  onToggleSubtask,
  onCompleteDeadline,
}: FocusZoneProps) => {
  return (
    <div className="space-y-6">
      {/* 1. FOCUS ZONE: URGENT DEADLINES (<48H) */}
      <div className="bg-white rounded-xl p-5 border border-rose-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
            <h3 className="text-xs font-bold text-rose-950 uppercase tracking-wider flex items-center gap-1.5">
              <span>FOCUS ZONE: DEADLINE KHẨN CẤP (&lt; 48 GIỜ)</span>
            </h3>
          </div>
          <span className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-md">
            {urgentTasks.length} Nhiệm vụ ưu tiên cao
          </span>
        </div>

        {urgentTasks.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs">
            🎉 Bạn không còn deadline gấp nào trong 48 giờ tới.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {urgentTasks.map((task) => (
              <DeadlineCard
                key={task.id}
                task={task}
                onToggleSubtask={onToggleSubtask}
                onCompleteDeadline={onCompleteDeadline}
              />
            ))}
          </div>
        )}
      </div>

      {/* 2. HIGH-IMPACT PROJECTS (PINNED) */}
      {highImpactProjects.length > 0 && (
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Pin className="w-4 h-4 text-slate-700" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                DỰ ÁN & ĐỒ ÁN TRỌNG ĐIỂM (GHIM TIẾN ĐỘ)
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-md">
              {highImpactProjects.length} Đồ án lớn
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {highImpactProjects.map((task) => (
              <DeadlineCard
                key={task.id}
                task={task}
                onToggleSubtask={onToggleSubtask}
                onCompleteDeadline={onCompleteDeadline}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
