import { Course } from "../../types";

interface CourseDetailModalProps {
  course: Course | null;
  onClose: () => void;
}

export const CourseDetailModal = ({ course, onClose }: CourseDetailModalProps) => {
  if (!course) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-lg border border-slate-200 animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
              Chi tiết lớp học phần
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-1.5">{course.name}</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              {course.code} • {course.classCode}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2.5 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Giảng viên:</span>
            <span className="font-semibold text-slate-900">{course.lecturer}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Phòng học & Cơ sở:</span>
            <span className="font-semibold text-slate-900">
              Phòng {course.room} ({course.campus})
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Thời gian học:</span>
            <span className="font-semibold text-slate-900">
              Thứ {course.day}, Tiết {course.startPeriod} - {course.endPeriod}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Số tín chỉ:</span>
            <span className="font-semibold text-slate-900">{course.credits} Tín chỉ</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-5">
          <button
            onClick={onClose}
            className="flex-1 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-semibold py-2.5 rounded-lg transition-all cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
