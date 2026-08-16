import React, { useState } from 'react';
import { Course, Task } from '../types';
import { 
  getTodayString, 
  getRelativeDateString, 
  getDeadlineUrgency, 
  formatMinutesToDuration 
} from '../utils/dateUtils';
import { getCourseColor } from '../utils/courseColors';
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
  Sliders
} from 'lucide-react';

interface TasksScreenProps {
  courses: Course[];
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onOpenAddTask: () => void;
}

export const TasksScreen: React.FC<TasksScreenProps> = ({
  courses,
  tasks,
  setTasks,
  onOpenAddTask,
}) => {
  const today = getTodayString();
  const in3Days = getRelativeDateString(3);
  const in7Days = getRelativeDateString(7);

  const [activeFilter, setActiveFilter] = useState<'today' | 'urgent' | 'week' | 'completed'>('today');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

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
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          const allDone = newSubtasks.every((st) => st.completed);
          return {
            ...t,
            subtasks: newSubtasks,
            status: allDone ? 'completed' : t.status,
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
        if (t.id === taskId) {
          const isDone = t.status === 'completed';
          return {
            ...t,
            status: isDone ? 'in_progress' : 'completed',
            completedMinutes: isDone ? 0 : t.estimatedMinutes,
            subtasks: t.subtasks?.map((st) => ({ ...st, completed: !isDone })),
          };
        }
        return t;
      })
    );
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
                  <div className="flex items-start space-x-2.5">
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

                    <div>
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

                      <h3 className={`font-bold text-sm text-slate-900 leading-snug ${isCompleted ? 'line-through text-slate-400' : ''}`}>
                        {task.title}
                      </h3>
                    </div>
                  </div>

                  {/* Urgency Pill */}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${urgency.badgeClass}`}>
                    {urgency.label}
                  </span>
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

    </div>
  );
};
