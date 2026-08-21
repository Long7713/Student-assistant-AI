import { Clock, CheckSquare, Square, Award } from "lucide-react";
import { DeadlineTask } from "../../types";

interface DeadlineCardProps {
  task: DeadlineTask;
  onToggleSubtask: (deadlineId: string, subtaskId: string) => void;
  onCompleteDeadline: (deadline: DeadlineTask) => void;
}

export const DeadlineCard = ({
  task,
  onToggleSubtask,
  onCompleteDeadline,
}: DeadlineCardProps) => {
  const isUrgent = task.hoursLeft <= 48 && !task.completed;

  return (
    <div
      id={`deadline-card-${task.id}`}
      className={`rounded-xl p-4 border transition-all flex flex-col justify-between ${
        task.completed
          ? "bg-slate-50 border-slate-200 opacity-80"
          : isUrgent
          ? "bg-slate-50/50 hover:bg-slate-50 border-slate-200"
          : "bg-white hover:border-slate-300 border-slate-200 shadow-2xs"
      }`}
    >
      <div>
        {/* Badge Row */}
        <div className="flex items-center justify-between gap-2 mb-2">
          {task.completed ? (
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
              Đã hoàn thành
            </span>
          ) : isUrgent ? (
            <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
              <Clock className="w-3 h-3 text-rose-600" />
              Còn {task.hoursLeft} giờ nữa
            </span>
          ) : (
            <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              Còn {task.hoursLeft} giờ ({task.dueDate.split("T")[0]})
            </span>
          )}

          <span className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
            <Award className="w-3 h-3 text-amber-600" />
            +{task.xpReward} XP
          </span>
        </div>

        <h4
          className={`text-sm font-bold text-slate-900 leading-snug ${
            task.completed ? "line-through text-slate-500" : ""
          }`}
        >
          {task.title}
        </h4>
        <p className="text-xs text-slate-500 mt-0.5">
          {task.courseName} ({task.courseCode})
        </p>

        {/* Subtask Checklists */}
        {task.subtasks && task.subtasks.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-200/70 space-y-1.5">
            <div className="text-[11px] font-medium text-slate-500 flex items-center justify-between">
              <span>
                Nhiệm vụ con ({task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length}):
              </span>
              <span className="font-bold text-slate-700">{task.progress}%</span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-2">
              <div
                className={`h-full transition-all duration-300 ${
                  task.completed ? "bg-emerald-600" : "bg-slate-900"
                }`}
                style={{ width: `${task.progress}%` }}
              ></div>
            </div>

            <div className="space-y-1">
              {task.subtasks.map((st) => (
                <button
                  key={st.id}
                  onClick={() => onToggleSubtask(task.id, st.id)}
                  disabled={task.completed}
                  className="w-full flex items-center gap-2 text-left text-xs p-1 rounded hover:bg-slate-100/80 text-slate-700 transition-colors cursor-pointer"
                >
                  {st.completed ? (
                    <CheckSquare className="w-3.5 h-3.5 text-slate-900 shrink-0" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                  <span className={st.completed ? "line-through text-slate-400" : ""}>
                    {st.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Complete Button */}
      {!task.completed && (
        <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={() => onCompleteDeadline(task)}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>Hoàn thành & Nhận +{task.xpReward} XP</span>
          </button>
        </div>
      )}
    </div>
  );
};
