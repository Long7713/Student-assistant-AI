import { Clock, MapPin } from "lucide-react";
import { Course } from "../../types";
import { PERIOD_TIMES, DAYS_OF_WEEK } from "../../mockData";

interface TimetableGridProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
}

export const TimetableGrid = ({ courses, onSelectCourse }: TimetableGridProps) => {
  const getCourseForSlot = (day: number, period: number) => {
    return courses.find(
      (c) => c.day === day && period >= c.startPeriod && period <= c.endPeriod
    );
  };

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

  return (
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
                      return null;
                    }

                    if (course && isFirstPeriod) {
                      return (
                        <div
                          key={dayObj.day}
                          id={`slot-${dayObj.day}-${p}`}
                          style={{ gridRow: `span ${span}` }}
                          onClick={() => onSelectCourse(course)}
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

                    return (
                      <div
                        key={dayObj.day}
                        id={`empty-slot-${dayObj.day}-${p}`}
                        onClick={() => {
                          // Quick slot note
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
  );
};
