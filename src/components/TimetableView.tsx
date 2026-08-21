import { useState } from "react";
import { 
  Sparkles, 
  Calendar as CalendarIcon, 
  Plus, 
  RefreshCw, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  AlertCircle,
  ChevronDown,
  Layers,
  CalendarCheck,
  Share2,
  Filter
} from "lucide-react";
import { Course, SchedulePlan } from "../types";
import { PERIOD_TIMES, DAYS_OF_WEEK } from "../mockData";

interface TimetableViewProps {
  courses: Course[];
  plans: SchedulePlan[];
  activePlanId: string;
  onSelectPlan: (planId: string) => void;
  onOpenAiOptimizer: () => void;
  onAddCourse: () => void;
  onUpdateCourseClass: (courseCode: string, newClassCode: string) => void;
}

export const TimetableView = ({
  courses,
  plans,
  activePlanId,
  onSelectPlan,
  onOpenAiOptimizer,
  onAddCourse,
  onUpdateCourseClass,
}: TimetableViewProps) => {
  const [isCalendarSynced, setIsCalendarSynced] = useState<boolean>(true);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [syncSuccessToast, setSyncSuccessToast] = useState<string | null>(null);
  const [selectedCourseDetail, setSelectedCourseDetail] = useState<Course | null>(null);

  const handleToggleGoogleCalendarSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setIsCalendarSynced(!isCalendarSynced);
      setSyncSuccessToast(
        !isCalendarSynced
          ? "Đã đồng bộ 2 chiều thời khóa biểu & deadline lên Google Calendar của bạn!"
          : "Đã tạm dừng đồng bộ Google Calendar."
      );
      setTimeout(() => setSyncSuccessToast(null), 3500);
    }, 800);
  };

  // Find course for a given day and period
  const getCourseForSlot = (day: number, period: number) => {
    return courses.find(
      (c) => c.day === day && period >= c.startPeriod && period <= c.endPeriod
    );
  };

  // Get color styles for course blocks - Clean minimalist styling
  const getColorClasses = (color: string) => {
    switch (color) {
      case "emerald":
        return "bg-emerald-50 text-emerald-950 hover:bg-emerald-100/80 border-emerald-200";
      case "teal":
        return "bg-teal-50 text-teal-950 hover:bg-teal-100/80 border-teal-200";
      case "purple":
        return "bg-purple-50 text-purple-950 hover:bg-purple-100/80 border-purple-200";
      case "rose":
        return "bg-rose-50 text-rose-950 hover:bg-rose-100/80 border-rose-200";
      case "blue":
        return "bg-blue-50 text-blue-950 hover:bg-blue-100/80 border-blue-200";
      case "amber":
        return "bg-amber-50 text-amber-950 hover:bg-amber-100/80 border-amber-200";
      default:
        return "bg-slate-100 text-slate-900 hover:bg-slate-200 border-slate-200";
    }
  };

  // Unique list of main course subjects for bottom details section
  const uniqueCourses = [
    {
      id: "MTH101",
      code: "MTH101",
      name: "Giải tích 1 (Calculus 1)",
      lecturer: "PGS. TS. Trần Đình Hưng",
      campus: "CS1 (Q.10)",
      colorDot: "bg-blue-500",
      currentClass: "L01 (Sáng T2 & T4 - CS1)",
      options: [
        "L01 (Sáng T2 & T4 - CS1)",
        "L02 (Chiều T3 & T5 - CS2)",
        "L03 (Sáng T6 & T7 - CS1)"
      ]
    },
    {
      id: "CSE102",
      code: "CSE102",
      name: "Cấu trúc Dữ liệu & Giải thuật",
      lecturer: "TS. Phan Thanh Sơn",
      campus: "CS1 (Q.10)",
      colorDot: "bg-emerald-500",
      currentClass: "L01 (Sáng T2 & Chiều T4 - CS1)",
      options: [
        "L01 (Sáng T2 & Chiều T4 - CS1)",
        "L02 (Sáng T3 & Sáng T5 - CS1)",
        "L03 (Chiều T2 & T6 - CS2)"
      ]
    },
    {
      id: "POL101",
      code: "POL101",
      name: "Triết học Mác - Lênin",
      lecturer: "TS. Nguyễn Văn Hậu",
      campus: "CS1 (Q.10)",
      colorDot: "bg-rose-500",
      currentClass: "L01 (Sáng T4 - CS1)",
      options: [
        "L01 (Sáng T4 - CS1)",
        "L02 (Chiều T5 - CS1)",
        "L03 (Sáng T7 - Online Meet)"
      ]
    },
    {
      id: "ENG201",
      code: "ENG201",
      name: "Tiếng Anh Học thuật (Academic English B2)",
      lecturer: "Cô Emily Watson / ThS. Lê Bảo Trâm",
      campus: "CS1 (Q.10)",
      colorDot: "bg-purple-500",
      currentClass: "L01 (Sáng T3 & Sáng T6 - CS1)",
      options: [
        "L01 (Sáng T3 & Sáng T6 - CS1)",
        "L02 (Chiều T2 & T4 - CS1)",
        "L03 (Tối T3 & T5 - Online)"
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Action Bar & Plan Switcher */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-2xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Left: Plan selector & Active status */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {plans.map((p) => (
              <button
                key={p.id}
                id={`btn-plan-${p.id}`}
                onClick={() => onSelectPlan(p.id)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  activePlanId === p.id
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            0 Trùng lịch • Tiết kiệm 4.5h di chuyển
          </span>
        </div>

        {/* Right: AI Optimizer & Google Calendar Sync Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto">
          {/* Gemini AI Optimizer Button */}
          <button
            id="btn-ai-schedule-optimizer"
            onClick={onOpenAiOptimizer}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold px-4 py-2.5 rounded-lg shadow-2xs transition-all cursor-pointer group"
          >
            <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
            <span>AI Xếp Lịch & Tránh Trùng</span>
          </button>

          {/* Google Calendar 2-Way Sync Toggle */}
          <button
            id="btn-google-calendar-sync"
            onClick={handleToggleGoogleCalendarSync}
            disabled={syncing}
            className={`flex items-center justify-center gap-2 text-xs font-semibold px-3.5 py-2.5 rounded-lg border transition-all ${
              isCalendarSynced
                ? "bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100/70"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
            title="Đồng bộ 2 chiều với Google Calendar"
          >
            <CalendarCheck className={`w-4 h-4 ${syncing ? "animate-spin text-blue-600" : isCalendarSynced ? "text-blue-600" : "text-slate-400"}`} />
            <span className="hidden sm:inline">
              {isCalendarSynced ? "Đã Sync Google Calendar" : "Đồng bộ Google Calendar"}
            </span>
          </button>

          {/* Add custom course */}
          <button
            id="btn-add-new-course"
            onClick={onAddCourse}
            className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3 py-2.5 rounded-lg transition-all"
            title="Thêm lớp học hoặc buổi học bù"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Thêm lớp</span>
          </button>
        </div>
      </div>

      {/* Sync Toast Notification */}
      {syncSuccessToast && (
        <div className="bg-slate-900 text-white px-4 py-2.5 rounded-lg text-xs font-medium flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-emerald-400" />
            <span>{syncSuccessToast}</span>
          </div>
          <span className="text-[11px] text-slate-400">Google Calendar API v3</span>
        </div>
      )}

      {/* Main Timetable Visual Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[960px]">
            {/* Header: Days of the week */}
            <div className="grid grid-cols-[100px_repeat(7,1fr)] bg-slate-50 border-b border-slate-200 text-center text-xs font-semibold text-slate-700 py-3">
              <div className="text-slate-400 font-semibold uppercase text-[11px] flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Tiết / Giờ</span>
              </div>
              {DAYS_OF_WEEK.map((d) => (
                <div 
                  key={d.day}
                  className={`py-0.5 flex flex-col items-center justify-center ${
                    d.isToday ? "text-slate-900 font-bold" : ""
                  }`}
                >
                  <span className="font-semibold">{d.label}</span>
                  {d.isToday && (
                    <span className="text-[10px] bg-slate-200 text-slate-800 font-semibold px-1.5 rounded-sm mt-0.5">
                      Hôm nay
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Grid Rows: Period 1 to 12 */}
            <div className="divide-y divide-slate-100">
              {PERIOD_TIMES.map((periodObj) => {
                const p = periodObj.period;
                return (
                  <div key={p} className="grid grid-cols-[100px_repeat(7,1fr)] min-h-[52px]">
                    {/* Period Label & Time */}
                    <div className="p-2 border-r border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center text-center">
                      <span className="text-xs font-semibold text-slate-800">{periodObj.label}</span>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5">{periodObj.time}</span>
                    </div>

                    {/* 7 Day slots */}
                    {DAYS_OF_WEEK.map((dayObj) => {
                      const course = getCourseForSlot(dayObj.day, p);
                      const isFirstPeriod = course && course.startPeriod === p;
                      const span = course ? course.endPeriod - course.startPeriod + 1 : 1;

                      if (course && !isFirstPeriod) {
                        // Slot is covered by course starting in previous period
                        return null;
                      }

                      if (course && isFirstPeriod) {
                        return (
                          <div
                            key={dayObj.day}
                            id={`slot-${dayObj.day}-${p}`}
                            style={{ gridRow: `span ${span}` }}
                            onClick={() => setSelectedCourseDetail(course)}
                            className={`m-1 p-2 rounded-lg transition-all cursor-pointer shadow-2xs border flex flex-col justify-between ${getColorClasses(
                              course.color
                            )}`}
                          >
                            <div>
                              <div className="text-[11px] font-bold line-clamp-1 flex items-center justify-between gap-1">
                                <span>{course.name}</span>
                                <span className="text-[9px] font-semibold opacity-90 shrink-0 bg-white/80 border border-slate-200/60 px-1 py-0.2 rounded">
                                  {course.room}
                                </span>
                              </div>

                              {/* Lab & Lecturer detail for large blocks */}
                              {span > 1 && (
                                <div className="text-[10px] opacity-80 mt-1 line-clamp-1 flex items-center gap-1 font-mono">
                                  <span>{course.classCode}</span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-between text-[10px] opacity-80 mt-1">
                              <span className="flex items-center gap-0.5">
                                <MapPin className="w-3 h-3 shrink-0" />
                                {course.campus}
                              </span>
                              <span className="font-semibold">{course.credits} TC</span>
                            </div>
                          </div>
                        );
                      }

                      // Empty timetable slot
                      return (
                        <div
                          key={dayObj.day}
                          id={`empty-slot-${dayObj.day}-${p}`}
                          onClick={() => {
                            alert(`Đặt lịch tự học / ghi chú cho Thứ ${dayObj.day}, ${periodObj.label}`);
                          }}
                          className="border-r border-slate-100 last:border-r-0 hover:bg-slate-50 transition-colors cursor-pointer group flex items-center justify-center"
                        >
                          <span className="opacity-0 group-hover:opacity-100 text-[10px] text-slate-400 font-medium transition-opacity">
                            + Thêm
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: CHI TIẾT CÁC LỚP HỌC PHẦN ĐÃ CHỌN TRONG PHƯƠNG ÁN */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wider uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-900"></span>
            CHI TIẾT CÁC LỚP HỌC PHẦN ĐÃ CHỌN TRONG PHƯƠNG ÁN
          </h2>
          <span className="text-xs text-slate-500 font-medium">Tổng số: 4 Môn (13 Tín chỉ)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {uniqueCourses.map((c) => (
            <div
              key={c.id}
              id={`course-card-${c.code}`}
              className="bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl p-4 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header: Dot + Name + Code Badge */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${c.colorDot}`}></span>
                    <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{c.name}</h3>
                  </div>
                  <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0">
                    {c.code}
                  </span>
                </div>

                {/* Lecturer & Campus */}
                <p className="text-xs text-slate-500 mb-2">GV: {c.lecturer}</p>
                <div className="mb-3">
                  <span className="bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded inline-block">
                    {c.campus}
                  </span>
                </div>
              </div>

              {/* Class switcher dropdown */}
              <div className="pt-2 border-t border-slate-200/70">
                <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                  Đổi ca học:
                </label>
                <div className="relative">
                  <select
                    value={c.currentClass}
                    onChange={(e) => onUpdateCourseClass(c.code, e.target.value)}
                    className="w-full bg-white border border-slate-300 text-slate-800 text-xs font-medium rounded-lg px-2.5 py-1.5 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer shadow-2xs"
                  >
                    {c.options.map((opt, i) => (
                      <option key={i} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Course Modal / Quick View */}
      {selectedCourseDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-lg border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                  Chi tiết lớp học phần
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1.5">
                  {selectedCourseDetail.name}
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedCourseDetail.code} • {selectedCourseDetail.classCode}</p>
              </div>
              <button
                onClick={() => setSelectedCourseDetail(null)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold text-xs transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Giảng viên:</span>
                <span className="font-semibold text-slate-900">{selectedCourseDetail.lecturer}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Phòng học & Cơ sở:</span>
                <span className="font-semibold text-slate-900">
                  Phòng {selectedCourseDetail.room} ({selectedCourseDetail.campus})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Thời gian học:</span>
                <span className="font-semibold text-slate-900">
                  Thứ {selectedCourseDetail.day}, Tiết {selectedCourseDetail.startPeriod} - {selectedCourseDetail.endPeriod}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Số tín chỉ:</span>
                <span className="font-semibold text-slate-900">{selectedCourseDetail.credits} Tín chỉ</span>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-5">
              <button
                onClick={() => {
                  alert("Đã cập nhật trạng thái: Xin nghỉ học buổi này & gửi thông báo nhắc lịch học bù!");
                  setSelectedCourseDetail(null);
                }}
                className="flex-1 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-semibold py-2.5 rounded-lg transition-all"
              >
                Báo nghỉ / Học bù
              </button>
              <button
                onClick={() => setSelectedCourseDetail(null)}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2.5 rounded-lg transition-all"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
