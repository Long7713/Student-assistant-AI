export interface Course {
  id: string;
  code: string;
  name: string;
  classCode: string;
  day: number; // 2 = Thứ 2, 3 = Thứ 3, ..., 7 = Thứ 7, 8 = CN
  startPeriod: number; // 1 to 12
  endPeriod: number;
  room: string;
  lecturer: string;
  campus: string;
  credits: number;
  color: "emerald" | "teal" | "purple" | "rose" | "blue" | "amber" | "indigo";
  note?: string;
  isOnline?: boolean;
}

export interface SchedulePlan {
  id: string;
  name: string;
  gpaImpact: string;
  description: string;
  courses: Course[];
}

export interface DeadlineTask {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  dueDate: string; // ISO or relative
  hoursLeft: number;
  importance: "high" | "medium" | "low";
  isHighImpactProject?: boolean; // Pinned in Focus Zone (e.g. Đồ án, NCKH)
  progress: number; // 0 - 100
  subtasks: { id: string; title: string; completed: boolean }[];
  xpReward: number;
  completed: boolean;
}

export interface SmartDoc {
  id: string;
  title: string;
  subject: string;
  subjectCode: string;
  category: "Đề thi & Lời giải" | "Slide bài giảng" | "Giáo trình" | "Tóm tắt ôn tập";
  author: string;
  tags: string[];
  academicYear: string;
  summary: string;
  fileSize: string;
  fileType: "pdf" | "docx" | "pptx";
  uploadDate: string;
  downloads: number;
  likes: number;
  gcsUri: string;
  embeddingVectorId?: string;
}

export interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  university: string;
  major: string;
  tier: "Đồng" | "Bạc" | "Vàng" | "Bạch Kim" | "Kim Cương" | "Cao Thủ";
  xp: number;
  streakDays: number;
  completedDeadlines: number;
  gpa: number;
  badges: string[];
}

export interface DRLEvent {
  id: string;
  title: string;
  category: string;
  drlPoints: number;
  date: string;
  location: string;
  status: "upcoming" | "registered" | "completed";
  organizer: string;
}
