import { useState, useRef, useEffect } from "react";
import { 
  Sparkles, 
  Send, 
  Bot, 
  X, 
  Loader2, 
  Flame, 
  Calendar, 
  GraduationCap 
} from "lucide-react";
import { chatService } from "../services/chatService";
import { formatCurrentTime } from "../utils/formatters";
import { useApp } from "../context/AppContext";

interface GenZChatDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  gpa?: number;
  drl?: number;
  streak?: number;
}

export const GenZChatDrawer = (props: GenZChatDrawerProps) => {
  const app = useApp();

  const isOpen = props.isOpen ?? app.chatOpen;
  const onClose = props.onClose ?? (() => app.setChatOpen(false));
  const onOpen = props.onOpen ?? (() => app.setChatOpen(true));
  const gpa = props.gpa ?? app.userProfile.gpa;
  const drl = props.drl ?? app.userProfile.drl;
  const streak = props.streak ?? app.userProfile.streak;

  const [messages, setMessages] = useState<
    Array<{ sender: "ai" | "user"; text: string; time: string }>
  >([
    {
      sender: "ai",
      text: `Yo Nam! 👋 Mình là AI Gen Z trợ lý của GenZ Study 🚀. Hiện tại mình thấy bạn đang có GPA ${gpa.toFixed(
        2
      )} (Top ${app.userProfile.rank} toàn trường) và chuỗi ${streak} ngày cày cuốc liên tục! Bạn cần mình tư vấn xếp lại lịch học, check deadline gấp hay bí kíp kéo môn nào không? ✨`,
      time: "Vừa xong",
    },
  ]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const userText = inputMessage.trim();
    const nowTime = formatCurrentTime();

    setMessages((prev) => [...prev, { sender: "user", text: userText, time: nowTime }]);
    setInputMessage("");
    setLoading(true);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const data = await chatService.sendMessage(
        userText,
        {
          gpa,
          drl,
          streak,
          upcomingDeadlines: "Báo cáo Lab 3 - Cấu trúc Dữ liệu (Hạn 12 giờ nữa)",
        },
        abortControllerRef.current.signal
      );

      if (data.success && data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: data.reply,
            time: formatCurrentTime(),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: "Ủa lag xíu rùi bro ơi 🥺 Server đang bận xíu, xíu nữa hỏi lại tui nha!",
            time: formatCurrentTime(),
          },
        ]);
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: "Mạng bị chập chờn rùi ông ơi! Kiểm tra kết nối mạng xíu nha 📶",
            time: formatCurrentTime(),
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={onOpen}
          className="fixed bottom-6 right-6 z-40 bg-slate-900 hover:bg-slate-800 text-white rounded-full p-3.5 shadow-lg flex items-center gap-2.5 transition-all group hover:scale-105 cursor-pointer border border-slate-700"
          title="Mở GenZ Study AI Chatbot"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-emerald-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-slate-900"></span>
          </div>
          <span className="text-xs font-semibold pr-1">Hỏi AI Gen Z ✨</span>
        </button>
      )}

      {/* Slide-over Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/30 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center relative">
                  <Bot className="w-5 h-5 text-emerald-400" />
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-slate-900"></span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-white">GenZ Study AI Bot</h3>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-semibold">
                      Gemini
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Trợ lý cố vấn học tập chuẩn Gen Z</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Context Chips */}
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
              <div className="flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                <span>GPA: {gpa.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Streak: {streak} ngày</span>
              </div>
              <div className="flex items-center gap-1 text-slate-700 font-medium">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>ĐRL: {drl}/100</span>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F8FAFC]">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    m.sender === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-2xs ${
                      m.sender === "user"
                        ? "bg-slate-900 text-white rounded-br-xs"
                        : "bg-white border border-slate-200 text-slate-800 rounded-bl-xs"
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 px-1">{m.time}</span>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-slate-400 text-xs bg-white border border-slate-200 rounded-xl p-3 max-w-[70%]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-700" />
                  <span>AI đang soạn tin nhắn...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-slate-200">
              {/* Quick suggestions */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-1 no-scrollbar">
                {[
                  "Kéo điểm GPA môn Giải tích 1",
                  "Gợi ý môn tự chọn dễ thở",
                  "Cách lấy trọn 100 điểm ĐRL",
                ].map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => setInputMessage(sug)}
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer"
                  >
                    {sug}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Hỏi AI bất kỳ điều gì về lịch học, deadline..."
                  className="flex-1 bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={loading || !inputMessage.trim()}
                  className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-2xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
