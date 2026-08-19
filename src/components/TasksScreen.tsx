import React, { useState } from 'react';
import { Course, Task, StudentPreferences } from '../types';
import { 
  getTodayString, 
  getRelativeDateString, 
  getDeadlineUrgency, 
  formatMinutesToDuration 
} from '../utils/dateUtils';
import { getCourseColor } from '../utils/courseColors';
import { EditTaskModal } from './EditTaskModal';
import { 
  CheckSquare, 
  Plus, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Flame, 
  Layers,
  ChevronDown,
  ChevronUp,
  Sliders,
  Pencil,
  Trash2,
  AlertTriangle,
  X
} from 'lucide-react';

interface TasksScreenProps {
  courses: Course[];
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  preferences: StudentPreferences;
  onOpenAddTask: () => void;
  onEditTask: (updatedTask: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TasksScreen: React.FC<TasksScreenProps> = ({
  courses,
  tasks,
  setTasks,
  preferences,
  onOpenAddTask,
  onEditTask,
  onDeleteTask,
}) => {
  const today = getTodayString();
  const in3Days = getRelativeDateString(3);
  const in7Days = getRelativeDateString(7);

  const [activeFilter, setActiveFilter] = useState<'today' | 'urgent' | 'week' | 'completed'>('today');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  // Modal states
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (activeFilter === 'completed') {
      return t.status === 'completed';
    }
    if (t.status === 'completed') return false;

    if (activeFilter === 'today') {
      return t.deadline.startsWith(today) || t.priority === 'high' || t.completedMinutes > 0;
    }
    if (activeFilter === 'urgent') {
      return t.deadline <= `${in3Days}T23:59`;
    }
    if (activeFilter === 'week') {
      return t.deadline <= `${in7Days}T23:59`;
    }
    return true;
  });

  // Toggle Subtask
  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId && t.subtasks) {
          const newSubtasks = t.subtasks.map((st) =>
            st.id === subtaskId
              ? { ...st, completed: !st.completed }
              : st
          );

          const allDone = newSubtasks.every((st) => st.completed);
          const completedCount = newSubtasks.filter((st) => st.completed).length;

          return {
            ...t,
            subtasks: newSubtasks,
            status: allDone
              ? 'completed'
              : completedCount > 0
              ? 'in_progress'
              : 'not_started',
          };
        }

        return t;
      })
    );
  };

  // Toggle Task Completion
  const handleToggleTaskComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;

        const isDone = t.status === 'completed';

        return {
          ...t,
          status: isDone ? 'not_started' : 'completed',
          completedMinutes: isDone ? 0 : t.estimatedMinutes,
          subtasks: t.subtasks?.map((st) => ({
            ...st,
            completed: !isDone,
          })),
        };
      })
    );
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      onDeleteTask(taskToDelete.id);
      setTaskToDelete(null);
    }
  };

  return (
    <div className="max-w-md sm:max-w-lg mx-auto px-4 py-5 space-y-5 pb-24">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <CheckSquare className="w-5 h-5 text-indigo-600" />
            <span>Nhiệm vụ & Bài tập</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {tasks.filter((t) => t.status !== 'completed').length} nhiệm vụ đang cần hoàn thành
          </p>
        </div>

        <button
          onClick={onOpenAddTask}
          id="tasks-add-task-btn"
          className="flex items-center space-x-1 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Thêm bài</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-slate-100/80 text-xs">
        {[
          { id: 'today', label: 'Hôm nay' },
          { id: 'urgent', label: 'Sắp đến hạn' },
          { id: 'week', label: 'Tuần này' },
          { id: 'completed', label: 'Đã xong' },
        ].map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`py-2 rounded-xl font-bold text-center transition-all ${
                isActive
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => {
          const course = courses.find((c) => c.id === task.courseId);
          const colors = getCourseColor(course?.color);
          const urgency = getDeadlineUrgency(task.deadline);
          const progress = Math.min(100, Math.round((task.completedMinutes / task.estimatedMinutes) * 100));
          const isExpanded = expandedTaskId === task.id;
          const isCompleted = task.status === 'completed';

          return (
            <div
              key={task.id}
              className={`p-4 rounded-3xl bg-white border transition-all ${
                isCompleted
                  ? 'border-emerald-200 bg-emerald-50/20 opacity-80'
                  : 'border-slate-100 shadow-xs hover:border-slate-200'
              }`}
            >
              <div className="space-y-3">
                
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start space-x-2.5 flex-1 min-w-0">
                    {/* Checkmark Button */}
                    <button
                      onClick={() => handleToggleTaskComplete(task.id)}
                      className={`w-5 h-5 rounded-lg border mt-0.5 flex items-center justify-center transition-colors shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 hover:border-indigo-500'
                      }`}
                    >
                      {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1.5 mb-0.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${colors.badgeBg} ${colors.badgeText}`}>
                          {course?.code}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {task.type === 'exam_prep'
                            ? 'Ôn thi'
                            : task.type === 'project'
                            ? 'Dự án'
                            : task.type === 'reading'
                            ? 'Đọc tài liệu'
                            : 'Bài tập'}
                        </span>
                      </div>

                      <h3 className={`font-bold text-sm text-slate-900 leading-snug break-words ${isCompleted ? 'line-through text-slate-400' : ''}`}>
                        {task.title}
                      </h3>
                    </div>
                  </div>

                  {/* Actions & Urgency Pill */}
                  <div className="flex items-center space-x-1 shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${urgency.badgeClass}`}>
                      {urgency.label}
                    </span>

                    {/* Edit Button */}
                    <button
                      onClick={() => setEditingTask(task)}
                      title="Chỉnh sửa bài tập"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => setTaskToDelete(task)}
                      title="Xoá bài tập"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar & Workload */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>
                      Tiến độ: <strong className="text-slate-800">{formatMinutesToDuration(task.completedMinutes)}</strong> / {formatMinutesToDuration(task.estimatedMinutes)}
                    </span>
                    <span className="font-bold text-indigo-600">{progress}%</span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isCompleted ? 'bg-emerald-600' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Subtask Checklist Trigger / Accordion */}
                {task.subtasks && task.subtasks.length > 0 && (
                  <div className="pt-1 border-t border-slate-50">
                    <button
                      onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                      className="w-full flex items-center justify-between text-xs text-slate-500 hover:text-slate-800 py-1"
                    >
                      <span className="font-medium text-[11px]">
                        Danh sách công việc con ({task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length})
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="mt-2 space-y-1.5 bg-slate-50 p-2.5 rounded-2xl">
                        {task.subtasks.map((st) => (
                          <label
                            key={st.id}
                            className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer hover:text-slate-900"
                          >
                            <input
                              type="checkbox"
                              checked={st.completed}
                              onChange={() => handleToggleSubtask(task.id, st.id)}
                              className="rounded text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className={st.completed ? 'line-through text-slate-400' : ''}>
                              {st.title}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-100 text-slate-400 text-xs space-y-2">
            <CheckSquare className="w-8 h-8 mx-auto text-slate-300" />
            <p>Không có nhiệm vụ nào trong mục này.</p>
          </div>
        )}
      </div>

      {/* Edit Task Modal */}
      <EditTaskModal
        isOpen={Boolean(editingTask)}
        onClose={() => setEditingTask(null)}
        task={editingTask}
        courses={courses}
        preferences={preferences}
        onSaveTask={onEditTask}
      />

      {/* Delete Confirmation Dialog */}
      {taskToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Xác nhận xoá nhiệm vụ?
                </h3>
                <p className="text-[11px] text-slate-500">
                  Hành động này không thể hoàn tác
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl leading-relaxed">
              Bạn có chắc muốn xoá bài tập <strong className="text-slate-900">"{taskToDelete.title}"</strong>? 
              Tất cả các phiên học đã lên lịch cho bài tập này trên lịch học cũng sẽ được dọn dẹp.
            </p>

            <div className="flex items-center justify-end space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setTaskToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-xs transition-colors"
              >
                Xoá nhiệm vụ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
