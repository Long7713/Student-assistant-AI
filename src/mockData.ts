import { Course, SchedulePlan, DeadlineTask, SmartDoc, LeaderboardUser, DRLEvent } from "./types";

export const PERIOD_TIMES = [
  { period: 1, time: "07:00", label: "Tiết 1" },
  { period: 2, time: "07:50", label: "Tiết 2" },
  { period: 3, time: "08:45", label: "Tiết 3" },
  { period: 4, time: "09:35", label: "Tiết 4" },
  { period: 5, time: "10:30", label: "Tiết 5" },
  { period: 6, time: "11:25", label: "Tiết 6" },
  { period: 7, time: "13:00", label: "Tiết 7" },
  { period: 8, time: "13:50", label: "Tiết 8" },
  { period: 9, time: "14:40", label: "Tiết 9" },
  { period: 10, time: "15:45", label: "Tiết 10" },
  { period: 11, time: "16:35", label: "Tiết 11" },
  { period: 12, time: "17:25", label: "Tiết 12" },
];

export const DAYS_OF_WEEK = [
  { day: 2, label: "Thứ 2", short: "T2", isToday: true },
  { day: 3, label: "Thứ 3", short: "T3", isToday: false },
  { day: 4, label: "Thứ 4", short: "T4", isToday: false },
  { day: 5, label: "Thứ 5", short: "T5", isToday: false },
  { day: 6, label: "Thứ 6", short: "T6", isToday: false },
  { day: 7, label: "Thứ 7", short: "T7", isToday: false },
  { day: 8, label: "Chủ Nhật", short: "CN", isToday: false },
];

export const INITIAL_COURSES: Course[] = [
  {
    id: "mth101_1",
    code: "MTH101",
    name: "Cấu trúc Dữ liệu & Giải thuật",
    classCode: "L01 (Sáng T2 & Chiều T4 - CS1)",
    day: 2,
    startPeriod: 6,
    endPeriod: 6,
    room: "A3-401",
    lecturer: "TS. Phan Thanh Sơn",
    campus: "CS1 (Q.10)",
    credits: 4,
    color: "emerald"
  },
  {
    id: "eng201_1",
    code: "ENG201",
    name: "Tiếng Anh Học thuật (Academic English B2)",
    classCode: "L01 (Sáng T3 & Sáng T6 - CS1)",
    day: 3,
    startPeriod: 6,
    endPeriod: 6,
    room: "C2-205",
    lecturer: "Cô Emily Watson / ThS. Lê Bảo Trâm",
    campus: "CS1 (Q.10)",
    credits: 3,
    color: "purple"
  },
  {
    id: "pol101_1",
    code: "POL101",
    name: "Triết học Mác - Lênin",
    classCode: "L01 (Sáng T4 - CS1)",
    day: 4,
    startPeriod: 6,
    endPeriod: 6,
    room: "Hội trường C1",
    lecturer: "TS. Nguyễn Văn Hậu",
    campus: "CS1 (Q.10)",
    credits: 2,
    color: "rose"
  },
  {
    id: "cse102_lab",
    code: "CSE102",
    name: "Cấu trúc Dữ liệu & Giải thuật",
    classCode: "L01 (Lab IT 2 - 4 TC)",
    day: 4,
    startPeriod: 7,
    endPeriod: 9,
    room: "Lab IT 2",
    lecturer: "TS. Phan Thanh Sơn",
    campus: "CS1 (Q.10)",
    credits: 4,
    color: "emerald"
  },
  {
    id: "eng201_2",
    code: "ENG201",
    name: "Tiếng Anh Học thuật (Academic English B2)",
    classCode: "L01 (Sáng T3 & Sáng T6 - CS1)",
    day: 6,
    startPeriod: 6,
    endPeriod: 6,
    room: "C2-205",
    lecturer: "Cô Emily Watson / ThS. Lê Bảo Trâm",
    campus: "CS1 (Q.10)",
    credits: 3,
    color: "purple"
  }
];

export const INITIAL_SCHEDULE_PLANS: SchedulePlan[] = [
  {
    id: "plan-1",
    name: "Phương án 1 (Tiêu chuẩn - Sáng T2 & T4)",
    gpaImpact: "Khuyên dùng • Tối ưu 3.75 GPA",
    description: "Sắp xếp cân bằng giữa lý thuyết và thực hành, không kẹp ca trưa quá 45 phút.",
    courses: INITIAL_COURSES
  },
  {
    id: "plan-2",
    name: "Phương án 2 (Dồn ca sáng 3 ngày)",
    gpaImpact: "Dành cho sinh viên đi thực tập",
    description: "Tập trung học vào Thứ 2, Thứ 3, Thứ 6. Thứ 4 và Thứ 5 trống cả ngày.",
    courses: [
      {
        id: "p2_1",
        code: "MTH101",
        name: "Giải tích 1 (Calculus 1)",
        classCode: "L02",
        day: 2,
        startPeriod: 1,
        endPeriod: 4,
        room: "A3-401",
        lecturer: "PGS. TS. Trần Đình Hưng",
        campus: "CS1 (Q.10)",
        credits: 4,
        color: "blue"
      },
      {
        id: "p2_2",
        code: "CSE102",
        name: "Cấu trúc Dữ liệu & Giải thuật",
        classCode: "L02",
        day: 3,
        startPeriod: 1,
        endPeriod: 4,
        room: "Lab IT 1",
        lecturer: "TS. Phan Thanh Sơn",
        campus: "CS1 (Q.10)",
        credits: 4,
        color: "emerald"
      },
      {
        id: "p2_3",
        code: "POL101",
        name: "Triết học Mác - Lênin",
        classCode: "L02",
        day: 6,
        startPeriod: 2,
        endPeriod: 4,
        room: "Hội trường C1",
        lecturer: "TS. Nguyễn Văn Hậu",
        campus: "CS1 (Q.10)",
        credits: 2,
        color: "rose"
      }
    ]
  }
];

export const INITIAL_DEADLINES: DeadlineTask[] = [
  {
    id: "dl-1",
    title: "Bài tập lớn: Cài đặt cây Đỏ-Đen & Cây AVL",
    courseCode: "CSE102",
    courseName: "Cấu trúc Dữ liệu & Giải thuật",
    dueDate: "2026-08-22T23:59:00",
    hoursLeft: 18, // <48h -> Urgent Focus Zone!
    importance: "high",
    progress: 75,
    xpReward: 150,
    completed: false,
    subtasks: [
      { id: "st-1", title: "Viết hàm xoay cây RotateLeft & RotateRight", completed: true },
      { id: "st-2", title: "Benchmark hiệu năng với 100,000 phần tử ngẫu nhiên", completed: true },
      { id: "st-3", title: "Viết báo cáo PDF và xuất mã nguồn Git", completed: false }
    ]
  },
  {
    id: "dl-2",
    title: "Academic Essay: The Impact of Generative AI on Higher Education",
    courseCode: "ENG201",
    courseName: "Tiếng Anh Học thuật B2",
    dueDate: "2026-08-23T17:00:00",
    hoursLeft: 34, // <48h -> Urgent Focus Zone!
    importance: "high",
    progress: 40,
    xpReward: 120,
    completed: false,
    subtasks: [
      { id: "st-4", title: "Lập dàn ý Outline 4 phần (Intro, 2 Body, Conclusion)", completed: true },
      { id: "st-5", title: "Trích dẫn 3 nguồn học thuật chuẩn APA 7th", completed: false },
      { id: "st-6", title: "Kiểm tra ngữ pháp & nộp trên Turnitin", completed: false }
    ]
  },
  {
    id: "dl-3",
    title: "Đề án Tốt nghiệp / Nghiên cứu khoa học: Hệ thống EduMind AI Agent",
    courseCode: "CAPSTONE",
    courseName: "Dự án Trọng điểm Quốc gia",
    dueDate: "2026-11-15T00:00:00",
    hoursLeft: 2060,
    importance: "high",
    isHighImpactProject: true, // Pinned Focus Zone
    progress: 55,
    xpReward: 500,
    completed: false,
    subtasks: [
      { id: "st-7", title: "Hoàn thiện Kiến trúc Hệ sinh thái Google & PRD", completed: true },
      { id: "st-8", title: "Tích hợp Gemini 3.7 Flash API & Vertex AI Vector Search", completed: true },
      { id: "st-9", title: "Thử nghiệm tải thực tế với 500 sinh viên ĐHQG", completed: false }
    ]
  },
  {
    id: "dl-4",
    title: "Trắc nghiệm lý thuyết Triết học chương 3 & 4",
    courseCode: "POL101",
    courseName: "Triết học Mác - Lênin",
    dueDate: "2026-08-28T20:00:00",
    hoursLeft: 140,
    importance: "medium",
    progress: 10,
    xpReward: 80,
    completed: false,
    subtasks: [
      { id: "st-10", title: "Đọc giáo trình phần Quy luật Giá trị thặng dư", completed: false },
      { id: "st-11", title: "Làm đề thi thử 40 câu trên EduMind", completed: false }
    ]
  },
  {
    id: "dl-5",
    title: "Bài tập tuần 2: Vi phân và Tích phân hàm nhiều biến",
    courseCode: "MTH101",
    courseName: "Giải tích 1",
    dueDate: "2026-08-19T23:59:00",
    hoursLeft: 0,
    importance: "medium",
    progress: 100,
    xpReward: 100,
    completed: true,
    subtasks: [
      { id: "st-12", title: "Giải 10 bài tập SGK", completed: true },
      { id: "st-13", title: "Quét ảnh bài làm tải lên EduMind", completed: true }
    ]
  }
];

export const INITIAL_DOCS: SmartDoc[] = [
  {
    id: "doc-01",
    title: "Tong_hop_De_thi_CTDL_GT_2025_Loi_giai_Chi_tiet.pdf",
    subject: "Cấu trúc Dữ liệu & Giải thuật",
    subjectCode: "CSE102",
    category: "Đề thi & Lời giải",
    author: "CLB Học thuật Khoa CNTT - ĐHBK",
    tags: ["Đề thi cuối kỳ", "Cây AVL", "Đồ thị Dijkstra", "Bảng băm Hash Table"],
    academicYear: "2024-2025",
    summary: "Bộ 12 đề thi học kỳ chính thức kèm lời giải bằng C++ và phân tích độ phức tạp thời gian Big-O.",
    fileSize: "4.8 MB",
    fileType: "pdf",
    uploadDate: "15/08/2026",
    downloads: 1420,
    likes: 389,
    gcsUri: "gs://edumind-bucket-vn/cse102/tong_hop_de_thi_2025.pdf"
  },
  {
    id: "doc-02",
    title: "Giao_trinh_Giai_tich_1_NXB_Dai_hoc_Quoc_gia.pdf",
    subject: "Giải tích 1",
    subjectCode: "MTH101",
    category: "Giáo trình",
    author: "PGS. TS. Trần Đình Hưng",
    tags: ["Giáo trình chính thức", "Giới hạn hàm số", "Chuỗi số", "Tích phân Riemann"],
    academicYear: "2025-2026",
    summary: "Giáo trình chuẩn ĐHQG gồm 6 chương lý thuyết và 300 bài tập có hướng dẫn giải mẫu.",
    fileSize: "12.4 MB",
    fileType: "pdf",
    uploadDate: "02/08/2026",
    downloads: 3100,
    likes: 852,
    gcsUri: "gs://edumind-bucket-vn/mth101/giao_trinh_giai_tich_1.pdf"
  },
  {
    id: "doc-03",
    title: "So_tay_Tu_vung_Academic_English_B2_Band_7.docx",
    subject: "Tiếng Anh Học thuật (Academic English B2)",
    subjectCode: "ENG201",
    category: "Tóm tắt ôn tập",
    author: "Cô Emily Watson & Ban Học tập",
    tags: ["Từ vựng B2", "Collocations", "IELTS Academic", "Writing Task 2"],
    academicYear: "2025-2026",
    summary: "500 từ vựng học thuật theo chủ đề công nghệ, kinh tế, xã hội kèm ví dụ câu chuẩn văn phong học thuật.",
    fileSize: "2.1 MB",
    fileType: "docx",
    uploadDate: "18/08/2026",
    downloads: 980,
    likes: 420,
    gcsUri: "gs://edumind-bucket-vn/eng201/so_tay_b2_vocabulary.docx"
  },
  {
    id: "doc-04",
    title: "Slide_Bai_giang_Triet_hoc_Mac_Lenin_Full_10_Chuong.pptx",
    subject: "Triết học Mác - Lênin",
    subjectCode: "POL101",
    category: "Slide bài giảng",
    author: "Bộ môn Lý luận Chính trị",
    tags: ["Slide chính khóa", "Duy vật biện chứng", "Hình thái kinh tế xã hội"],
    academicYear: "2025-2026",
    summary: "Bộ slide trực quan, sơ đồ tư duy Mindmap giúp nhớ nhanh các quy luật cơ bản để thi trắc nghiệm.",
    fileSize: "18.6 MB",
    fileType: "pptx",
    uploadDate: "10/08/2026",
    downloads: 2450,
    likes: 670,
    gcsUri: "gs://edumind-bucket-vn/pol101/slide_triet_hoc_full.pptx"
  }
];

export const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  {
    rank: 1,
    id: "usr-01",
    name: "Trần Minh Hoàng",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    university: "ĐH Bách Khoa (ĐHQG-HCM)",
    major: "Khoa học Máy tính",
    tier: "Cao Thủ",
    xp: 6840,
    streakDays: 45,
    completedDeadlines: 38,
    gpa: 3.94,
    badges: ["Thần Tốc Nộp Bài", "Kho Tài Liệu VIP", "Streak 45 Days"]
  },
  {
    rank: 2,
    id: "usr-02",
    name: "Lê Nguyễn Thảo Vy",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    university: "ĐH Kinh Tế Quốc Dân (NEU)",
    major: "Kinh tế Đối ngoại",
    tier: "Kim Cương",
    xp: 5920,
    streakDays: 32,
    completedDeadlines: 31,
    gpa: 3.89,
    badges: ["Thủ Khoa K64", "Học Bá Siêu Đẳng"]
  },
  {
    rank: 3,
    id: "usr-03",
    name: "Nguyễn Đăng Quang",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    university: "ĐH Công nghệ Thông tin (UIT)",
    major: "Kỹ thuật Phần mềm",
    tier: "Kim Cương",
    xp: 5410,
    streakDays: 28,
    completedDeadlines: 29,
    gpa: 3.82,
    badges: ["Top 1 Hackathon", "Bug Slayer"]
  },
  {
    rank: 4,
    id: "usr-me",
    name: "Nam (Bạn)",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    university: "Đại học Quốc Gia (ĐHBK - NEU - UIT)",
    major: "Khoa học Dữ liệu & AI",
    tier: "Kim Cương",
    xp: 4850,
    streakDays: 16,
    completedDeadlines: 24,
    gpa: 3.68,
    badges: ["Chiến Thần TKB", "Cày Deadline Đêm"]
  },
  {
    rank: 5,
    id: "usr-05",
    name: "Phạm Hà Linh",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
    university: "ĐH Ngoại Thương (FTU)",
    major: "Logistics & Supply Chain",
    tier: "Bạch Kim",
    xp: 4200,
    streakDays: 21,
    completedDeadlines: 22,
    gpa: 3.75,
    badges: ["Đại Sứ Học Thuật"]
  }
];

export const INITIAL_DRL_EVENTS: DRLEvent[] = [
  {
    id: "drl-01",
    title: "Ngày hội Hiến máu tình nguyện 'Giọt Hồng Bách Khoa'",
    category: "Ý thức cộng đồng & Tình nguyện",
    drlPoints: 10,
    date: "25/08/2026 • 07:30",
    location: "Sảnh A3 - Cơ sở 1 Q.10",
    status: "registered",
    organizer: "Đoàn Thanh niên - Hội Sinh viên"
  },
  {
    id: "drl-02",
    title: "Hội thảo: Ứng dụng Gemini AI & Vertex AI trong Đồ án Sinh viên",
    category: "Học thuật & Nghiên cứu",
    drlPoints: 8,
    date: "29/08/2026 • 14:00",
    location: "Hội trường C1 & Google Meet",
    status: "upcoming",
    organizer: "Google Developer Student Club (GDSC)"
  },
  {
    id: "drl-03",
    title: "Giải Chạy việt dã Sinh viên Khỏe 2026",
    category: "Thể dục thể thao",
    drlPoints: 5,
    date: "05/09/2026 • 06:00",
    location: "Khuôn viên Ký túc xá ĐHQG",
    status: "upcoming",
    organizer: "CLB Thể thao Sinh viên"
  }
];
