import { useState } from "react";
import { Plus, Award, ChevronRight } from "lucide-react";
import { DeadlineTask } from "../types";
import { useApp } from "../context/AppContext";
import { FocusZone } from "./deadlines/FocusZone";
import { DeadlineCard } from "./deadlines/DeadlineCard";
import { CreateDeadlineModal } from "./deadlines/CreateDeadlineModal";

interface DeadlinesViewProps {
  deadlines?: DeadlineTask[];
  onToggleSubtask?: (deadlineId: string, subtaskId: string) => void;
  onCompleteDeadline?: (deadlineId: string) => void;
  onAddNewDeadline?: (task: Partial<DeadlineTask>) => void;
}

export const DeadlinesView = (props: DeadlinesViewProps) => {
  const app = useApp();

  const deadlines = props.deadlines ?? app.deadlines;
  const onToggleSubtask = props.onToggleSubtask ?? app.toggleSubtask;
  const onCompleteDeadline = props.onCompleteDeadline ?? app.completeDeadline;
  const onAddNewDeadline = props.onAddNewDeadline ?? app.addNewDeadline;

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [xpToast, setXpToast] = useState<string | null>(null);

  // Separation:
  // 1. Focus Zone: Tasks < 48 hours left
  const urgentTasks = deadlines.filter(
    (d) => !d.completed && d.hoursLeft <= 48 && !d.isHighImpactProject
  );
  // 2. High-Impact Projects (Pinned Focus Zone)
  const highImpactProjects = deadlines.filter((d) => !d.completed && d.isHighImpactProject);
  // 3. Normal upcoming tasks (> 48h)
  const upcomingTasks = deadlines.filter(
    (d) => !d.completed && d.hoursLeft > 48 && !d.isHighImpactProject
  );
  // 4. Completed tasks
  const completedTasks = deadlines.filter((d) => d.completed);

  const handleClaimXp = (deadline: DeadlineTask) => {
    onCompleteDeadline(deadline.id);
    setXpToast(`🎉 Chúc mừng! Bạn đã nhận được +${deadline.xpReward} XP và duy trì Streak học tập!`);
    setTimeout(() => setXpToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* View Header & Quick Add */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Quản Lý Deadline Động (Urgency-Importance Matrix)
            </h2>
            <span className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-slate-200">
              Auto-Priority Algorithm
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Tự động đẩy deadline dưới 48 giờ lên vùng Focus Zone & ghim các dự án dài hạn trọng điểm
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Deadline Mới</span>
        </button>
      </div>

      {/* XP Toast Notification */}
      {xpToast && (
        <div className="bg-slate-900 text-white px-4 py-3 rounded-lg text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>{xpToast}</span>
          </div>
          <span className="text-slate-400 text-[11px]">Level Up Progress +3%</span>
        </div>
      )}

      {/* Focus Zone: Urgent & High-Impact */}
      <FocusZone
        urgentTasks={urgentTasks}
        highImpactProjects={highImpactProjects}
        onToggleSubtask={onToggleSubtask}
        onCompleteDeadline={handleClaimXp}
      />

      {/* 3. NORMAL UPCOMING TASKS (>48H) */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            DEADLINE SẮP TỚI (&gt; 48 GIỜ)
          </h3>
          <span className="text-xs font-medium text-slate-500">
            {upcomingTasks.length} Nhiệm vụ
          </span>
        </div>

        {upcomingTasks.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs">
            Hiện không có deadline xa nào khác.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {upcomingTasks.map((task) => (
              <DeadlineCard
                key={task.id}
                task={task}
                onToggleSubtask={onToggleSubtask}
                onCompleteDeadline={handleClaimXp}
              />
            ))}
          </div>
        )}
      </div>

      {/* 4. COMPLETED TASKS (ACCORDION / MINIMAL) */}
      {completedTasks.length > 0 && (
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <ChevronRight className="w-4 h-4 text-emerald-600" />
              <span>ĐÃ HOÀN THÀNH ({completedTasks.length})</span>
            </h3>
            <span className="text-xs text-emerald-800 font-medium">Đã nhận toàn bộ XP</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {completedTasks.map((task) => (
              <DeadlineCard
                key={task.id}
                task={task}
                onToggleSubtask={onToggleSubtask}
                onCompleteDeadline={handleClaimXp}
              />
            ))}
          </div>
        </div>
      )}

      {/* Create Deadline Modal */}
      <CreateDeadlineModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddNewDeadline={onAddNewDeadline}
      />
    </div>
  );
};
