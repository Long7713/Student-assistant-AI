export function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getRelativeDateString(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatTime12h(time24: string): string {
  if (!time24) return '';
  return time24; // In Vietnam 24h format like 14:30 or 08:30 is standard and preferred by students
}

export function formatFriendlyDate(dateStr: string): string {
  const today = getTodayString();
  const tomorrow = getRelativeDateString(1);
  const yesterday = getRelativeDateString(-1);

  if (dateStr === today) return 'Hôm nay';
  if (dateStr === tomorrow) return 'Ngày mai';
  if (dateStr === yesterday) return 'Hôm qua';

  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const dayNames = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  const dayName = dayNames[date.getDay()];
  return `${dayName}, ${d}/${m}`;
}

export function formatFullVietnameseDate(d: Date = new Date()): string {
  const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const dayName = dayNames[d.getDay()];
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  return `${dayName}, ${day} tháng ${month}, ${year}`;
}

export function getVietnameseGreeting(): { greeting: string; period: 'morning' | 'afternoon' | 'evening' } {
  const hour = new Date().getHours();
  if (hour < 12) {
    return { greeting: 'Chào buổi sáng', period: 'morning' };
  } else if (hour < 18) {
    return { greeting: 'Chào buổi chiều', period: 'afternoon' };
  } else {
    return { greeting: 'Chào buổi tối', period: 'evening' };
  }
}

export function getDeadlineUrgency(deadlineIso: string): {
  label: string;
  colorClass: string;
  badgeClass: string;
  hoursRemaining: number;
  isUrgent: boolean;
} {
  const now = new Date();
  const deadline = new Date(deadlineIso);
  const diffMs = deadline.getTime() - now.getTime();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));

  if (diffHours < 0) {
    return {
      label: 'Quá hạn',
      colorClass: 'text-rose-600',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
      hoursRemaining: diffHours,
      isUrgent: true,
    };
  }
  if (diffHours <= 24) {
    return {
      label: diffHours <= 1 ? 'Hạn trong 1 giờ' : `Còn ${diffHours} giờ`,
      colorClass: 'text-rose-600',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
      hoursRemaining: diffHours,
      isUrgent: true,
    };
  }
  if (diffHours <= 72) {
    const days = Math.ceil(diffHours / 24);
    return {
      label: `Còn ${days} ngày`,
      colorClass: 'text-amber-600',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
      hoursRemaining: diffHours,
      isUrgent: false,
    };
  }

  const days = Math.ceil(diffHours / 24);
  return {
    label: `Còn ${days} ngày`,
    colorClass: 'text-slate-600',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    hoursRemaining: diffHours,
    isUrgent: false,
  };
}

export function parseMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + (m || 0);
}

export function formatMinutesToDuration(mins: number): string {
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  if (hours === 0) return `${minutes} phút`;
  if (minutes === 0) return `${hours} giờ`;
  return `${hours}g ${minutes}p`;
}
