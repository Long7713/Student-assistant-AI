import React from "react";
import { 
  X, 
  User, 
  GraduationCap, 
  Sparkles, 
  Trophy, 
  Flame, 
  Calendar, 
  Mail, 
  Building2, 
  Award, 
  CheckCircle2, 
  BookOpen, 
  ShieldCheck,
  ExternalLink
} from "lucide-react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  gpa: number;
  drl: number;
  rank: number;
  streak: number;
  xp: number;
  onNavigateTab?: (tab: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  gpa,
  drl,
  rank,
  streak,
  xp,
  onNavigateTab,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Hồ Sơ Cá Nhân & Thành Tích Học Tập</h3>
              <p className="text-[11px] text-slate-400">Thông tin sinh viên, chỉ số GPA, ĐRL và Huy hiệu</p>
            </div>
          </div>

          <button
            id="btn-close-profile-modal"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* User Bio Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                  alt="Avatar"
                  className="w-14 h-14 rounded-full border-2 border-slate-200 object-cover shadow-2xs"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-base font-bold text-slate-900">Nam Trần</h4>
                  <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                    MSSV: 23110892
                  </span>
                  <span className="bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    Hạng Kim Cương
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Khoa Khoa học Máy tính • ĐHQG-HCM</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>nam.tran@vnuhcm.edu.vn</span>
                </div>
              </div>
            </div>

            <div className="text-right sm:border-l sm:border-slate-200 sm:pl-4 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end">
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Tích Luỹ XP</span>
              <div className="text-lg font-bold text-slate-900">{xp.toLocaleString()} XP</div>
              <span className="text-[10px] text-emerald-600 font-semibold">Cấp độ 12 (Master)</span>
            </div>
          </div>

          {/* 4 Core Metric Cards */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Chỉ Số Học Tập & Xếp Hạng
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* GPA */}
              <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">GPA Hệ 4</span>
                  <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <GraduationCap className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-xl font-bold text-slate-900">{gpa.toFixed(2)}</div>
                <div className="text-[10px] text-emerald-600 font-medium mt-0.5">Xuất Sắc (Hệ 10: 8.72)</div>
              </div>

              {/* ĐRL */}
              <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Điểm ĐRL</span>
                  <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-xl font-bold text-slate-900">{drl}/100</div>
                <div className="text-[10px] text-blue-600 font-medium mt-0.5">Xếp loại Tốt</div>
              </div>

              {/* Rank */}
              <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Xếp Hạng</span>
                  <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-700 flex items-center justify-center">
                    <Trophy className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-xl font-bold text-slate-900">#{rank}</div>
                <div className="text-[10px] text-amber-700 font-medium mt-0.5">Top 1% Toàn Khóa</div>
              </div>

              {/* Streak */}
              <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Streak</span>
                  <div className="w-6 h-6 rounded-md bg-amber-500 text-white flex items-center justify-center shadow-2xs">
                    <Flame className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-xl font-bold text-slate-900">{streak} Ngày</div>
                <div className="text-[10px] text-amber-700 font-medium mt-0.5">Chuỗi liên tục</div>
              </div>
            </div>
          </div>

          {/* Academic Semester Targets */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Tiến Độ Mục Tiêu Học Kỳ 2 (Năm học 2025 - 2026)</span>
              </h4>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                Đang đạt 92%
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                  <span>Mục tiêu Săn Học Bổng Khuyến Khích (GPA ≥ 3.70)</span>
                  <span className="font-bold text-slate-900">3.68 / 3.70</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: "95%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                  <span>Mục tiêu Sinh Viên 5 Tốt (ĐRL ≥ 90)</span>
                  <span className="font-bold text-slate-900">88 / 90 điểm</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: "97%" }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Badges & Achievements */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Huy Hiệu & Thành Tích Đạt Được
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm shrink-0">
                  ⚡
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Chiến Thần Deadline</div>
                  <div className="text-[10px] text-slate-500">Hoàn thành 15+ bài nộp trước hạn 24h</div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0">
                  📅
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Bậc Thầy TKB</div>
                  <div className="text-[10px] text-slate-500">Xếp lịch gọn gàng không bị trùng tiết</div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm shrink-0">
                  📚
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Người Chia Sẻ Tri Thức</div>
                  <div className="text-[10px] text-slate-500">Đã đóng góp 3 bộ đề thi có lời giải</div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-sm shrink-0">
                  🔥
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Kỷ Lục Cày Cuốc</div>
                  <div className="text-[10px] text-slate-500">Duy trì Streak 16 ngày liên tiếp</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Integration & Settings */}
          <div className="border-t border-slate-200 pt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Google Calendar Two-Way Sync: Đã kết nối</span>
            </div>

            {onNavigateTab && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onClose();
                    onNavigateTab("gpa");
                  }}
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Săn Học Bổng & GPA</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onNavigateTab("leaderboard");
                  }}
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Bảng Xếp Hạng</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
