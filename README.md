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

```mermaid
graph TD
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
---
```
## 📅 Lịch Triển Khai Chi Tiết

| Ngày & Thời Gian | Hạng Mục Công Việc | Chi Tiết Thực Hiện | Deliverables / Output |
| :--- | :--- | :--- | :--- |
| **Day 1**<br>*(14/08/2026)* | **Khởi tạo & Kiến trúc** | - Thiết lập Repo Github, Flutter/React Native base project.<br>- Khởi tạo Firebase Project & Google Cloud Platform (GCP) Console.<br>- Thiết kế Database Schema trên Firestore (Users, Schedules, Tasks, Docs). | - Base Source Code Structure.<br>- Firestore Database Rules & Collection Schema. |
| **Day 2**<br>*(15/08/2026)* | **Authentication & Calendar API** | - Tích hợp Google Sign-In.<br>- Cấu hình OAuth2 for Google Calendar API.<br>- Viết Service đọc/ghi sự kiện lên Google Calendar người dùng. | - Đăng nhập Google thành công.<br>- Sync 2 chiều giữa App và Google Calendar. |
| **Day 3**<br>*(16/08/2026)* | **Quản lý Lịch học (UI Core)** | - Màn hình Lịch di động (Daily / Weekly / Monthly View).<br>- Chức năng CRUD giờ học do sinh viên tự nhập & chỉnh sửa linh hoạt.<br>- Cảnh báo trực quan màu sắc cho giờ gốc vs giờ đã chỉnh sửa. | - Màn hình Calendar chạy mượt trên Mobile.<br>- Người dùng thêm/sửa/xóa buổi học thành công. |
| **Day 4**<br>*(17/08/2026)* | **Tích hợp Gemini 1.5 - Parser** | - Kết nối Gemini API Key qua Firebase Vertex AI SDK / REST API.<br>- Viết prompt cho Gemini đọc input đăng ký môn thô (Natural Text -> Clean JSON). | - API Service parse tin nhắn đăng ký môn thành JSON dữ liệu. |
| **Day 5**<br>*(18/08/2026)* | **Gemini Xếp Lịch & Check Trùng** | - Áp dụng System Prompt xếp lịch.<br>- Xử lý logic phát hiện trùng giờ và trả về 2-3 phương án tự động xếp lịch. | - AI trả lời thời gian thực, hiển thị các lựa chọn lịch gợi ý lên UI để sinh viên click chọn. |
| **Day 6**<br>*(19/08/2026)* | **Thuật toán Deadline Động** | - Xây dựng UI danh sách Deadline dạng Kanban / Priority List.<br>- Cài đặt thuật toán ưu tiên theo Thời gian còn lại + Độ quan trọng.<br>- Xây dựng khu vực "Focus Zone" cho dự án dài hạn. | - Danh sách Deadline tự động nhảy thứ tự theo thời gian thực.<br>- Sub-tasks checklist hoạt động. |
| **Day 7**<br>*(20/08/2026)* | **Kho Tài liệu & Google Cloud Storage** | - Tích hợp UI Upload File (PDF, DOCX, Image).<br>- Tải file lên Google Cloud Storage Bucket.<br>- Lưu trữ metadata ban đầu vào Firestore. | - File upload thành công lên GCS Bucket.<br>- Hiển thị danh sách file theo danh mục/tác giả. |
| **Day 8**<br>*(21/08/2026)* | **AI Chống Trùng Lặp & Vector Search** | - Tích hợp Vertex AI Text Embeddings API.<br>- Tạo embedding cho file mới và so sánh Cosine Similarity với kho hiện tại.<br>- Cảnh báo trùng lặp file trước khi ghi đè. | - Feature cảnh báo trùng lặp tài liệu hoạt động chính xác.<br>- Tìm kiếm tài liệu bằng ngữ nghĩa (Semantic Search). |
| **Day 9**<br>*(22/08/2026)* | **Gamification & Leaderboard** | - Thiết kế công thức cộng điểm XP (Hoàn thành deadline, đóng góp tài liệu).<br>- Xây dựng Bảng xếp hạng (Rank Tuần/Tháng) hiển thị thứ hạng bạn bè.<br>- Hệ thống Badge/Huy hiệu thành tích. | - Màn hình Leaderboard cập nhật XP realtime.<br>- Thông báo chúc mừng khi lên cấp. |
| **Day 10**<br>*(23/08/2026)* | **UI/UX Polish & Dark Mode** | - Chuẩn hóa Material Design 3 / Google Theme.<br>- Hỗ trợ Dark Mode, Responsive layout cho nhiều kích thước màn hình.<br>- Thêm micro-animations khi hoàn thành task. | - App đạt chuẩn UI/UX thẩm mỹ cao.<br>- Trải nghiệm mượt mà không bị giật lag. |
| **Day 11**<br>*(24/08/2026)* | **Integration & End-to-End Testing** | - Kiểm thử toàn bộ luồng từ Đăng ký môn -> AI xếp lịch -> Sync Calendar -> Làm Deadline -> Tích điểm.<br>- Xử lý các edge cases (mất mạng, token hết hạn, input AI bất thường). | - Bản Build APK/iOS mượt mà, hạn chế tối đa crash/error. |
| **Day 12**<br>*(25/08/2026)* | **Tối ưu hóa Chi phí GCP & Performance** | - Cấu hình Caching cho Gemini API requests.<br>- Tối ưu hóa Security Rules cho Firestore & Cloud Storage.<br>- Giảm dung lượng file build. | - Báo cáo performance & ngân sách API khả thi. |
| **Day 13**<br>*(26/08/2026)* | **Quay Video Demo & Làm Slide Pitch** | - Quay Video Demo 3 phút thể hiện nổi bật 5 chức năng cốt lõi và hệ sinh thái Google.<br>- Soạn thảo Slide thuyết trình tập trung vào bài toán sinh viên & giá trị AI. | - Video Demo HD có phụ đề.<br>- Slide Pitch Deck chuyên nghiệp. |
| **Day 14**<br>*(27/08 - 29/08)* | **Rà soát & Nộp Bài Cuộc Thi** | - Kiểm tra toàn bộ link Github, tài liệu README, Video Demo.<br>- Dự phòng khắc phục sự cố hệ thống submission (nếu có).<br>- Nộp bài lên Portal cuộc thi Google AI / Hackathon. | - **Hoàn tất thủ tục nộp bài chính thức trước ngày 30/08/2026.** |



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
