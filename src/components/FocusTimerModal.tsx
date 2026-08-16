import React, { useState, useEffect } from 'react';
import { StudySession, Task, Course } from '../types';
import { getCourseColor } from '../utils/courseColors';
import { formatMinutesToDuration } from '../utils/dateUtils';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  Target,
  RefreshCw,
  Flame
} from 'lucide-react';

interface FocusTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: StudySession | null;
  task: Task | null;
  course: Course | null;
  onCompleteSession: (sessionId: string) => void;
  onMissSession: (sessionId: string) => void;
}

export const FocusTimerModal: React.FC<FocusTimerModalProps> = ({
  isOpen,
  onClose,
  session,
  task,
  course,
  onCompleteSession,
  onMissSession,
}) => {
  if (!isOpen || !session || !task) return null;

  const colors = getCourseColor(course?.color);
  const totalSeconds = session.durationMinutes * 60;
  const [secondsRemaining, setSecondsRemaining] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setSecondsRemaining(session.durationMinutes * 60);
    setIsRunning(false);
  }, [session]);

  useEffect(() => {
    let interval: any;
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isRunning) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsRemaining]);

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const progressPercent = ((totalSeconds - secondsRemaining) / totalSeconds) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${colors.badgeBg} ${colors.badgeText}`}>
              {course?.code}
            </span>
            <span className="text-xs font-bold text-slate-700">
              Chế độ tập trung sâu
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-5">
          <div className="space-y-1">
            <h2 className="text-base font-extrabold text-slate-900 leading-snug">
              {task.title}
            </h2>
            <p className="text-xs text-slate-500 flex items-center justify-center space-x-1">
              <Target className="w-3.5 h-3.5 text-indigo-600" />
              <span>{session.goal}</span>
            </p>
          </div>

          {/* Circular Countdown Display */}
          <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                className="text-slate-100 stroke-current"
                strokeWidth="7"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                className="text-indigo-600 stroke-current transition-all duration-300"
                strokeWidth="7"
                strokeDasharray={276.46}
                strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {formattedTime}
              </span>
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                {isRunning ? 'Đang tập trung' : 'Tạm dừng'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={() => {
                setSecondsRemaining(session.durationMinutes * 60);
                setIsRunning(false);
              }}
              title="Đặt lại thời gian"
              className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsRunning(!isRunning)}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-sm shadow-md flex items-center space-x-2 transition-all"
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Tạm dừng</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Bắt đầu học</span>
                </>
              )}
            </button>
          </div>

          {/* Complete / Missed Session Actions */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onCompleteSession(session.id);
                onClose();
              }}
              className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Đã hoàn thành</span>
            </button>

            <button
              onClick={() => {
                onMissSession(session.id);
                onClose();
              }}
              className="py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-amber-600" />
              <span>Bỏ lỡ (Nhờ AI xếp lại)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
