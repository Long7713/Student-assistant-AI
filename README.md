<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/24b67902-7da8-426c-846a-9eddf735d17d

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
# 🗓️ EduMind AI - 14-Day Implementation Roadmap

> **Mục tiêu:** Hoàn thành toàn bộ dự án, quay Demo, chuẩn bị Slide và nộp bài trước ngày **30/08/2026**.

## 📌 2. Sơ Đồ Luồng Dữ Liệu (Data Flow Diagram - DFD)

### 2.1 Sơ đồ luồng dữ liệu tổng quan (Level 0 DFD)
```graph TD
    User([Sinh viên / User]) <--> MobileApp[EduMind AI Mobile App]
    subgraph Google Cloud Ecosystem
        MobileApp <--> Firebase[(Firebase / Firestore DB)]
        MobileApp <--> GeminiAPI[Gemini 1.5 Flash / Pro API]
        MobileApp <--> GCS[Google Cloud Storage]
        MobileApp <--> VertexAI[Vertex AI Embeddings]
    end 
    subgraph Google Workspace Ecosystem
        MobileApp <--> GCalendar[Google Calendar API]
    end
```


## 📅 Lịch Triển Khai Chi Tiết
# 🚀 Kế Hoạch Triển Khai Cấp Tốc


## 📅 Sprint Timeline

| Day       | Ngày  | Hạng Mục                   | Mục Tiêu Chính                                |
| --------- | ----- | -------------------------- | --------------------------------------------- |
| **Day 1** | 21/08 | 🤖 AI & Vector Search      | Hoàn thiện Semantic Search và chống trùng lặp |
| **Day 2** | 22/08 | 🎯 Deadline & Gamification | Priority Score, Focus Zone, XP và Leaderboard |
| **Day 3** | 23/08 | 🎨 UI/UX Polish            | Material Design 3, Dark Mode, Responsive      |
| **Day 4** | 24/08 | 🧪 Integration Testing     | Kiểm thử toàn bộ user flow                    |
| **Day 5** | 25/08 | ⚡ Performance & Security   | Caching, tối ưu GCP và Supabase RLS           |
| **Day 6** | 26/08 | 📊 Pitch Deck & Script     | Hoàn thiện slide và kịch bản demo             |
| **Day 7** | 27/08 | 🎬 Video Demo              | Quay, dựng và hoàn thiện video                |
| **Day 8** | 28/08 | 🧹 Repository Cleanup      | Clean code, README và Release                 |
| **Day 9** | 29/08 | 🚀 Official Submission     | Nộp bài trước deadline                        |

---

# 🗓️ Chi Tiết Kế Hoạch Triển Khai

## 🤖 Day 1 — AI Chống Trùng Lặp & Vector Search

**📅 Ngày:** 21/08/2026

### Mục tiêu

Hoàn thiện khả năng tìm kiếm ngữ nghĩa và phát hiện nội dung trùng lặp bằng AI.

### Công việc

 +(Long) Tích hợp Embeddings API.(Long)+
 +(Long) Thiết kế pipeline tạo và lưu embeddings.(Long)+
 +(Long) Cấu hình `pgvector` trên Supabase.(Long)+
 +(Long) Viết logic Vector Similarity Search.(Long)+
 +(Long) Xây dựng cơ chế phát hiện nội dung/tài liệu trùng lặp.(Long)+
 +(Long) Hoàn thiện Semantic Search.(Long)+
 +(Long) Kiểm thử độ chính xác của kết quả tìm kiếm.(Long)+

### Deliverables

* Semantic Search hoạt động.
* Duplicate Detection hoạt động.
* Vector embeddings được lưu trữ và truy vấn ổn định.

---

## 🎯 Day 2 — Deadline Động & Gamification

**📅 Ngày:** 22/08/2026

### Mục tiêu

Xây dựng hệ thống ưu tiên công việc và tăng động lực học tập thông qua gamification.

### Công việc

+(Long)Thiết kế thuật toán `Priority Score`.
+(Long)Tính toán độ khẩn cấp dựa trên deadline.
+(Long)Kết hợp workload, mức độ quan trọng và thời gian còn lại.
+(Long)Xây dựng UI **Focus Zone**.
+(Long)Tích hợp hệ thống XP.
+(Long)Xây dựng cơ chế tăng XP khi hoàn thành nhiệm vụ.
+(Long)Xây dựng Leaderboard.
+(Long)Kiểm thử logic gamification.

### Deliverables

* Dynamic Priority System.
* Focus Zone UI.
* XP System.
* Leaderboard hoạt động.

---

## 🎨 Day 3 — UI/UX Polish & Material Design 3

**📅 Ngày:** 23/08/2026

### Mục tiêu

Đưa giao diện về trạng thái hoàn thiện, nhất quán và sẵn sàng demo.

### Công việc

+(Long)Chuẩn hóa Design System theo Material Design 3.
+(Long)Đồng bộ typography, spacing và component.
+(Long)Hoàn thiện Dark Mode.
+(Long)Thêm micro-interactions.
+(Long)Thêm loading states và empty states.
+(Long)Kiểm tra responsive trên Mobile.
+(Long)Kiểm tra responsive trên Tablet.
+(Long)Kiểm tra responsive trên Desktop.
+(Long)Fix các lỗi UI/UX còn tồn đọng.

### Deliverables

* UI thống nhất.
* Dark Mode hoàn chỉnh.
* Responsive trên các kích thước màn hình chính.
* Sẵn sàng quay Demo Video.

---

## 🧪 Day 4 — Integration & End-to-End Testing

**📅 Ngày:** 24/08/2026

### Mục tiêu

Kiểm thử toàn bộ luồng sử dụng thực tế của người dùng.

### Critical User Flow

```text
Đăng ký / Đăng nhập
        ↓
Đăng ký môn học
        ↓
Tạo Assignment / Deadline
        ↓
AI phân tích & xếp lịch
        ↓
Hiển thị Priority / Focus Zone
        ↓
Sync Calendar
        ↓
Upload tài liệu
        ↓
AI Search / Vector Search
        ↓
Hoàn thành nhiệm vụ & nhận XP
```

### Công việc

+(Long)Test Authentication Flow.
+(Long)Test Course Registration Flow.
+(Long)Test AI Scheduling.
+(Long)Test Dynamic Deadline.
+(Long)Test Calendar Sync.
+(Long)Test File Upload.
+(Long)Test Vector Search.
+(Long)Test Gamification.
+(Long)Test Error Handling.
+(Long)Fix các critical bugs.

### Deliverables

* Toàn bộ core user flow hoạt động end-to-end.
* Không còn critical bugs.

---

## ⚡ Day 5 — Performance & Security Optimization

**📅 Ngày:** 25/08/2026

### Mục tiêu

Tối ưu hiệu năng, chi phí AI API và bảo mật hệ thống.

### Công việc

+(Long)Cấu hình caching cho AI/Gemini API requests.
+(Long)Tránh gửi lại các request AI không cần thiết.
+(Long)Tối ưu database queries.
+(Long)Kiểm tra index cho các bảng quan trọng.
+(Long)Rà soát Supabase Row Level Security (RLS).
+(Long)Kiểm tra quyền truy cập dữ liệu người dùng.
+(Long)Kiểm tra API keys và environment variables.
+(Long)Test performance trên các luồng chính.

### Deliverables

* API response nhanh hơn.
* Giảm request AI dư thừa.
* Supabase RLS được kiểm tra.
* Không còn API key bị hardcode trong source code.

---

## 📊 Day 6 — Pitch Deck & Video Script

**📅 Ngày:** 26/08/2026

### Mục tiêu

Chuẩn bị toàn bộ nội dung trình bày cho phần đánh giá.

### Pitch Deck — 10 đến 12 Slides

* [ ] Problem.
* [ ] Target Users.
* [ ] Current Pain Points.
* [ ] Solution.
* [ ] Product Overview.
* [ ] Core Features.
* [ ] AI Architecture.
* [ ] Technical Stack.
* [ ] User Journey.
* [ ] Impact / Value Proposition.
* [ ] Future Roadmap.
* [ ] Closing / Call to Action.

### Video Demo

* [ ] Viết kịch bản Demo Video khoảng 3 phút.
* [ ] Xác định từng màn hình cần quay.
* [ ] Viết voiceover.
* [ ] Chuẩn bị phụ đề Anh - Việt.
* [ ] Chuẩn bị dữ liệu demo.

### Deliverables

* Pitch Deck hoàn chỉnh.
* Video Script hoàn chỉnh.
* Demo flow được xác định rõ.

---

## 🎬 Day 7 — Quay & Dựng Video Demo

**📅 Ngày:** 27/08/2026

### Mục tiêu

Hoàn thiện Video Demo giới thiệu sản phẩm.

### Công việc

* [ ] Quay màn hình sản phẩm thực tế.
* [ ] Quay toàn bộ demo flow.
* [ ] Thu âm voiceover.
* [ ] Dựng Video Demo.
* [ ] Thêm phụ đề tiếng Anh.
* [ ] Thêm phụ đề tiếng Việt nếu cần.
* [ ] Thêm intro/outro.
* [ ] Kiểm tra thời lượng khoảng 3 phút.
* [ ] Export phiên bản final.

### Suggested Demo Flow

```text
Problem
   ↓
Introduce Product
   ↓
Create Course / Assignment
   ↓
AI Scheduling
   ↓
Dynamic Priority
   ↓
Focus Zone
   ↓
Calendar Sync
   ↓
Upload Document
   ↓
AI Semantic Search
   ↓
Gamification
   ↓
Closing
```

### Deliverables

* Video Demo hoàn chỉnh.
* Thời lượng khoảng 3 phút.
* Có voiceover và phụ đề.

---

## 🧹 Day 8 — Repository Cleanup & README

**📅 Ngày:** 28/08/2026

### Mục tiêu

Chuẩn bị repository ở trạng thái sẵn sàng review.

### Công việc

* [ ] Clean code.
* [ ] Xóa dead code.
* [ ] Xóa debug logs không cần thiết.
* [ ] Kiểm tra API keys.
* [ ] Kiểm tra `.env`.
* [ ] Cập nhật `.gitignore`.
* [ ] Cập nhật README.
* [ ] Thêm Architecture Overview.
* [ ] Thêm Installation Guide.
* [ ] Thêm Tech Stack.
* [ ] Thêm Screenshots/GIF Demo.
* [ ] Tạo Release cuối cùng.
* [ ] Push code lên GitHub.

### Final Repository Checklist

* [ ] Project chạy được từ hướng dẫn README.
* [ ] Không lộ API keys.
* [ ] Code được tổ chức rõ ràng.
* [ ] README đầy đủ.
* [ ] Các tính năng chính được mô tả.
* [ ] Demo assets được đính kèm nếu cần.

---

## 🚀 Day 9 — Official Submission

**📅 Ngày:** 29/08/2026

### Mục tiêu

Nộp bài sớm để tránh các sự cố kỹ thuật vào phút cuối.

### Submission Checklist

* [ ] Kiểm tra GitHub Repository.
* [ ] Kiểm tra README.
* [ ] Kiểm tra bản Release.
* [ ] Kiểm tra Demo Video.
* [ ] Kiểm tra Pitch Deck.
* [ ] Kiểm tra toàn bộ đường link.
* [ ] Kiểm tra quyền truy cập repository.
* [ ] Chuẩn bị mô tả dự án.
* [ ] Submit bài chính thức.

> ⚠️ **Khuyến nghị:** Không chờ đến phút cuối. Hoàn thành và submit bài trước **23:59 ngày 29/08/2026** để có thời gian xử lý các sự cố như nghẽn mạng, lỗi upload hoặc sai đường link.

---

# 🎯 Sprint Success Criteria

Sprint được xem là thành công khi:

* [ ] Tất cả core features hoạt động.
* [ ] AI Scheduling hoạt động ổn định.
* [ ] Vector Search hoạt động.
* [ ] Dynamic Priority hoạt động.
* [ ] Gamification hoạt động.
* [ ] Calendar Sync hoạt động.
* [ ] File Upload hoạt động.
* [ ] Không còn critical bugs.
* [ ] UI/UX đủ chất lượng để demo.
* [ ] Pitch Deck hoàn chỉnh.
* [ ] Video Demo hoàn chỉnh.
* [ ] GitHub Repository sạch và đầy đủ tài liệu.
* [ ] Bài được submit thành công trước deadline.

---

## 🏁 Final Target

> **29/08/2026 — Product Ready. Demo Ready. Repository Ready. Submission Complete. 🚀**
>>>>>>> e7db44d (Full task day 1)



>>Cấu hình biến môi trường env
```
GEMINI_API_KEY=your_gemini_api_key_here
GCP_PROJECT_ID=your_gcp_project_id
GOOGLE_CLIENT_ID=your_oauth_client_id
```
## 2.2. Luồng xử lý chi tiết (Level 1 DFD)

### 🔄 Luồng 1: Đăng ký môn học và xếp lịch tự động (Smart Scheduler)

Luồng xử lý **Smart Scheduler** được thiết kế nhằm hỗ trợ sinh viên đăng ký môn học và tự động sắp xếp lịch học một cách hợp lý, đồng thời phát hiện và xử lý các xung đột về thời gian.

**Bước 1 – Nhập dữ liệu:**
Sinh viên nhập thông tin về các môn học dự kiến thông qua văn bản hoặc giọng nói trên ứng dụng React.

**Bước 2 – Truy xuất dữ liệu lịch hiện tại:**
Hệ thống lấy dữ liệu lịch học hiện có của sinh viên từ **Supabase Database** và đồng thời truy xuất các sự kiện liên quan từ **Google Calendar API**.

**Bước 3 – Phân tích bằng AI:**
Dữ liệu lịch hiện tại và thông tin môn học mới được gửi đến **Gemini 1.5 API**, trực tiếp từ ứng dụng hoặc thông qua **Supabase Edge Function**. AI sẽ phân tích thời gian học, thời lượng và khả năng xảy ra xung đột giữa các lịch.

**Bước 4 – Kiểm tra và xử lý xung đột:**
Hệ thống thực hiện kiểm tra sự chồng chéo về thời gian (*overlap*).

* Nếu phát hiện xung đột, hệ thống trả về dữ liệu JSON bao gồm các khoảng thời gian bị trùng và đề xuất từ **2–3 phương án xếp lịch thay thế** phù hợp.
* Nếu không xảy ra xung đột, hệ thống trả về JSON xác nhận lịch học mới là hợp lệ.

**Bước 5 – Xác nhận từ người dùng:**
Ứng dụng hiển thị kết quả phân tích và các phương án đề xuất để sinh viên lựa chọn và xác nhận.

**Bước 6 – Lưu trữ và đồng bộ:**
Sau khi người dùng xác nhận, lịch học mới được lưu vào **Supabase Database** và đồng bộ với **Google Calendar** thông qua API.

---

### 📁 Luồng 2: Tải lên và phân loại tài liệu chống trùng lặp (Smart Knowledge Hub)

Luồng **Smart Knowledge Hub** hỗ trợ sinh viên lưu trữ, quản lý và phát hiện các tài liệu trùng lặp nhằm tối ưu dung lượng lưu trữ.

**Bước 1 – Tải tài liệu:**
Sinh viên tải các tài liệu như **PDF, hình ảnh hoặc DOC/DOCX** lên ứng dụng React.

**Bước 2 – Lưu trữ tệp:**
Tệp được tải lên và lưu trữ trong **Supabase Storage Bucket**.

**Bước 3 – Trích xuất và vector hóa nội dung:**
Hệ thống tiến hành trích xuất nội dung từ tài liệu, sau đó gọi API để tạo **Vector Embedding**. Đồng thời, hệ thống tạo các **Metadata** liên quan như tác giả, môn học, nội dung tóm tắt và các thông tin cần thiết khác.

**Bước 4 – Tìm kiếm và so sánh vector:**
Các Vector Embedding được so sánh với dữ liệu hiện có bằng **Vector Search** thông qua **pgvector trên Supabase PostgreSQL**.

* Nếu **Cosine Similarity > 0.90**, hệ thống xác định tài liệu có mức độ tương đồng cao hoặc có khả năng trùng lặp. Khi đó, hệ thống cảnh báo sinh viên và hiển thị liên kết đến tài liệu đã tồn tại nhằm tránh lưu trữ nhiều bản sao.
* Nếu tài liệu có mức độ khác biệt đủ lớn, hệ thống lưu **Metadata** và **Vector Embedding** vào cơ sở dữ liệu để phục vụ cho việc tìm kiếm và phân loại sau này.

---

### ⏳ Luồng 3: Quản lý Deadline động (Dynamic Priority Engine)

Luồng **Dynamic Priority Engine** được xây dựng nhằm tự động đánh giá mức độ ưu tiên của các công việc dựa trên thời gian còn lại và mức độ quan trọng.

**Bước 1 – Nhập công việc:**
Sinh viên tạo một công việc (*Task*) hoặc Deadline và cung cấp các thông tin bao gồm:

* Ngày hết hạn (`due_date`)
* Mức độ quan trọng (`importance_score`) từ **1 đến 5**

**Bước 2 – Tính toán mức độ ưu tiên:**
Priority Engine trên phía Client thực hiện tính toán điểm ưu tiên dựa trên công thức:

$$
\text{Priority Score} =
(\text{Importance} \times w_1)
+
\left(
\frac{1}{\text{Hours Remaining}} \times w_2
\right)
$$

Trong đó:

* **Importance** là mức độ quan trọng của công việc.
* **Hours Remaining** là số giờ còn lại trước thời hạn hoàn thành.
* **$w_1$** và **$w_2$** là các trọng số dùng để điều chỉnh mức độ ảnh hưởng giữa độ quan trọng và tính cấp bách.

**Bước 3 – Tự động nâng mức độ khẩn cấp:**
Các công việc có thời gian còn lại dưới **48 giờ** sẽ được hệ thống tự động tăng mức độ ưu tiên và đưa lên đầu danh sách công việc.

**Bước 4 – Focus Zone:**
Các dự án dài hạn có `importance_score = 5` sẽ luôn được hiển thị trong khu vực **Focus Zone**, giúp sinh viên duy trì sự tập trung đối với những nhiệm vụ có mức độ quan trọng cao.
