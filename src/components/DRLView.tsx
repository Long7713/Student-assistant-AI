import { Users, Sparkles, CheckCircle2, Calendar, MapPin, CalendarPlus } from "lucide-react";
import { INITIAL_DRL_EVENTS } from "../mockData";

export const DRLView = () => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Hoạt Động & Điểm Rèn Luyện (ĐRL)
            </h2>
            <span className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-slate-200">
              Hiện tại: 88 / 100 Điểm (Loại Tốt)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Tham gia các hoạt động Đoàn - Hội, CLB và sự kiện tình nguyện để đạt danh hiệu Sinh Viên 5 Tốt
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Mục tiêu loại Xuất sắc</span>
          <div className="text-sm font-bold text-slate-900">Cần thêm +2 Điểm ĐRL</div>
        </div>
      </div>

      {/* 5 University DRL Criteria Breakdown */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          5 Tiêu Chí Đánh Giá Điểm Rèn Luyện Theo Quy Chế ĐHQG
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { label: "1. Ý thức học tập", score: "20 / 20", max: 20 },
            { label: "2. Chấp hành quy chế", score: "25 / 25", max: 25 },
            { label: "3. Tham gia phong trào", score: "18 / 20", max: 20 },
            { label: "4. Quan hệ cộng đồng", score: "15 / 20", max: 20 },
            { label: "5. Phụ trách cán bộ/CLB", score: "10 / 15", max: 15 },
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-200 text-center">
              <div className="text-xs text-slate-500 font-medium line-clamp-1">{item.label}</div>
              <div className="text-base font-bold mt-1 text-slate-900">{item.score}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events List */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-600" />
            <span>Sự Kiện Đang Mở Đăng Ký Tích Lũy ĐRL</span>
          </h3>
          <span className="text-xs text-slate-400">Tự động đồng bộ lên Google Calendar khi đăng ký</span>
        </div>

        <div className="space-y-3">
          {INITIAL_DRL_EVENTS.map((evt) => (
            <div
              key={evt.id}
              className="bg-slate-50/50 hover:bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded">
                    +{evt.drlPoints} Điểm ĐRL
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{evt.category}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-1">{evt.title}</h4>
                <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {evt.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {evt.location}
                  </span>
                </div>
              </div>

              <button
                onClick={() => alert(`Đã đăng ký tham gia "${evt.title}" và đồng bộ sự kiện vào Google Calendar!`)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-2xs"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                <span>{evt.status === "registered" ? "Đã Đăng Ký (Sync Cal)" : "Đăng Ký Tham Gia"}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
