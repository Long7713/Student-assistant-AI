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

# Project Goal

AI Student Assistant không phải là một chatbot giải bài tập.

Mục tiêu của sản phẩm là giúp sinh viên:

- [ ]📅 Quản lý lịch học và thời gian rảnh
- [ ]✅ Theo dõi bài tập và deadline
- [ ]🧠 Xác định việc quan trọng nhất cần làm
- [ ]🤖 Tự động xây dựng kế hoạch học tập
- [ ]🔄 Tự điều chỉnh kế hoạch khi người dùng bỏ lỡ một phiên học
- [ ]💬 Giải thích tại sao AI lại thay đổi lịch
>⭐ Core Value
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
Chọn 1 task
    ↓
Tạo branch
    ↓
Code
    ↓
Test local
    ↓
Commit
    ↓
Push
    ↓
Tạo Pull Request
    ↓
Người còn lại review
    ↓
Merge vào main
    ↓
Cả team pull main mới nhất

⚠️ Rule: Không ai tự ý thay đổi code core của người khác khi chưa thông báo.

# 🗓️ DEVELOPMENT ROADMAP — 7 DAYS

> 🎯 Mục tiêu: Hoàn thiện Core Loop trước deadline.
>
> **Core Loop:**
>
> `PLAN → STUDY → MISS → AI RE-PLAN → UNDERSTAND → ACT`
---

# 🟢 DAY 1 — AUDIT & STABILIZATION

- [ ] Kiểm tra cấu trúc project
- [ ] Xác định dữ liệu Course
- [ ] Xác định dữ liệu Task
- [ ] Kiểm tra state management hiện tại
- [ ] Kiểm tra luồng Add Task
- [+] Xóa hoặc tách các component dư thừa  (DNhân)

>Course + Task data structure rõ ràng
- [ ] Kiểm tra Gemini API
- [ ] Kiểm tra model đang sử dụng
- [ ] Fix lỗi model không còn hỗ trợ
- [ ] Kiểm tra logic Re-plan hiện tại
- [ ] Tách AI logic khỏi UI
- [ ] Tạo fallback khi Gemini không hoạt động
>AI Planner có thể chạy độc lập với UI

## 👑 Leader
- [ ] Kiểm tra GitHub
- [ ] Chuẩn hóa README
- [ ] Phân chia branch cho 2 Dev
- [ ] Kiểm tra .gitignore
- [ ] Kiểm tra .env.example
- [ ] Đảm bảo API key không bị push lên GitHub
# 🟡 DAY 2 — COURSE & TASK SYSTEM
- [+] tạo local storage (DNhân)
- [ ] Hoàn thiện Add Course
- [ ] Edit Course 
- [ ] Delete Course
- [ ] Hoàn thiện Add Task
- [+] Edit Task (DNhan)
- [+] Delete Task (DNhan)

> Task cần có:
Task
├── Title
├── Course
├── Deadline
├── Estimated Workload
├── Priority
└── Status

- [ ] Định nghĩa input cho Planner
- [ ] Nhận Courses
- [ ] Nhận Tasks
- [ ] Nhận Deadlines
- [ ] Nhận lịch học cố định
- [ ] Nhận Available Time
>🎯 Deliverable
User Data
    ↓
Planner Input
# 🔵 DAY 3 — CALENDAR & PLAN GENERATION
- [ ] Hiển thị Course trên Calendar
- [ ] Hiển thị Task
- [ ] Hiển thị Deadline
- [ ] Hiển thị Study Session
- [ ] Kiểm tra responsive mobile
- [ ] Tạo thuật toán ưu tiên Task
- [ ] Ưu tiên Deadline gần
- [ ] Ưu tiên Task quan trọng
- [ ] Kiểm tra conflict
- [ ] Không xếp trùng lịch học
- [ ] Generate Study Sessions
🎯 Deliverable
## TASKS
  ↓
PLANNER
  ↓
STUDY SESSIONS
# 🔥 DAY 4 — INTEGRATION

> ⚠️ Đây là ngày quan trọng nhất.

- [ ] Kết nối Planner Output vào Calendar
- [ ] Hiển thị Study Sessions
- [ ] Update UI khi plan thay đổi
- [ ] Fix lỗi data synchronization
- [ ]Kiểm tra Planner Output
- [ ]Chuẩn hóa format dữ liệu
- [ ]Tạo logic Missed Session
- [ ]Tính lại workload còn lại
## 👑 Leader
- [ ] Merge code Dev 1
- [ ] Merge code Dev 2
- [ ] Resolve conflict
- [ ] Test Core Flow
## 🎯 Test
Add Task
   ↓
Generate Plan
   ↓
Calendar Updated
# 🟣 DAY 5 — AI RE-PLAN

- [ ] Hoàn thiện nút Hoàn thành
- [ ] Hoàn thiện nút Bỏ lỡ
- [ ] Hiển thị Re-plan UI
- [ ] Hiển thị Before / After
- [ ] Hoàn thiện Mobile Bottom Sheet
- [ ] Phát hiện Missed Session
- [ ] Tính workload còn lại
- [ ] Tìm thời gian trống
- [ ] Recalculate priority
- [ ] Generate New Schedule
## 🎯 Core Flow
STUDY SESSION
      ↓
   MISSED
      ↓
REMAINING WORKLOAD
      ↓
FIND AVAILABLE TIME
      ↓
GENERATE NEW PLAN
# 🤖 DAY 6 — GEMINI + EXPLANATION
- [ ] Hiển thị AI explanation
- [ ] Hiển thị lý do Task được di chuyển
- [ ] Hiển thị Schedule Changes
- [ ] Polish UI
- [ ] Fix Mobile UI
- [ ] Gemini nhận Proposed Schedule
- [ ] Gemini giải thích:
- [ ] Vì sao task được ưu tiên
- [ ] Vì sao task bị dời
- [ ] Trade-offs
- [ ] Error handling
- [ ] Fallback khi Gemini unavailable
🎯 Deliverable
NEW PLAN
    ↓
GEMINI
    ↓
"Vì sao AI xếp như vậy?"
# 🧪 DAY 7 — TESTING & DEMO
- [ ] Fix UI bugs
- [ ] Test Add / Edit / Delete
- [ ] Test Calendar
- [ ] Test Mobile
- [ ] Test normal schedule
- [ ] Test multiple deadlines
- [ ] Test missed session
- [ ] Test overload
- [ ] Test no available time
- [ ] Test Gemini unavailable
## 👑 Leader
- [ ] End-to-End Testing
- [ ] Chuẩn bị demo data
- [ ] Chuẩn bị demo scenario
- [ ] Review README
- [ ] Push final code
- [ ] Deploy
- [ ] Chuẩn bị presentation
# 🏆 FINAL DEMO CHECKLIST
- [ ] Add Course
- [ ] Add Task
- [ ] Generate Study Plan
- [ ] Calendar cập nhật
- [ ] Start Focus Session
- [ ] Mark as Complete
- [ ] Mark as Missed
- [ ] AI detects disruption
- [ ] AI Re-plan
- [ ] Gemini explains changes
- [ ] Apply New Schedule
- [ ] Calendar cập nhật lại


>🚫 NOT NOW — Future Features

## ⚠️ Chỉ làm sau khi Core Loop hoạt động hoàn chỉnh.

- [ ]Event crawler
- [ ] Scholarship crawler
- [ ] Learning material crawler
- [ ] Social features
- [ ] Complex gamification
- [ ] AI giải bài tập
🔥 TEAM RULE

> Không chạy theo số lượng feature.

>Mục tiêu là làm một Core Loop thật sự chạy tốt.

PLAN
  ↓
STUDY
  ↓
MISS
  ↓
AI RE-PLAN
  ↓
UNDERSTAND WHY
  ↓
ACT