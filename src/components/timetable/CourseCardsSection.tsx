import { ChevronDown } from "lucide-react";

interface CourseCardsSectionProps {
  onUpdateCourseClass: (courseCode: string, newClassCode: string) => void;
}

export const CourseCardsSection = ({ onUpdateCourseClass }: CourseCardsSectionProps) => {
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
        "L03 (Sáng T6 & T7 - CS1)",
      ],
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
        "L03 (Chiều T2 & T6 - CS2)",
      ],
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
        "L03 (Sáng T7 - Online Meet)",
      ],
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
        "L03 (Tối T3 & T5 - Online)",
      ],
    },
  ];

  return (
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
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${c.colorDot}`}></span>
                  <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{c.name}</h3>
                </div>
                <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0">
                  {c.code}
                </span>
              </div>

              <p className="text-xs text-slate-500 mb-2">GV: {c.lecturer}</p>
              <div className="mb-3">
                <span className="bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded inline-block">
                  {c.campus}
                </span>
              </div>
            </div>

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
  );
};
