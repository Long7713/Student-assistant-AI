import { useState } from "react";
import { CalendarCheck } from "lucide-react";
import { Course, SchedulePlan } from "../types";
import { useApp } from "../context/AppContext";
import { TimetableHeader } from "./timetable/TimetableHeader";
import { TimetableGrid } from "./timetable/TimetableGrid";
import { CourseCardsSection } from "./timetable/CourseCardsSection";
import { CourseDetailModal } from "./timetable/CourseDetailModal";

interface TimetableViewProps {
  courses?: Course[];
  plans?: SchedulePlan[];
  activePlanId?: string;
  onSelectPlan?: (planId: string) => void;
  onOpenAiOptimizer?: () => void;
  onAddCourse?: () => void;
  onUpdateCourseClass?: (courseCode: string, newClassCode: string) => void;
}

export const TimetableView = (props: TimetableViewProps) => {
  const app = useApp();

  const courses = props.courses ?? app.courses;
  const plans = props.plans ?? app.plans;
  const activePlanId = props.activePlanId ?? app.activePlanId;
  const onSelectPlan = props.onSelectPlan ?? app.selectPlan;
  const onOpenAiOptimizer = props.onOpenAiOptimizer ?? (() => app.setAiOptimizerOpen(true));
  const onAddCourse = props.onAddCourse ?? (() => app.setAiOptimizerOpen(true));
  const onUpdateCourseClass = props.onUpdateCourseClass ?? app.updateCourseClass;

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

  return (
    <div className="space-y-6">
      {/* Top Action Bar & Plan Switcher */}
      <TimetableHeader
        plans={plans}
        activePlanId={activePlanId}
        onSelectPlan={onSelectPlan}
        onOpenAiOptimizer={onOpenAiOptimizer}
        onAddCourse={onAddCourse}
        isCalendarSynced={isCalendarSynced}
        syncing={syncing}
        onToggleSync={handleToggleGoogleCalendarSync}
      />

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
      <TimetableGrid courses={courses} onSelectCourse={setSelectedCourseDetail} />

      {/* Section: Course cards with class switcher */}
      <CourseCardsSection onUpdateCourseClass={onUpdateCourseClass} />

      {/* Selected Course Modal */}
      <CourseDetailModal
        course={selectedCourseDetail}
        onClose={() => setSelectedCourseDetail(null)}
      />
    </div>
  );
};
