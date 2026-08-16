import React, { useState } from 'react';
import { Course, Task, TaskType, Priority, Subtask, StudentPreferences, StudySession } from '../types';
import { getRelativeDateString, formatMinutesToDuration } from '../utils/dateUtils';
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
  Sliders
} from 'lucide-react';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  preferences: StudentPreferences;
  onAddTask: (task: Task, autoScheduledSessions: StudySession[]) => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  courses,
  preferences,
  onAddTask,
}) => {
  const tomorrow = getRelativeDateString(1);
  const in2Days = getRelativeDateString(2);
  const in3Days = getRelativeDateString(3);
  const in5Days = getRelativeDateString(5);

  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [taskType, setTaskType] = useState<TaskType>('assignment');
  const [deadlineDate, setDeadlineDate] = useState(in2Days);
  const [deadlineTime, setDeadlineTime] = useState('23:59');
  const [estimatedMinutes, setEstimatedMinutes] = useState(180);
  const [priority, setPriority] = useState<Priority>('high');
  const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [subtasks, setSubtasks] = useState<Subtask[]>([
    { id: 'st_1', title: 'Ôn tập kiến thức cốt lõi & công thức liên quan', completed: false },
    { id: 'st_2', title: 'Giải quyết các câu hỏi trọng tâm của bài', completed: false },
  ]);
  const [newSubtaskInput, setNewSubtaskInput] = useState('');
  const [isEstimating, setIsEstimating] = useState(false);
  const [aiTip, setAiTip] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskInput.trim()) return;
    setSubtasks([
      ...subtasks,
      { id: `st_${Date.now()}`, title: newSubtaskInput.trim(), completed: false },
    ]);
    setNewSubtaskInput('');
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
          courseName: selectedCourse ? `${selectedCourse.code} ${selectedCourse.name}` : 'Môn đại học',
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
    } catch (err) {
      console.warn('AI estimate error:', err);
    } finally {
      setIsEstimating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !courseId) return;

    const newTask: Task = {
      id: `task_${Date.now()}`,
      courseId,
      title: title.trim(),
      description: description.trim() || undefined,
      type: taskType,
      deadline: `${deadlineDate}T${deadlineTime}`,
      estimatedMinutes,
      completedMinutes: 0,
      priority,
      difficulty,
      status: 'not_started',
      subtasks,
      createdAt: new Date().toISOString(),
    };

    // Auto-generate realistic study blocks
    const sessionLength = preferences.preferredSessionLength || 90;
    const numSessions = Math.max(1, Math.ceil(estimatedMinutes / sessionLength));
    const autoSessions: StudySession[] = [];

    const dateSlots = [
      getRelativeDateString(0),
      getRelativeDateString(1),
      getRelativeDateString(2),
    ];

    const timeSlots = [
      { start: '14:30', end: '16:00', dur: 90 },
      { start: '19:30', end: '21:00', dur: 90 },
      { start: '08:30', end: '10:00', dur: 90 },
    ];

    for (let i = 0; i < numSessions; i++) {
      const targetDate = dateSlots[i % dateSlots.length];
      const slot = timeSlots[i % timeSlots.length];
      autoSessions.push({
        id: `sess_gen_${Date.now()}_${i}`,
        taskId: newTask.id,
        date: targetDate,
        startTime: slot.start,
        endTime: slot.end,
        durationMinutes: Math.min(estimatedMinutes - i * sessionLength, sessionLength),
        status: 'scheduled',
        goal: `Phiên ${i + 1}/${numSessions}: ${newTask.title}`,
      });
    }

    onAddTask(newTask, autoSessions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        id="add-task-bottom-sheet"
        className="w-full max-w-md sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
      >
        
        {/* Header */}
        <div className="p-4 pb-2 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="font-extrabold text-slate-900 text-base">Thêm nhiệm vụ mới</h2>
            <p className="text-xs text-slate-400">AI sẽ tự động chia nhỏ và xếp lịch học cho bạn</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto">
          
          {/* Course Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Môn học</label>
            <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
              {courses.map((c) => {
                const colors = getCourseColor(c.color);
                const isSelected = courseId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCourseId(c.id)}
                    className={`px-3 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all border ${
                      isSelected
                        ? `${colors.badgeBg} ${colors.badgeText} border-indigo-500 shadow-xs scale-102`
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {c.code}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Task Title with AI Estimation Button */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Tên bài tập / nhiệm vụ</label>
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
              placeholder="ví dụ: Bài tập 5: Cây nhị phân tìm kiếm & AVL"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-slate-900"
            />
          </div>

          {/* Task Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Loại bài</label>
            <div className="grid grid-cols-4 gap-1.5 text-xs">
              {[
                { id: 'assignment', label: 'Bài tập' },
                { id: 'exam_prep', label: 'Ôn thi' },
                { id: 'project', label: 'Dự án' },
                { id: 'reading', label: 'Đọc bài' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTaskType(t.id as TaskType)}
                  className={`py-2 rounded-xl font-bold transition-all text-center ${
                    taskType === t.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 border border-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Deadline Chips */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Hạn nộp</label>
            <div className="grid grid-cols-3 gap-1.5 mb-2">
              <button
                type="button"
                onClick={() => {
                  setDeadlineDate(tomorrow);
                  setDeadlineTime('23:59');
                }}
                className={`py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                  deadlineDate === tomorrow
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                    : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                Tối mai 23:59
              </button>
              <button
                type="button"
                onClick={() => {
                  setDeadlineDate(in2Days);
                  setDeadlineTime('23:59');
                }}
                className={`py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                  deadlineDate === in2Days
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                    : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                2 ngày nữa
              </button>
              <button
                type="button"
                onClick={() => {
                  setDeadlineDate(in5Days);
                  setDeadlineTime('23:59');
                }}
                className={`py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                  deadlineDate === in5Days
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                    : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                Cuối tuần
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={deadlineDate}
                onChange={(e) => setDeadlineDate(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white"
              />
              <input
                type="time"
                value={deadlineTime}
                onChange={(e) => setDeadlineTime(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white"
              />
            </div>
          </div>

          {/* Workload Estimated Minutes Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-700">Ước tính khối lượng học:</span>
              <span className="font-bold text-indigo-600">
                {formatMinutesToDuration(estimatedMinutes)} ({estimatedMinutes} phút)
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="480"
              step="30"
              value={estimatedMinutes}
              onChange={(e) => setEstimatedMinutes(parseInt(e.target.value, 10))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Priority Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Mức độ ưu tiên</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'high', label: '🔥 Rất cao' },
                { id: 'medium', label: '⚡ Vừa phải' },
                { id: 'low', label: '🌱 Thấp' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPriority(p.id as Priority)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                    priority === p.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Subtask Breakdown */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-700">Danh sách công việc con</label>
              <span className="text-[11px] text-slate-400">{subtasks.length} bước</span>
            </div>

            <div className="space-y-1.5">
              {subtasks.map((st) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <span className="text-slate-700 truncate max-w-[85%]">{st.title}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(st.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Thêm bước nhỏ..."
                value={newSubtaskInput}
                onChange={(e) => setNewSubtaskInput(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Thêm
              </button>
            </div>
          </div>

          {/* AI Focus Tip Box */}
          {aiTip && (
            <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-900 flex items-start space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Chiến lược làm bài từ AI:</span>
                <span className="text-indigo-800">{aiTip}</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm và Tự Động Lên Lịch Học</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
