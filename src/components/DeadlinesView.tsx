import { useState } from "react";
import { 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Flame, 
  Star, 
  Plus, 
  Sparkles, 
  Calendar,
  CheckSquare,
  Square,
  TrendingUp,
  Award,
  Pin,
  ChevronRight
} from "lucide-react";
import { DeadlineTask } from "../types";

interface DeadlinesViewProps {
  deadlines: DeadlineTask[];
  onToggleSubtask: (deadlineId: string, subtaskId: string) => void;
  onCompleteDeadline: (deadlineId: string) => void;
  onAddNewDeadline: (task: Partial<DeadlineTask>) => void;
}

export const DeadlinesView = ({
  deadlines,
  onToggleSubtask,
  onCompleteDeadline,
  onAddNewDeadline,
}: DeadlinesViewProps) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newCourse, setNewCourse] = useState<string>("CSE102");
  const [newDueDate, setNewDueDate] = useState<string>("2026-08-25T23:59");
  const [newImportance, setNewImportance] = useState<"high" | "medium" | "low">("high");
  const [isHighImpact, setIsHighImpact] = useState<boolean>(false);
  const [xpToast, setXpToast] = useState<string | null>(null);

  // Dynamic separation according to PRD Rules:
  // 1. Focus Zone: Tasks < 48 hours left (Urgency Factor auto promotion)
  const urgentTasks = deadlines.filter((d) => !d.completed && d.hoursLeft <= 48 && !d.isHighImpactProject);
  // 2. High-Impact Projects (Pinned Focus Zone)
  const highImpactProjects = deadlines.filter((d) => !d.completed && d.isHighImpactProject);
  // 3. Normal upcoming tasks (> 48h)
  const upcomingTasks = deadlines.filter((d) => !d.completed && d.hoursLeft > 48 && !d.isHighImpactProject);
  // 4. Completed tasks
  const completedTasks = deadlines.filter((d) => d.completed);

  const handleClaimXp = (deadline: DeadlineTask) => {
    onCompleteDeadline(deadline.id);
    setXpToast(`🎉 Chúc mừng! Bạn đã nhận được +${deadline.xpReward} XP và duy trì Streak học tập!`);
    setTimeout(() => setXpToast(null), 4000);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddNewDeadline({
      title: newTitle,
      courseCode: newCourse,
      courseName: newCourse === "CSE102" ? "Cấu trúc Dữ liệu & GT" : newCourse === "ENG201" ? "Tiếng Anh B2" : "Môn học",
      dueDate: newDueDate,
      hoursLeft: 72,
      importance: newImportance,
      isHighImpactProject: isHighImpact,
      progress: 0,
      xpReward: newImportance === "high" ? 150 : 100,
      completed: false,
      subtasks: [
        { id: `st-${Date.now()}-1`, title: "Nghiên cứu yêu cầu & tài liệu", completed: false },
        { id: `st-${Date.now()}-2`, title: "Hoàn thiện bài nộp chính thức", completed: false }
      ]
    });

    setNewTitle("");
    setShowAddModal(false);
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
              <div
                key={task.id}
                className="bg-slate-50/50 rounded-xl p-4 border border-slate-200 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Badge Row */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Clock className="w-3 h-3 text-rose-600" />
                      Còn {task.hoursLeft} giờ nữa
                    </span>
                    <span className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                      +{task.xpReward} XP
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 leading-snug">{task.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{task.courseName} ({task.courseCode})</p>

                  {/* Subtask Checklists */}
                  <div className="mt-3 pt-3 border-t border-slate-200/70 space-y-1.5">
                    <div className="text-[11px] font-medium text-slate-500 flex items-center justify-between">
                      <span>Nhiệm vụ con ({task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}):</span>
                      <span className="font-bold text-slate-700">{task.progress}%</span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full bg-slate-900 transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>

                    <div className="space-y-1">
                      {task.subtasks.map((st) => (
                        <button
                          key={st.id}
                          onClick={() => onToggleSubtask(task.id, st.id)}
                          className="w-full flex items-center gap-2 text-left text-xs p-1 rounded hover:bg-white text-slate-700 transition-colors"
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
                </div>

                {/* Complete Button */}
                <button
                  onClick={() => handleClaimXp(task)}
                  className="mt-4 w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Hoàn thành & Nhận +{task.xpReward} XP</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. HIGH-IMPACT PROJECTS ZONE (PINNED) */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pin className="w-4 h-4 text-slate-700" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              DỰ ÁN TRỌNG ĐIỂM DÀI HẠN (HIGH-IMPACT PROJECTS)
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-md">
            Ghim cố định
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {highImpactProjects.map((project) => (
            <div
              key={project.id}
              className="bg-slate-50/50 rounded-xl p-4 sm:p-5 border border-slate-200 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {project.courseName}
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-1">{project.title}</h4>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Tiến độ</span>
                    <div className="text-sm sm:text-base font-bold text-slate-900">{project.progress}%</div>
                  </div>
                  <span className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                    +{project.xpReward} XP
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-900 transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>

              {/* Milestone Checklist */}
              <div className="space-y-1.5 pt-2">
                {project.subtasks.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => onToggleSubtask(project.id, st.id)}
                    className="w-full flex items-center gap-2 text-left text-xs p-1.5 rounded-md hover:bg-white text-slate-700 transition-colors"
                  >
                    {st.completed ? (
                      <CheckSquare className="w-4 h-4 text-slate-900 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span className={st.completed ? "line-through text-slate-400 font-medium" : "font-medium"}>
                      {st.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. UPCOMING & COMPLETED LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>Nhiệm Vụ Sắp Tới ({upcomingTasks.length})</span>
          </h3>

          <div className="space-y-2.5">
            {upcomingTasks.map((task) => (
              <div
                key={task.id}
                className="bg-slate-50 hover:bg-slate-100/70 p-3.5 rounded-lg border border-slate-200 flex items-center justify-between gap-3 transition-colors"
              >
                <div>
                  <h5 className="text-xs font-bold text-slate-900">{task.title}</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">{task.courseName} • Hạn nộp: {new Date(task.dueDate).toLocaleDateString("vi-VN")}</p>
                </div>
                <button
                  onClick={() => handleClaimXp(task)}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-900 hover:text-white text-slate-800 text-xs font-semibold rounded-md transition-colors shrink-0 cursor-pointer shadow-2xs"
                >
                  Xong (+{task.xpReward} XP)
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Đã Thu Hoạch XP ({completedTasks.length})</span>
          </h3>

          <div className="space-y-2.5">
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 flex items-center justify-between gap-3"
              >
                <div>
                  <h5 className="text-xs font-medium text-slate-500 line-through">{task.title}</h5>
                  <p className="text-[11px] text-emerald-700 mt-0.5 font-medium">Đã hoàn thành đúng hạn ✨</p>
                </div>
                <span className="text-[11px] font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded-md">
                  +{task.xpReward} XP
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add New Deadline Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-lg border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Thêm Deadline Mới</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center text-xs font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Tên bài tập / Dự án</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ví dụ: Báo cáo đồ án Cấu trúc Dữ liệu..."
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Môn học</label>
                  <select
                    value={newCourse}
                    onChange={(e) => setNewCourse(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  >
                    <option value="CSE102">CSE102 - Cấu trúc Dữ liệu</option>
                    <option value="MTH101">MTH101 - Giải tích 1</option>
                    <option value="ENG201">ENG201 - Tiếng Anh B2</option>
                    <option value="POL101">POL101 - Triết học Mác</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Hạn nộp</label>
                  <input
                    type="datetime-local"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="highImpactCheck"
                  checked={isHighImpact}
                  onChange={(e) => setIsHighImpact(e.target.checked)}
                  className="w-4 h-4 text-slate-900 rounded border-slate-300 focus:ring-slate-900 cursor-pointer"
                />
                <label htmlFor="highImpactCheck" className="text-xs text-slate-700 font-medium cursor-pointer">
                  Ghim vào vùng Dự án trọng điểm (High-Impact)
                </label>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2.5 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors"
                >
                  Lưu Deadline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
