import React, { useState } from 'react';
import { Course, ClassSchedule, StudentPreferences, DayOfWeek, StudyWindow } from '../types';
import { courseColorMap, getCourseColor } from '../utils/courseColors';
import { 
  GraduationCap, 
  BookOpen, 
  Clock, 
  Calendar, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  School,
  Sliders,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { initialCourses, initialClassSchedule, initialPreferences } from '../data/initialData';

interface OnboardingSetupProps {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  classSchedule: ClassSchedule[];
  setClassSchedule: React.Dispatch<React.SetStateAction<ClassSchedule[]>>;
  preferences: StudentPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<StudentPreferences>>;
  onComplete: () => void;
}

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const shortDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const availableColors = ['indigo', 'emerald', 'amber', 'rose', 'sky', 'purple'];

export const OnboardingSetup: React.FC<OnboardingSetupProps> = ({
  courses,
  setCourses,
  classSchedule,
  setClassSchedule,
  preferences,
  setPreferences,
  onComplete,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'courses' | 'classes' | 'capacity'>('courses');
  
  // New Course Form State
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('indigo');
  const [newCredits, setNewCredits] = useState(4);
  const [newProf, setNewProf] = useState('');

  // New Class Schedule Form State
  const [schedCourseId, setSchedCourseId] = useState(courses[0]?.id || '');
  const [schedDay, setSchedDay] = useState<DayOfWeek>(1);
  const [schedStart, setSchedStart] = useState('10:00');
  const [schedEnd, setSchedEnd] = useState('11:30');
  const [schedLocation, setSchedLocation] = useState('');
  const [schedType, setSchedType] = useState<'lecture' | 'lab' | 'discussion' | 'office_hours'>('lecture');

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newName.trim()) return;

    const newCourse: Course = {
      id: `c_${Date.now()}`,
      code: newCode.trim().toUpperCase(),
      name: newName.trim(),
      color: newColor,
      credits: Number(newCredits) || 3,
      professor: newProf.trim() || undefined,
    };

    setCourses([...courses, newCourse]);
    setNewCode('');
    setNewName('');
    setNewProf('');
    if (!schedCourseId) setSchedCourseId(newCourse.id);
  };

  const handleRemoveCourse = (courseId: string) => {
    setCourses(courses.filter((c) => c.id !== courseId));
    setClassSchedule(classSchedule.filter((cs) => cs.courseId !== courseId));
  };

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedCourseId) return;

    const newClass: ClassSchedule = {
      id: `cs_${Date.now()}`,
      courseId: schedCourseId,
      dayOfWeek: schedDay,
      startTime: schedStart,
      endTime: schedEnd,
      location: schedLocation.trim() || undefined,
      type: schedType,
    };

    setClassSchedule([...classSchedule, newClass]);
    setSchedLocation('');
  };

  const handleRemoveClass = (classId: string) => {
    setClassSchedule(classSchedule.filter((cs) => cs.id !== classId));
  };

  const handleResetToSample = () => {
    setCourses(initialCourses);
    setClassSchedule(initialClassSchedule);
    setPreferences(initialPreferences);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md mb-8 border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Setup Academic Foundation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Student Setup & Fixed Schedule
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
            Tell the AI about your enrolled courses, locked class lecture hours, and daily study capacity. The assistant plans your daily tasks in the remaining open gaps.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleResetToSample}
              id="reset-sample-data-btn"
              className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Load Sample CS & Data Science Semester</span>
            </button>
            <button
              type="button"
              onClick={onComplete}
              id="finish-setup-top-btn"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
            >
              <span>Save & View Today's Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6 space-x-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('courses')}
          id="tab-courses-btn"
          className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'courses'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>1. Enrolled Courses ({courses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('classes')}
          id="tab-classes-btn"
          className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'classes'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>2. Fixed Class Schedule ({classSchedule.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('capacity')}
          id="tab-capacity-btn"
          className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'capacity'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>3. Study Windows & Capacity</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          id="tab-profile-btn"
          className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'profile'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <School className="w-4 h-4" />
          <span>4. Student Profile</span>
        </button>
      </div>

      {/* Tab 1: Courses */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Add Course Form */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base mb-4 flex items-center space-x-2">
                <Plus className="w-4 h-4 text-indigo-600" />
                <span>Add New Course</span>
              </h3>
              <form onSubmit={handleAddCourse} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Course Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS 189"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    id="new-course-code-input"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Course Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Intro to Machine Learning"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    id="new-course-name-input"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Credits (Units)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={6}
                      value={newCredits}
                      onChange={(e) => setNewCredits(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Theme Color
                    </label>
                    <select
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none capitalize"
                    >
                      {availableColors.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Instructor / Professor (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Prof. J. Malik"
                    value={newProf}
                    onChange={(e) => setNewProf(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  id="submit-add-course-btn"
                  className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors shadow-xs"
                >
                  Add Course to Semester
                </button>
              </form>
            </div>

            {/* Enrolled Courses List */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  Active Courses ({courses.length})
                </h3>
                <span className="text-xs text-slate-500">
                  Total Credits: {courses.reduce((acc, c) => acc + c.credits, 0)} Units
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {courses.map((course) => {
                  const colors = getCourseColor(course.color);
                  const scheduledClasses = classSchedule.filter((cs) => cs.courseId === course.id);

                  return (
                    <div
                      key={course.id}
                      className={`p-4 rounded-xl border ${colors.border} ${colors.bg} flex flex-col justify-between transition-all`}
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${colors.badgeBg} ${colors.badgeText}`}>
                            {course.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveCourse(course.id)}
                            className="text-slate-400 hover:text-red-600 transition-colors p-1"
                            title="Remove course"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mt-2">
                          {course.name}
                        </h4>
                        {course.professor && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {course.professor}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                        <span>{course.credits} Credits</span>
                        <span>{scheduledClasses.length} locked class times</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab('classes')}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  <span>Continue to Class Schedule</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab 2: Fixed Class Schedule */}
      {activeTab === 'classes' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Add Class Time Form */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base mb-4 flex items-center space-x-2">
                <Plus className="w-4 h-4 text-indigo-600" />
                <span>Add Locked Class Block</span>
              </h3>
              <form onSubmit={handleAddClass} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Course *
                  </label>
                  <select
                    value={schedCourseId}
                    onChange={(e) => setSchedCourseId(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Day of Week *
                  </label>
                  <select
                    value={schedDay}
                    onChange={(e) => setSchedDay(Number(e.target.value) as DayOfWeek)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value={1}>Monday</option>
                    <option value={2}>Tuesday</option>
                    <option value={3}>Wednesday</option>
                    <option value={4}>Thursday</option>
                    <option value={5}>Friday</option>
                    <option value={6}>Saturday</option>
                    <option value={0}>Sunday</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={schedStart}
                      onChange={(e) => setSchedStart(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={schedEnd}
                      onChange={(e) => setSchedEnd(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Session Type
                    </label>
                    <select
                      value={schedType}
                      onChange={(e) => setSchedType(e.target.value as any)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none capitalize"
                    >
                      <option value="lecture">Lecture</option>
                      <option value="discussion">Discussion / Section</option>
                      <option value="lab">Lab</option>
                      <option value="office_hours">Office Hours</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Room / Hall
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Wheeler 102"
                      value={schedLocation}
                      onChange={(e) => setSchedLocation(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  id="submit-add-class-btn"
                  className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors shadow-xs"
                >
                  Add Class to Schedule
                </button>
              </form>
            </div>

            {/* Weekly Schedule Overview */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                Weekly Fixed Commitments ({classSchedule.length})
              </h3>

              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((d) => {
                  const dayClasses = classSchedule.filter((cs) => cs.dayOfWeek === d);
                  return (
                    <div
                      key={d}
                      className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3.5"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                          {dayNames[d]}
                        </span>
                        <span className="text-xs text-slate-400">
                          {dayClasses.length} {dayClasses.length === 1 ? 'class' : 'classes'}
                        </span>
                      </div>

                      {dayClasses.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No scheduled fixed classes</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {dayClasses.map((item) => {
                            const course = courses.find((c) => c.id === item.courseId);
                            const colors = getCourseColor(course?.color);

                            return (
                              <div
                                key={item.id}
                                className={`px-3 py-2 rounded-lg border ${colors.border} ${colors.bg} flex items-center justify-between text-xs`}
                              >
                                <div>
                                  <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center space-x-1.5">
                                    <span>{course?.code}</span>
                                    <span className="capitalize text-[10px] opacity-75 font-normal">({item.type})</span>
                                  </div>
                                  <div className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">
                                    {item.startTime} - {item.endTime} {item.location ? `• ${item.location}` : ''}
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveClass(item.id)}
                                  className="text-slate-400 hover:text-red-600 p-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab('capacity')}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  <span>Configure Study Capacity</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab 3: Study Windows & Capacity */}
      {activeTab === 'capacity' && (
        <div className="space-y-6 max-w-3xl">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
                Daily Study Capacity & Pacing
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                The AI will distribute your assignment workloads to never exceed your daily cognitive capacity.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Max Daily Study Target
                  </label>
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                    {preferences.maxDailyStudyHours} Hours / Day
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={8}
                  step={0.5}
                  value={preferences.maxDailyStudyHours}
                  onChange={(e) =>
                    setPreferences({ ...preferences, maxDailyStudyHours: Number(e.target.value) })
                  }
                  className="w-full accent-indigo-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>2 hours (Light)</span>
                  <span>5.5 hours (Balanced)</span>
                  <span>8 hours (Intense)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Preferred Session Length
                  </label>
                  <select
                    value={preferences.preferredSessionLength}
                    onChange={(e) =>
                      setPreferences({ ...preferences, preferredSessionLength: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value={45}>45 Minutes (Pomodoro)</option>
                    <option value={60}>60 Minutes (Standard)</option>
                    <option value={90}>90 Minutes (Deep Work)</option>
                    <option value={120}>120 Minutes (Extended)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Peak Focus Window
                  </label>
                  <select
                    value={preferences.peakFocusTime}
                    onChange={(e) =>
                      setPreferences({ ...preferences, peakFocusTime: e.target.value as any })
                    }
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none capitalize"
                  >
                    <option value="morning">Morning (8:30 AM - 12:00 PM)</option>
                    <option value="afternoon">Afternoon (1:30 PM - 5:30 PM)</option>
                    <option value="evening">Evening (7:00 PM - 10:30 PM)</option>
                  </select>
                </div>
              </div>

              {/* Active Study Windows */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 mb-3">
                  Configured Study Windows
                </h4>
                <div className="space-y-2">
                  {preferences.studyWindows.map((sw) => (
                    <div
                      key={sw.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                    >
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-indigo-600" />
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-slate-100">{sw.label}</span>
                          <span className="text-slate-500 ml-2">
                            ({sw.start} - {sw.end})
                          </span>
                        </div>
                      </div>
                      <span className="text-slate-500">
                        {sw.days.map((d) => shortDayNames[d]).join(', ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={onComplete}
                id="finish-setup-btn"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-xs"
              >
                <span>Save All & Open AI Plan</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Tab 4: Student Profile */}
      {activeTab === 'profile' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs max-w-2xl space-y-4">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base mb-4">
            Student Profile Details
          </h3>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={preferences.name}
              onChange={(e) => setPreferences({ ...preferences, name: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Major / Academic Program
            </label>
            <input
              type="text"
              value={preferences.major}
              onChange={(e) => setPreferences({ ...preferences, major: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              University / College
            </label>
            <input
              type="text"
              value={preferences.university}
              onChange={(e) => setPreferences({ ...preferences, university: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={onComplete}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-xs"
            >
              <span>Save & Go to Dashboard</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
