import { useState } from "react";
import { DeadlineTask } from "../../types";
import { generateUniqueId } from "../../utils/idGenerator";

interface CreateDeadlineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNewDeadline: (task: Partial<DeadlineTask>) => void;
}

export const CreateDeadlineModal = ({
  isOpen,
  onClose,
  onAddNewDeadline,
}: CreateDeadlineModalProps) => {
  const [newTitle, setNewTitle] = useState<string>("");
  const [newCourse, setNewCourse] = useState<string>("CSE102");
  const [newDueDate, setNewDueDate] = useState<string>("2026-08-25T23:59");
  const [newImportance, setNewImportance] = useState<"high" | "medium" | "low">("high");
  const [isHighImpact, setIsHighImpact] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddNewDeadline({
      title: newTitle,
      courseCode: newCourse,
      courseName:
        newCourse === "CSE102"
          ? "Cấu trúc Dữ liệu & GT"
          : newCourse === "ENG201"
          ? "Tiếng Anh B2"
          : "Môn học",
      dueDate: newDueDate,
      hoursLeft: 72,
      importance: newImportance,
      isHighImpactProject: isHighImpact,
      progress: 0,
      xpReward: newImportance === "high" ? 150 : 100,
      completed: false,
      subtasks: [
        { id: generateUniqueId("st"), title: "Nghiên cứu yêu cầu & tài liệu", completed: false },
        { id: generateUniqueId("st"), title: "Hoàn thiện bài nộp chính thức", completed: false },
      ],
    });

    setNewTitle("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-lg border border-slate-200 animate-in zoom-in-95">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900">Thêm Deadline Mới</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tên bài tập / Đồ án:
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="VD: Báo cáo Lab 3 - Cây AVL"
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-lg p-2.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Môn học:</label>
              <select
                value={newCourse}
                onChange={(e) => setNewCourse(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-lg p-2.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                <option value="CSE102">CSE102 - Cấu trúc DL</option>
                <option value="ENG201">ENG201 - Tiếng Anh B2</option>
                <option value="MTH101">MTH101 - Giải tích 1</option>
                <option value="POL101">POL101 - Triết học M-L</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mức độ ưu tiên:</label>
              <select
                value={newImportance}
                onChange={(e) => setNewImportance(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-lg p-2.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                <option value="high">Cao (+150 XP)</option>
                <option value="medium">Trung bình (+100 XP)</option>
                <option value="low">Thấp (+50 XP)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Hạn nộp (Due Date):</label>
            <input
              type="datetime-local"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-lg p-2.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="highImpactCheck"
              checked={isHighImpact}
              onChange={(e) => setIsHighImpact(e.target.checked)}
              className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900 border-slate-300"
            />
            <label htmlFor="highImpactCheck" className="text-xs text-slate-700 font-medium cursor-pointer">
              Đồ án lớn / NCKH (Ghim vào Focus Zone)
            </label>
          </div>

          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              Thêm Deadline
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
