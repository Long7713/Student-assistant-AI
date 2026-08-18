<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/b87d2bad-803d-4e83-88e6-90b96a60286d

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
   🎓 AI Student Assistant

An AI-powered academic planning assistant that helps students decide what to do next — and automatically adapts their study plan when life changes.

🎯 Project Goal

AI Student Assistant không phải là một chatbot giải bài tập.

Mục tiêu của sản phẩm là giúp sinh viên:

📅 Quản lý lịch học và thời gian rảnh
✅ Theo dõi bài tập và deadline
🧠 Xác định việc quan trọng nhất cần làm
🤖 Tự động xây dựng kế hoạch học tập
🔄 Tự điều chỉnh kế hoạch khi người dùng bỏ lỡ một phiên học
💬 Giải thích tại sao AI lại thay đổi lịch
⭐ Core Value
Student misses a study session
            ↓
System detects the disruption
            ↓
Academic Planner recalculates the schedule
            ↓
Gemini analyzes and explains the changes
            ↓
Student receives a new actionable plan
👥 Team Structure
Role	Responsibility
👑 Leader / Product Owner	Product direction, architecture, AI Studio, integration, testing, demo
💻 Dev 1 — Core & Data	Task, Course, Calendar, State/Data management
🤖 Dev 2 — AI & Planner	Planning engine, Gemini, Re-plan, AI explanation

⚠️ Rule: Không ai tự ý thay đổi code core của người khác khi chưa thông báo.

🚀 Development Roadmap
🟢 Phase 1 — Project Stabilization

Mục tiêu: Đảm bảo project chạy ổn định trước khi tiếp tục phát triển.

👑 Leader
 Export source từ Google AI Studio
 Setup GitHub repository
 Kiểm tra project chạy local
 Kiểm tra .gitignore
 Kiểm tra .env.example
 Kiểm tra API key không bị commit
 Chuẩn hóa README
 Tạo Git workflow cho team
💻 Dev 1
 Kiểm tra cấu trúc project
 Kiểm tra state hiện tại
 Dọn các file/component dư thừa
 Kiểm tra mobile responsive
 Fix UI bugs
🤖 Dev 2
 Kiểm tra Gemini integration hiện tại
 Xác định model/API đang sử dụng
 Kiểm tra fallback logic
 Không để raw API error hiển thị cho user
✅ Definition of Done
git clone <repository>
npm install
npm run dev

App phải chạy được mà không cần chỉnh sửa code.

🔥 Phase 2 — Core Data & Academic Planner

Đây là phase quan trọng nhất.

Hai dev làm song song.

💻 DEV 1 — Data, Task & Calendar
📚 Course Management
 Thêm môn học
 Chỉnh sửa môn học
 Xóa môn học
 Màu sắc môn học
 Lưu dữ liệu môn học
📝 Task Management

Task cần có:

Tên nhiệm vụ
├── Môn học
├── Deadline
├── Estimated workload
├── Priority
└── Status

Checklist:

 Add Task
 Edit Task
 Delete Task
 Complete Task
 Mark Task as Missed
 Update Progress
📅 Calendar
 Hiển thị lịch học
 Hiển thị study sessions
 Hiển thị deadline
 Hiển thị event
 Calendar update khi task thay đổi
🎯 Deliverable

Dev 1 phải đảm bảo flow này hoạt động:

Add Course
      ↓
Add Task
      ↓
Task appears in Task List
      ↓
Task appears in Calendar
      ↓
Update / Complete Task
🤖 DEV 2 — Academic Planner & Gemini
🧠 Planner Engine

Input:

Courses
+
Fixed Classes
+
Tasks
+
Deadlines
+
Priority
+
Estimated Workload
+
Available Study Time

Output:

Study Sessions
+
Recommended Schedule
Planner Rules
 Không xếp task trùng lịch học
 Ưu tiên deadline gần
 Ưu tiên task có priority cao
 Không vượt quá daily study capacity
 Phát hiện schedule conflict
 Phát hiện overload
 Phát hiện task có nguy cơ trễ deadline
🔄 Adaptive Re-Planning

Khi user bấm:

Bỏ lỡ → Nhờ AI xếp lại

Hệ thống phải:

Missed Session
       ↓
Calculate remaining workload
       ↓
Find available study slots
       ↓
Analyze deadlines
       ↓
Recalculate priorities
       ↓
Generate new schedule
       ↓
Gemini explains WHY

Checklist:

 Missed session được ghi nhận
 Tìm available slots mới
 Không conflict
 Recalculate priority
 Generate proposed schedule
 Before / After comparison
 Apply New Schedule
🟣 Phase 3 — Integration

Sau khi Dev 1 và Dev 2 hoàn thành phần riêng.

👑 Leader chịu trách nhiệm merge
DEV 1
Data + Calendar
        \
         → INTEGRATION → TEST
        /
DEV 2
Planner + Gemini
Integration Checklist
 Task từ Dev 1 được Planner đọc đúng
 Planner tạo session đúng
 Calendar hiển thị session mới
 Missed session trigger Re-plan
 Re-plan update lại Calendar
 Gemini explanation hiển thị đúng
🎯 Core Loop
┌───────────────┐
│  ADD TASK     │
└───────┬───────┘
        ↓
┌───────────────┐
│ CREATE PLAN   │
└───────┬───────┘
        ↓
┌───────────────┐
│ STUDY SESSION │
└───────┬───────┘
        ↓
   ┌────┴────┐
   ↓         ↓
 DONE      MISSED
             ↓
       ┌──────────┐
       │ RE-PLAN  │
       └────┬─────┘
            ↓
      ┌───────────┐
      │ AI EXPLAIN│
      └────┬──────┘
           ↓
      APPLY PLAN
🤖 Phase 4 — Gemini Integration
🤖 Dev 2

Gemini không chịu trách nhiệm tính toán toàn bộ lịch.

Architecture
USER DATA
    ↓
Academic Planning Engine
    ↓
Conflict & Priority Analysis
    ↓
Proposed Schedule
    ↓
Gemini
    ↓
Human-friendly Explanation
Gemini Responsibilities
 Giải thích tại sao task được ưu tiên
 Giải thích tại sao task bị dời
 Phân tích trade-offs
 Đưa ra lời khuyên học tập
 Trả lời bằng tiếng Việt tự nhiên
Error Handling

Nếu Gemini API lỗi:

❌ Không hiển thị:

404 NOT_FOUND
Gemini API Error
Internal Server Error

✅ Hiển thị:

🤖 Trợ lý AI hiện đang tạm thời không khả dụng. Hệ thống vẫn đã tạo kế hoạch dựa trên lịch học và deadline của bạn.

⚠️ Phase 5 — Edge Cases

Đây là phần giúp app không giống một bản demo giả.

Case 1 — Workload Fits
10 hours workload
15 hours available

✅ Tạo schedule bình thường.

Case 2 — Missed Session
Study Session
      ↓
MISSED
      ↓
Recalculate Schedule

✅ Tạo lịch mới.

Case 3 — Overloaded Student
15 hours workload
8 hours available

⚠️ App không được giả vờ mọi thứ đều ổn.

Phải thông báo:

Khối lượng công việc hiện tại vượt quá thời gian học khả dụng của bạn.

Đề xuất:

 Ưu tiên deadline gần
 Dời task ít quan trọng
 Giảm workload
 Hiển thị task có nguy cơ trễ
🧪 Phase 6 — Testing
💻 Dev 1
UI & Data Testing
 Add Course
 Edit Course
 Delete Course
 Add Task
 Edit Task
 Delete Task
 Complete Task
 Calendar Update
🤖 Dev 2
Planner Testing
 Normal schedule
 Multiple deadlines
 Missed session
 No available slot
 Overload
 Conflicting schedule
 Gemini unavailable
👑 Leader
End-to-End Testing
New User
    ↓
Add Courses
    ↓
Add Tasks
    ↓
Generate Plan
    ↓
Miss Session
    ↓
AI Re-plan
    ↓
Apply New Plan
    ↓
Calendar Updated
🎬 Phase 7 — Demo Preparation
👑 Leader

Chuẩn bị demo story:

1️⃣ Problem

Sinh viên thường biết mình có rất nhiều việc cần làm, nhưng khi lịch thay đổi hoặc bỏ lỡ một buổi học, họ không biết nên ưu tiên việc gì tiếp theo.

2️⃣ Solution

AI Student Assistant không chỉ lưu todo list. Hệ thống hiểu lịch học, deadline và khối lượng công việc để đề xuất hành động tiếp theo.

3️⃣ WOW MOMENT
Student misses a study session
          ↓
⚠️ Plan disrupted
          ↓
AI analyzes impact
          ↓
New schedule generated
          ↓
Gemini explains why
          ↓
Student applies new plan
🗓️ Suggested Timeline
Ngày	Dev 1 💻	Dev 2 🤖	Leader 👑
Day 1	Data & Task	Audit Gemini/Planner	Setup + Git
Day 2	Course + Calendar	Planner Engine	Review
Day 3	Calendar integration	Adaptive Re-plan	Integration
Day 4	UI/UX + persistence	Gemini + fallback	Test
Day 5	Bug fixing	Edge cases	End-to-end
Day 6	Polish	AI polish	Demo scenario
Day 7	Final testing	Final testing	Deploy + Presentation
🚫 Out of Scope — Không làm trước deadline

Các feature này chưa phải ưu tiên:

⏳ Event crawler
⏳ Scholarship crawler
⏳ Learning material crawler
⏳ Social features
⏳ Complex gamification
⏳ AI chatbot giải bài

Có thể đưa vào:

Future Roadmap

🏆 Definition of Done

Project được xem là sẵn sàng demo khi:

 User thêm được môn học
 User thêm được task
 AI tạo được kế hoạch
 Calendar hiển thị kế hoạch
 User có thể Complete
 User có thể Miss một phiên học
 System tự Re-plan
 Gemini giải thích thay đổi
 User Apply kế hoạch mới
 Calendar cập nhật thật
 Không có raw API errors
 App hoạt động tốt trên mobile
 Có demo scenario rõ ràng
📌 Git Workflow
main
 │
 ├── feature/data-calendar
 │       └── DEV 1
 │
 └── feature/ai-planner
         └── DEV 2

Mỗi feature hoàn thành:

git add .
git commit -m "feat: add feature name"
git push

Sau đó tạo Pull Request → Leader review → merge vào main.

🚀 TEAM PRIORITY

Don't build more features.

Make the core loop unforgettable.

PLAN → MISS → RE-PLAN → UNDERSTAND → ACT
