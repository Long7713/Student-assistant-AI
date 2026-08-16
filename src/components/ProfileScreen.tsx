import React, { useState } from 'react';
import { Course, ClassSchedule, StudentPreferences, DayOfWeek } from '../types';
import { getCourseColor } from '../utils/courseColors';
import { 
  User, 
  BookOpen, 
  Lock, 
  Sliders, 
  Plus, 
  RotateCcw, 
  GraduationCap, 
  Clock, 
  CheckCircle2,
  Trash2
} from 'lucide-react';

interface ProfileScreenProps {
  preferences: StudentPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<StudentPreferences>>;
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  classSchedule: ClassSchedule[];
  setClassSchedule: React.Dispatch<React.SetStateAction<ClassSchedule[]>>;
  onResetSampleData: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  preferences,
  setPreferences,
  courses,
  setCourses,
  classSchedule,
  setClassSchedule,
  onResetSampleData,
}) => {
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseColor, setNewCourseColor] = useState('indigo');

  const [maxHours, setMaxHours] = useState(preferences.maxDailyStudyHours || 5.5);
  const [sessionLen, setSessionLen] = useState(preferences.preferredSessionLength || 90);

  const handleSavePreferences = () => {
    setPreferences((prev) => ({
      ...prev,
      maxDailyStudyHours: maxHours,
      preferredSessionLength: sessionLen,
    }));
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseCode.trim() || !newCourseName.trim()) return;

    const newC: Course = {
      id: `c_${Date.now()}`,
      code: newCourseCode.trim(),
      name: newCourseName.trim(),
      color: newCourseColor,
      credits: 3,
    };

    setCourses((prev) => [...prev, newC]);
    setNewCourseCode('');
    setNewCourseName('');
    setShowAddCourse(false);
  };

  const dayNames = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

  return (
    <div className="max-w-md sm:max-w-lg mx-auto px-4 py-5 space-y-6 pb-24">
      
      {/* 1. Header & Student Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center text-xl font-bold shadow-sm">
            {preferences.name ? preferences.name.charAt(0) : 'M'}
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900 leading-tight">
              {preferences.name || 'Minh Khoa'}
            </h1>
            <p className="text-xs text-indigo-600 font-semibold flex items-center space-x-1 mt-0.5">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{preferences.university || 'Đại học Bách Khoa'}</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {preferences.major || 'Khoa học Máy tính & Dữ liệu'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Study Habits & Capacity Settings */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <span>Thói quen học tập & Giới hạn</span>
          </h2>
          <span className="text-[11px] text-emerald-600 font-semibold">Tự động áp dụng</span>
        </div>

        <div className="space-y-4">
          {/* Max daily hours */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700">Giới hạn học tối đa mỗi ngày:</span>
              <span className="font-bold text-indigo-600">{maxHours} giờ/ngày</span>
            </div>
            <input
              type="range"
              min="2"
              max="8"
              step="0.5"
              value={maxHours}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setMaxHours(val);
                setPreferences((prev) => ({ ...prev, maxDailyStudyHours: val }));
              }}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">AI sẽ không bao giờ lên lịch quá số giờ này để tránh quá tải.</p>
          </div>

          {/* Preferred session length */}
          <div className="space-y-1.5 pt-2 border-t border-slate-50">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700">Thời lượng mỗi phiên học:</span>
              <span className="font-bold text-indigo-600">{sessionLen} phút</span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[45, 60, 90].map((mins) => (
                <button
                  key={mins}
                  onClick={() => {
                    setSessionLen(mins);
                    setPreferences((prev) => ({ ...prev, preferredSessionLength: mins }));
                  }}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    sessionLen === mins
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-700 border border-slate-200'
                  }`}
                >
                  {mins} phút
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Enrolled Courses */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Môn học đang đăng ký ({courses.length})</span>
          </h2>

          <button
            onClick={() => setShowAddCourse(!showAddCourse)}
            className="text-xs font-bold text-indigo-600 hover:underline flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm môn</span>
          </button>
        </div>

        {/* Add Course Form */}
        {showAddCourse && (
          <form onSubmit={handleAddCourse} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
            <input
              type="text"
              placeholder="Mã môn (ví dụ: CS 189)"
              value={newCourseCode}
              onChange={(e) => setNewCourseCode(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              required
            />
            <input
              type="text"
              placeholder="Tên môn học (ví dụ: Học máy)"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              required
            />
            <div className="flex items-center space-x-2">
              {['indigo', 'emerald', 'amber', 'rose', 'sky', 'purple'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setNewCourseColor(c)}
                  className={`w-6 h-6 rounded-full border-2 ${
                    newCourseColor === c ? 'border-slate-900 scale-110' : 'border-transparent'
                  }`}
                  style={{
                    backgroundColor:
                      c === 'indigo'
                        ? '#4F46E5'
                        : c === 'emerald'
                        ? '#10B981'
                        : c === 'amber'
                        ? '#F59E0B'
                        : c === 'rose'
                        ? '#F43F5E'
                        : c === 'sky'
                        ? '#0EA5E9'
                        : '#A855F7',
                  }}
                />
              ))}
            </div>
            <div className="flex justify-end space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddCourse(false)}
                className="px-3 py-1.5 rounded-xl text-slate-500 font-semibold"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold"
              >
                Lưu môn học
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {courses.map((course) => {
            const colors = getCourseColor(course.color);
            return (
              <div
                key={course.id}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-2.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${colors.badgeBg} ${colors.badgeText}`}>
                    {course.code}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 block">{course.name}</span>
                    {course.professor && (
                      <span className="text-[11px] text-slate-400">{course.professor}</span>
                    )}
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-slate-500">{course.credits} tín chỉ</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Fixed Class Timetable */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 space-y-3">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
          <Lock className="w-4 h-4 text-indigo-600" />
          <span>Thời khóa biểu cố định ({classSchedule.length} tiết)</span>
        </h2>
        <p className="text-xs text-slate-500">
          AI sẽ tự động khóa các khung giờ này và lên lịch học bao quanh chúng.
        </p>

        <div className="space-y-2">
          {classSchedule.slice(0, 4).map((cs) => {
            const course = courses.find((c) => c.id === cs.courseId);
            const colors = getCourseColor(course?.color);

            return (
              <div
                key={cs.id}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-700 w-14">
                    {dayNames[cs.dayOfWeek]}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${colors.badgeBg} ${colors.badgeText}`}>
                    {course?.code}
                  </span>
                  <span className="text-slate-500 truncate max-w-[120px]">
                    {cs.location || cs.type}
                  </span>
                </div>
                <span className="font-semibold text-slate-700 text-[11px]">
                  {cs.startTime} - {cs.endTime}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Reset Sample Data */}
      <div className="pt-2">
        <button
          onClick={onResetSampleData}
          id="profile-reset-sample-btn"
          className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center space-x-2 transition-colors active:scale-98"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
          <span>Đặt lại dữ liệu mẫu sinh viên CNTT</span>
        </button>
      </div>

    </div>
  );
};
