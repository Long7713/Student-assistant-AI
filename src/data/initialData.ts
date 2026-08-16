import { Course, ClassSchedule, StudentPreferences, Task, StudySession } from '../types';
import { getTodayString, getRelativeDateString } from '../utils/dateUtils';

const today = getTodayString();
const tomorrow = getRelativeDateString(1);
const in2Days = getRelativeDateString(2);
const in3Days = getRelativeDateString(3);
const in4Days = getRelativeDateString(4);

export const initialCourses: Course[] = [
  {
    id: 'c1',
    code: 'CS 189',
    name: 'Nhập môn Học máy (Machine Learning)',
    color: 'indigo',
    credits: 4,
    professor: 'TS. Nguyễn Văn Hùng',
  },
  {
    id: 'c2',
    code: 'MAT 126',
    name: 'Xác suất & Quá trình ngẫu nhiên',
    color: 'emerald',
    credits: 4,
    professor: 'PGS. Trần Thị Mai',
  },
  {
    id: 'c3',
    code: 'DATA 100',
    name: 'Nguyên lý Khoa học Dữ liệu',
    color: 'amber',
    credits: 4,
    professor: 'TS. Lê Hoàng Nam',
  },
  {
    id: 'c4',
    code: 'PHI 132',
    name: 'Triết học & Tư duy AI',
    color: 'rose',
    credits: 3,
    professor: 'TS. Vũ Minh Trí',
  },
];

export const initialClassSchedule: ClassSchedule[] = [
  // Thứ 2 (1) & Thứ 4 (3)
  {
    id: 'cs1',
    courseId: 'c1',
    dayOfWeek: 1,
    startTime: '10:00',
    endTime: '11:30',
    location: 'Giảng đường H1 - 201',
    type: 'lecture',
  },
  {
    id: 'cs2',
    courseId: 'c2',
    dayOfWeek: 1,
    startTime: '13:00',
    endTime: '14:00',
    location: 'Phòng B4 - 302',
    type: 'discussion',
  },
  {
    id: 'cs3',
    courseId: 'c1',
    dayOfWeek: 3,
    startTime: '10:00',
    endTime: '11:30',
    location: 'Giảng đường H1 - 201',
    type: 'lecture',
  },
  {
    id: 'cs4',
    courseId: 'c2',
    dayOfWeek: 3,
    startTime: '13:00',
    endTime: '14:00',
    location: 'Phòng B4 - 302',
    type: 'discussion',
  },
  // Thứ 3 (2) & Thứ 5 (4)
  {
    id: 'cs5',
    courseId: 'c3',
    dayOfWeek: 2,
    startTime: '11:00',
    endTime: '12:30',
    location: 'Phòng C1 - 105',
    type: 'lecture',
  },
  {
    id: 'cs6',
    courseId: 'c4',
    dayOfWeek: 2,
    startTime: '15:00',
    endTime: '16:30',
    location: 'Giảng đường A3',
    type: 'lecture',
  },
  {
    id: 'cs7',
    courseId: 'c3',
    dayOfWeek: 4,
    startTime: '11:00',
    endTime: '12:30',
    location: 'Phòng C1 - 105',
    type: 'lecture',
  },
  {
    id: 'cs8',
    courseId: 'c4',
    dayOfWeek: 4,
    startTime: '15:00',
    endTime: '16:30',
    location: 'Giảng đường A3',
    type: 'lecture',
  },
  // Thứ 6 (5)
  {
    id: 'cs9',
    courseId: 'c1',
    dayOfWeek: 5,
    startTime: '14:00',
    endTime: '16:00',
    location: 'Lab Máy tính 502',
    type: 'lab',
  },
];

export const initialPreferences: StudentPreferences = {
  name: 'Minh Khoa',
  major: 'Khoa học Máy tính & Dữ liệu',
  university: 'Đại học Bách Khoa',
  studyWindows: [
    {
      id: 'sw1',
      label: 'Tập trung sáng sớm',
      start: '08:30',
      end: '10:00',
      days: [1, 2, 3, 4, 5],
    },
    {
      id: 'sw2',
      label: 'Deep Work buổi chiều',
      start: '14:30',
      end: '17:30',
      days: [1, 2, 3, 4, 5],
    },
    {
      id: 'sw3',
      label: 'Khung giờ tối',
      start: '19:30',
      end: '22:00',
      days: [0, 1, 2, 3, 4, 5, 6],
    },
  ],
  maxDailyStudyHours: 5.5,
  preferredSessionLength: 90,
  breakLength: 15,
  peakFocusTime: 'afternoon',
  isOnboarded: true,
};

export const initialTasks: Task[] = [
  {
    id: 't1',
    courseId: 'c1',
    title: 'Ôn thi giữa kỳ: SVM & Tối ưu hóa Gradient Descent',
    description: 'Luyện đề thi các năm trước 2023-2025, chứng minh hàm mất mát và Kernel Trick',
    type: 'exam_prep',
    deadline: `${in2Days}T23:59`,
    estimatedMinutes: 240, // 4 hours
    completedMinutes: 75,
    priority: 'high',
    difficulty: 5,
    status: 'in_progress',
    subtasks: [
      { id: 'st1', title: 'Chứng minh bài toán đối ngẫu Soft-margin SVM', completed: true },
      { id: 'st2', title: 'Định lý Mercer và các dạng Kernel phổ biến', completed: false },
      { id: 'st3', title: 'Làm đề thi thử 2024 có bấm giờ 90 phút', completed: false },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 't2',
    courseId: 'c2',
    title: 'Bài tập 4: Chuỗi Markov & Phân phối dừng',
    description: 'Ma trận chuyển trạng thái, trạng thái hấp thu và định lý hội tụ',
    type: 'assignment',
    deadline: `${in3Days}T21:00`,
    estimatedMinutes: 180, // 3 hours
    completedMinutes: 0,
    priority: 'high',
    difficulty: 4,
    status: 'not_started',
    subtasks: [
      { id: 'st4', title: 'Bài 1-3: Bài toán Người đánh bạc phá sản (Gambler Ruin)', completed: false },
      { id: 'st5', title: 'Bài 4-5: Mô hình Random Walk thuật toán PageRank', completed: false },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 't3',
    courseId: 'c3',
    title: 'Project 1: Dự đoán giá nhà bằng Hồi quy Ridge & Lasso',
    description: 'Tiền xử lý dữ liệu, chuẩn hóa đặc trưng và kiểm định chéo K-fold',
    type: 'project',
    deadline: `${in4Days}T23:59`,
    estimatedMinutes: 270, // 4.5 hours
    completedMinutes: 0,
    priority: 'medium',
    difficulty: 3,
    status: 'not_started',
    subtasks: [
      { id: 'st6', title: 'Xử lý dữ liệu khuyết & mã hóa One-Hot đặc trưng phân loại', completed: false },
      { id: 'st7', title: 'Huấn luyện mô hình Baseline so với Ridge Regression', completed: false },
      { id: 'st8', title: 'Viết báo cáo đánh giá hiện tượng Overfitting', completed: false },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 't4',
    courseId: 'c4',
    title: 'Đọc tài liệu: Thí nghiệm Căn phòng tiếng Trung (Chinese Room)',
    description: 'Bài luận của John Searle về ý thức nhân tạo và phản biện triết học',
    type: 'reading',
    deadline: `${in4Days}T18:00`,
    estimatedMinutes: 75,
    completedMinutes: 0,
    priority: 'low',
    difficulty: 2,
    status: 'not_started',
    subtasks: [
      { id: 'st9', title: 'Đọc bài báo gốc trang 417 - 440', completed: false },
      { id: 'st10', title: 'Chuẩn bị 2 câu hỏi thảo luận trên lớp', completed: false },
    ],
    createdAt: new Date().toISOString(),
  },
];

export const initialSessions: StudySession[] = [
  // Phiên học hôm nay
  {
    id: 's1',
    taskId: 't1',
    date: today,
    startTime: '08:30',
    endTime: '09:45',
    durationMinutes: 75,
    status: 'completed',
    goal: 'Ôn tập hàm mất mát & công thức bài toán đối ngẫu SVM',
  },
  {
    id: 's2',
    taskId: 't1',
    date: today,
    startTime: '14:30',
    endTime: '16:00',
    durationMinutes: 90,
    status: 'scheduled',
    goal: 'Luyện dạng bài Kernel Trick & giải nửa đầu đề thi thử 2024',
  },
  {
    id: 's3',
    taskId: 't4',
    date: today,
    startTime: '16:15',
    endTime: '17:15',
    durationMinutes: 60,
    status: 'scheduled',
    goal: 'Đọc tài liệu Triết học phần 1-3 và ghi chú các luận điểm chính',
  },
  {
    id: 's4',
    taskId: 't2',
    date: today,
    startTime: '19:30',
    endTime: '21:00',
    durationMinutes: 90,
    status: 'scheduled',
    goal: 'Làm bài tập 1, 2, 3 môn Xác suất thống kê',
  },

  // Phiên học ngày mai
  {
    id: 's5',
    taskId: 't1',
    date: tomorrow,
    startTime: '08:30',
    endTime: '10:00',
    durationMinutes: 90,
    status: 'scheduled',
    goal: 'Bấm giờ giải đề thi mẫu Học máy 2024 (90 phút)',
  },
  {
    id: 's6',
    taskId: 't2',
    date: tomorrow,
    startTime: '14:30',
    endTime: '16:00',
    durationMinutes: 90,
    status: 'scheduled',
    goal: 'Hoàn thành bài tập 4 & 5 thuật toán PageRank',
  },
  {
    id: 's7',
    taskId: 't3',
    date: tomorrow,
    startTime: '19:30',
    endTime: '21:00',
    durationMinutes: 90,
    status: 'scheduled',
    goal: 'Viết code tiền xử lý dữ liệu và vẽ biểu đồ phân phối',
  },

  // Phiên học 2 ngày nữa
  {
    id: 's8',
    taskId: 't3',
    date: in2Days,
    startTime: '14:30',
    endTime: '16:30',
    durationMinutes: 120,
    status: 'scheduled',
    goal: 'Huấn luyện mô hình Ridge & tinh chỉnh siêu tham số Alpha',
  },
];
