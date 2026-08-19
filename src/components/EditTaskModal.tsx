import React, { useState, useEffect } from 'react';
import { Course, Task, TaskType, Priority, Subtask, StudentPreferences } from '../types';
import { formatMinutesToDuration } from '../utils/dateUtils';
import { getCourseColor } from '../utils/courseColors';
import { 
  X, 
  Sparkles, 
  Calendar, 
  Clock, 
  CheckSquare, 
  Plus, 
  Trash2, 
  Flame,
  CheckCircle2,
  BookOpen,
  Zap,
  Sliders,
  Save
} from 'lucide-react';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  courses: Course[];
  preferences: StudentPreferences;
  onSaveTask: (updatedTask: Task) => void;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
  isOpen,
  onClose,
  task,
  courses,
  preferences,
  onSaveTask,
}) => {
  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [taskType, setTaskType] = useState<TaskType>('assignment');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('23:59');
  const [estimatedMinutes, setEstimatedMinutes] = useState(180);
  const [completedMinutes, setCompletedMinutes] = useState(0);
  const [priority, setPriority] = useState<Priority>('high');
  const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskInput, setNewSubtaskInput] = useState('');
  const [isEstimating, setIsEstimating] = useState(false);
  const [aiTip, setAiTip] = useState<string | null>(null);

  // Sync state whenever the selected task changes or modal opens
  useEffect(() => {
    if (task) {
      setCourseId(task.courseId);
      setTitle(task.title);
      setDescription(task.description || '');
      setTaskType(task.type);
      
      const [dDate, dTime] = (task.deadline || '').split('T');
      setDeadlineDate(dDate || '');
      setDeadlineTime(dTime || '23:59');
      
      setEstimatedMinutes(task.estimatedMinutes);
      setCompletedMinutes(task.completedMinutes || 0);
      setPriority(task.priority);
      setDifficulty(task.difficulty || 3);
      setSubtasks(task.subtasks ? [...task.subtasks] : []);
      setAiTip(null);
    }
  }, [task, isOpen]);

  if (!isOpen || !task) return null;

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskInput.trim()) return;
    setSubtasks([
      ...subtasks,
      { id: `st_${Date.now()}`, title: newSubtaskInput.trim(), completed: false },
    ]);
    setNewSubtaskInput('');
  };

  const handleToggleSubtask = (id: string) => {
    setSubtasks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter((s) => s.id !== id));
  };

  // AI Smart Estimation & Subtask Breakdown
  const handleAiSmartEstimate = async () => {
    if (!title.trim()) return;
    setIsEstimating(true);
    const selectedCourse = courses.find((c) => c.id === courseId);

    try {
      const response = await fetch('/api/estimate-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskTitle: title,
          courseName: selectedCourse ? `${selectedCourse.code} ${selectedCourse.name}` : 'Môn học',
          taskType,
          deadline: `${deadlineDate}T${deadlineTime}`,
        }),
      });

      const data = await response.json();
      if (data.estimatedMinutes) {
        setEstimatedMinutes(data.estimatedMinutes);
      }
      if (data.difficulty) {
        setDifficulty(data.difficulty as any);
      }
      if (data.suggestedSubtasks && Array.isArray(data.suggestedSubtasks)) {
        setSubtasks(
          data.suggestedSubtasks.map((stText: string, idx: number) => ({
            id: `st_ai_${Date.now()}_${idx}`,
            title: stText,
            completed: false,
          }))
        );
      }
      if (data.focusStrategy) {
        setAiTip(data.focusStrategy);
      }
    } catch (e) {
      console.log('Using local heuristics for estimation');
    } finally {
      setIsEstimating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !courseId) return;

    const allSubtasksDone = subtasks.length > 0 && subtasks.every((s) => s.completed);
    const someSubtasksDone = subtasks.some((s) => s.completed);

    const updatedTask: Task = {
      ...task,
      courseId,
      title: title.trim(),
      description: description.trim() || undefined,
      type: taskType,
      deadline: `${deadlineDate}T${deadlineTime}`,
      estimatedMinutes,
      completedMinutes: Math.min(completedMinutes, estimatedMinutes),
      priority,
      difficulty,
      subtasks,
      status: allSubtasksDone
        ? 'completed'
        : someSubtasksDone || completedMinutes > 0
        ? 'in_progress'
        : task.status,
    };

    onSaveTask(updatedTask);
    onClose();
  };

  const selectedCourseObj = courses.find((c) => c.id === courseId);
  const colorToken = selectedCourseObj ? getCourseColor(selectedCourseObj.color) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        id="edit-task-modal"
        className="w-full max-w-md sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200/60 flex items-center justify-center text-indigo-600">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Chỉnh sửa nhiệm vụ
              </h2>
              <p className="text-[11px] text-slate-500">
                Cập nhật hạn nộp, độ ưu tiên hoặc danh sách công việc con
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          
          {/* Course Selector */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Môn học *</span>
              {colorToken && (
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${colorToken.badgeBg} ${colorToken.badgeText}`}>
                  {selectedCourseObj?.code}
                </span>
              )}
            </label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Task Title with AI Estimation Button */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Tên bài tập / nhiệm vụ *</label>
              <button
                type="button"
                onClick={handleAiSmartEstimate}
                disabled={!title.trim() || isEstimating}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isEstimating ? 'AI đang phân tích...' : 'AI ước tính'}</span>
              </button>
            </div>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Bài tập lớn Học máy, Ôn tập giữa kỳ..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Task Type & Priority Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Loại nhiệm vụ
              </label>
              <select
                value={taskType}
                onChange={(e) => setTaskType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="assignment">Bài tập về nhà (Assignment)</option>
                <option value="exam_prep">Ôn thi (Exam Prep)</option>
                <option value="project">Dự án (Project)</option>
                <option value="reading">Đọc tài liệu (Reading)</option>
                <option value="lab_report">Báo cáo thực hành (Lab)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Mức ưu tiên
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className={`w-full px-3 py-2 rounded-xl border font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                  priority === 'high'
                    ? 'border-rose-300 bg-rose-50 text-rose-700'
                    : priority === 'medium'
                    ? 'border-amber-300 bg-amber-50 text-amber-700'
                    : 'border-slate-200 bg-slate-50 text-slate-700'
                }`}
              >
                <option value="high">🔴 Rất quan trọng (High)</option>
                <option value="medium">🟡 Trung bình (Medium)</option>
                <option value="low">🟢 Bình thường (Low)</option>
              </select>
            </div>
          </div>

          {/* Deadline Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Hạn chót (Ngày) *</span>
              </label>
              <input
                type="date"
                required
                value={deadlineDate}
                onChange={(e) => setDeadlineDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Giờ nộp *</span>
              </label>
              <input
                type="time"
                required
                value={deadlineTime}
                onChange={(e) => setDeadlineTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Workload Estimate & Progress */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>Tổng khối lượng ước lượng</span>
              </span>
              <span className="font-extrabold text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded-lg text-xs">
                {formatMinutesToDuration(estimatedMinutes)} ({estimatedMinutes} phút)
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {[60, 90, 120, 180, 240, 360].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setEstimatedMinutes(mins)}
                  className={`flex-1 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                    estimatedMinutes === mins
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {mins >= 60 ? `${mins / 60}h` : `${mins}p`}
                </button>
              ))}
            </div>

            {/* Completed Minutes Progress */}
            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1">
                <span>Đã học được: <strong>{formatMinutesToDuration(completedMinutes)}</strong></span>
                <span className="text-slate-400">({Math.round((completedMinutes / estimatedMinutes) * 100)}%)</span>
              </div>
              <input
                type="range"
                min={0}
                max={estimatedMinutes}
                step={15}
                value={completedMinutes}
                onChange={(e) => setCompletedMinutes(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>

          {/* AI Strategy Tip */}
          {aiTip && (
            <div className="p-3 bg-indigo-50/70 rounded-2xl border border-indigo-200/50 flex items-start space-x-2 text-indigo-900 animate-in fade-in">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong className="block text-indigo-800 font-bold mb-0.5">Chiến lược học tập từ Gemini:</strong>
                {aiTip}
              </div>
            </div>
          )}

          {/* Subtasks Breakdown */}
          <div className="space-y-2 pt-1">
            <label className="block font-bold text-slate-700 flex items-center justify-between">
              <span>Danh sách công việc con ({subtasks.filter((s) => s.completed).length}/{subtasks.length})</span>
              <span className="text-[10px] text-slate-400 font-normal">Tự động tính tiến độ</span>
            </label>

            <div className="space-y-1.5">
              {subtasks.map((st) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between bg-slate-50 border border-slate-100 p-2 rounded-xl text-slate-700"
                >
                  <label className="flex items-center space-x-2 flex-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={() => handleToggleSubtask(st.id)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className={`text-[11px] ${st.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {st.title}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(st.id)}
                    className="text-slate-300 hover:text-rose-500 p-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Subtask Input */}
            <div className="flex items-center space-x-2 pt-1">
              <input
                type="text"
                value={newSubtaskInput}
                onChange={(e) => setNewSubtaskInput(e.target.value)}
                placeholder="Thêm việc nhỏ cần làm..."
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask(e);
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs active:scale-95 transition-all flex items-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Lưu thay đổi</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
