import { useState } from "react";
import { 
  Trophy, 
  Flame, 
  Crown, 
  Gift, 
  Users, 
} from "lucide-react";
import { LeaderboardUser } from "../types";
import { useApp } from "../context/AppContext";

interface LeaderboardViewProps {
  users?: LeaderboardUser[];
  currentUserXp?: number;
}

export const LeaderboardView = (props: LeaderboardViewProps) => {
  const { userProfile, leaderboardUsers } = useApp();

  const users = props.users ?? leaderboardUsers;
  const currentUserXp = props.currentUserXp ?? userProfile.xp;

  const [filterPeriod, setFilterPeriod] = useState<"week" | "month" | "all">("week");
  const [activeTabSub, setActiveTabSub] = useState<"ranking" | "rewards">("ranking");

  const rewards = [
    {
      id: "rew-1",
      title: "Voucher In Ấn & Photocopy Tài Liệu Miễn Phí (50.000đ)",
      cost: 500,
      sponsor: "Hiệu sách Bách Khoa & NEU",
      icon: "🖨️",
      claimed: false,
    },
    {
      id: "rew-2",
      title: "Vé Mượn Sách Phòng Đọc VIP Không Giới Hạn 1 Tháng",
      cost: 1200,
      sponsor: "Thư viện Trung tâm ĐHQG",
      icon: "📚",
      claimed: false,
    },
    {
      id: "rew-3",
      title: "Bộ Huy Hiệu & Áo Thun Hoodie GenZ Study",
      cost: 3000,
      sponsor: "GenZ Study x Google Developer Student Club",
      icon: "👕",
      claimed: false,
    },
    {
      id: "rew-4",
      title: "Suất Học Bổng Khóa Học Google Cloud & AI Certification (Coursera)",
      cost: 4500,
      sponsor: "Google Cloud Ecosystem",
      icon: "🎓",
      claimed: true,
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Bảng Xếp Hạng Học Bá & Gamification (Social Leaderboard)
            </h2>
            <span className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-slate-200">
              Hạng Kim Cương
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Tích lũy XP qua mỗi deadline hoàn thành đúng hạn, chia sẻ tài liệu và duy trì chuỗi học tập
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTabSub("ranking")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTabSub === "ranking"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Bảng Xếp Hạng
          </button>
          <button
            onClick={() => setActiveTabSub("rewards")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTabSub === "rewards"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Gift className="w-3.5 h-3.5 text-amber-400" />
            <span>Đổi Thưởng XP</span>
          </button>
        </div>
      </div>

      {activeTabSub === "ranking" ? (
        <>
          {/* Top 3 Podium Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Rank 2 */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 text-center flex flex-col items-center justify-between order-2 md:order-1 relative overflow-hidden shadow-2xs">
              <div className="absolute top-3 left-3 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold px-2 py-0.5 rounded-md">
                #2
              </div>
              <div className="relative mt-2">
                <img
                  src={users[1]?.avatar}
                  alt={users[1]?.name}
                  className="w-16 h-16 rounded-full border-2 border-slate-300 object-cover shadow-2xs"
                />
                <span className="absolute -bottom-2 -right-1 bg-slate-200 text-slate-800 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                  🥈 Bạc
                </span>
              </div>
              <div className="mt-3">
                <h4 className="text-sm font-bold text-slate-900">{users[1]?.name}</h4>
                <p className="text-[11px] text-slate-500">{users[1]?.university}</p>
                <div className="mt-2 text-sm font-bold text-slate-900">{users[1]?.xp} XP</div>
                <div className="text-[10px] text-emerald-600 font-semibold">GPA: {users[1]?.gpa}</div>
              </div>
            </div>

            {/* Rank 1 (Gold Crown) */}
            <div className="bg-white border border-slate-300 rounded-xl p-5 text-center flex flex-col items-center justify-between order-1 md:order-2 relative overflow-hidden shadow-xs">
              <div className="absolute top-3 left-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-amber-600" />
                <span>#1 Quán Quân</span>
              </div>
              <div className="relative mt-2">
                <img
                  src={users[0]?.avatar}
                  alt={users[0]?.name}
                  className="w-18 h-18 rounded-full border-2 border-amber-400 object-cover shadow-2xs"
                />
                <span className="absolute -bottom-2 -right-1 bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-md shadow-2xs">
                  🏆 Vàng
                </span>
              </div>
              <div className="mt-3">
                <h4 className="text-base font-bold text-slate-900">{users[0]?.name}</h4>
                <p className="text-xs text-slate-500 font-medium">{users[0]?.university}</p>
                <div className="mt-2 text-base font-bold text-slate-900">{users[0]?.xp} XP</div>
                <div className="text-xs text-emerald-700 font-semibold">GPA: {users[0]?.gpa} • {users[0]?.completedDeadlines} Deadlines</div>
              </div>
            </div>

            {/* Rank 3 */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 text-center flex flex-col items-center justify-between order-3 md:order-3 relative overflow-hidden shadow-2xs">
              <div className="absolute top-3 left-3 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold px-2 py-0.5 rounded-md">
                #3
              </div>
              <div className="relative mt-2">
                <img
                  src={users[2]?.avatar}
                  alt={users[2]?.name}
                  className="w-16 h-16 rounded-full border-2 border-slate-300 object-cover shadow-2xs"
                />
                <span className="absolute -bottom-2 -right-1 bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                  🥉 Đồng
                </span>
              </div>
              <div className="mt-3">
                <h4 className="text-sm font-bold text-slate-900">{users[2]?.name}</h4>
                <p className="text-[11px] text-slate-500">{users[2]?.university}</p>
                <div className="mt-2 text-sm font-bold text-slate-900">{users[2]?.xp} XP</div>
                <div className="text-[10px] text-emerald-600 font-semibold">GPA: {users[2]?.gpa}</div>
              </div>
            </div>
          </div>

          {/* Full Leaderboard Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 bg-slate-50/50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Bảng Xếp Hạng Toàn Trường ({filterPeriod === "week" ? "Tuần Này" : "Toàn Học Kỳ"})
                </span>
              </div>

              <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-lg text-xs font-semibold">
                <button
                  onClick={() => setFilterPeriod("week")}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    filterPeriod === "week" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600"
                  }`}
                >
                  Tuần này
                </button>
                <button
                  onClick={() => setFilterPeriod("month")}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    filterPeriod === "month" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600"
                  }`}
                >
                  Tháng này
                </button>
                <button
                  onClick={() => setFilterPeriod("all")}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    filterPeriod === "all" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600"
                  }`}
                >
                  Kỳ này
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {users.map((user) => {
                const isMe = user.id === "usr-me";
                return (
                  <div
                    key={user.id}
                    className={`p-4 flex items-center justify-between gap-4 transition-colors ${
                      isMe ? "bg-slate-50 font-medium" : "hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className={`w-6 text-center font-bold text-sm ${
                        user.rank === 1 ? "text-amber-500" : user.rank === 2 ? "text-slate-400" : user.rank === 3 ? "text-amber-700" : "text-slate-400"
                      }`}>
                        #{user.rank}
                      </span>

                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />

                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="text-xs sm:text-sm font-bold text-slate-900">
                            {user.name} {isMe && <span className="text-slate-700 font-semibold text-[10px] bg-slate-200 px-1.5 py-0.2 rounded">(Bạn)</span>}
                          </h5>
                          <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.2 rounded">
                            {user.tier}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{user.university} • {user.major}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div className="hidden sm:block">
                        <div className="text-xs font-semibold text-emerald-600">GPA {user.gpa}</div>
                        <div className="text-[10px] text-slate-400">{user.completedDeadlines} Bài nộp</div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold text-slate-900">{user.xp} XP</div>
                        <div className="text-[10px] text-amber-600 font-semibold flex items-center justify-end gap-0.5">
                          <Flame className="w-3 h-3 fill-amber-500" />
                          <span>{user.streakDays}D Streak</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        /* REWARDS STORE */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rewards.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="text-3xl">{r.icon}</div>
                  <span className="text-xs font-bold text-slate-800 bg-slate-100 border border-slate-200 px-3 py-1 rounded-md">
                    {r.cost} XP
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-2">{r.title}</h4>
                <p className="text-xs text-slate-500 mt-1">Đơn vị tài trợ: {r.sponsor}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {currentUserXp >= r.cost ? "Đủ điểm quy đổi" : `Còn thiếu ${r.cost - currentUserXp} XP`}
                </span>
                <button
                  onClick={() => alert(`Đã quy đổi phần thưởng thành công! Mã voucher đã được gửi qua email sinh viên của bạn.`)}
                  disabled={currentUserXp < r.cost}
                  className={`text-xs font-semibold px-4 py-2 rounded-lg transition-all cursor-pointer ${
                    currentUserXp >= r.cost
                      ? "bg-slate-900 hover:bg-slate-800 text-white"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {currentUserXp >= r.cost ? "Đổi Phần Thưởng" : "Chưa đủ XP"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
