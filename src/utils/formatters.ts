/**
 * Utility functions for formatting dates, numbers and text
 */

export function formatRelativeHours(hours: number): string {
  if (hours <= 0) return "Đã hết hạn";
  if (hours < 24) return `Còn ${hours} giờ`;
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return remainingHours > 0 ? `Còn ${days} ngày ${remainingHours}h` : `Còn ${days} ngày`;
}

export function formatCurrentTime(): string {
  return new Date().toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatGpa(gpa: number): string {
  return gpa.toFixed(2);
}
