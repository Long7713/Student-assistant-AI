import React, { useState } from "react";
import { 
  Sparkles, 
  Send, 
  Bot, 
  X, 
  Loader2, 
  Flame, 
  Calendar, 
  GraduationCap,
  MessageSquare
} from "lucide-react";

interface GenZChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  gpa: number;
  drl: number;
  streak: number;
}

export const GenZChatDrawer: React.FC<GenZChatDrawerProps> = ({
  isOpen,
  onClose,
  onOpen,
  gpa,
  drl,
  streak,
}) => {
  const [messages, setMessages] = useState<Array<{ sender: "ai" | "user"; text: string; time: string }>>([
    {
      sender: "ai",
      text: `Yo Nam! 👋 Mình là AI Gen Z trợ lý của EduMind 🚀. Hiện tại mình thấy bạn đang có GPA 3.68 (Top 4 toàn trường) và chuỗi ${streak} ngày cày cuốc liên tục! Bạn cần mình tư vấn xếp lại lịch học, check deadline gấp hay bí kíp kéo môn nào không? ✨`,
      time: "Vừa xong",
    },
  ]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    const nowTime = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

    setMessages((prev) => [...prev, { sender: "user", text: userText, time: nowTime }]);
    setInputMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          context: { gpa, drl, streak, school: "ĐHQG-HCM" },
        }),
      });

      const data = await response.json();
      const aiReply = data.reply || "Đã nhận câu hỏi của bạn! Chúc bạn học tốt nhé 🌟";

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: aiReply,
          time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Mạng hơi chập chờn xíu, bạn thử nhắn lại cho mình nha! 🔥",
          time: "Vừa xong",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sampleChips = [
    "Lịch học hôm nay có môn gì?",
    "Làm sao kéo GPA từ 3.68 lên 3.80?",
    "Check deadline dưới 48 giờ",
    "Gợi ý tài liệu ôn thi CTDL",
  ];

  return (
    <>
      {/* Floating Action Button (Matches Screenshot: HỎI AI GEN Z ✨) */}
      {!isOpen && (
        <button
          id="btn-floating-ai-genz"
          onClick={onOpen}
          className="fixed bottom-6 right-6 z-40 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-md flex items-center gap-2 border border-slate-700 hover:scale-102 transition-all cursor-pointer group"
        >
          <div className="w-5 h-5 rounded-md bg-white/10 text-white flex items-center justify-center">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <span className="tracking-wide">HỎI AI GEN Z</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200 max-h-[580px] h-[580px]">
          {/* Chat Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 border border-slate-900 rounded-full"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-white">EduMind AI Gen Z</h4>
                  <span className="bg-white/10 text-slate-300 text-[9px] px-1.5 py-0.2 rounded font-mono">
                    Gemini 3.7 Flash
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Trợ lý đồng hành học tập 24/7</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-xl leading-relaxed ${
                    m.sender === "user"
                      ? "bg-slate-900 text-white rounded-br-xs font-medium"
                      : "bg-white text-slate-800 border border-slate-200 shadow-2xs rounded-bl-xs"
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{m.time}</span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-slate-500 text-xs bg-white p-2.5 rounded-lg border border-slate-200 w-fit">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-900" />
                <span>AI Gen Z đang suy nghĩ...</span>
              </div>
            )}
          </div>

          {/* Prompt Chips */}
          <div className="px-3 py-2 bg-slate-100/60 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {sampleChips.map((chip, i) => (
              <button
                key={i}
                onClick={() => setInputMessage(chip)}
                className="text-[10px] bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-2.5 py-1 rounded-md shrink-0 transition-colors cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Nhắn tin cho AI Gen Z..."
              className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || loading}
              className="w-8 h-8 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
