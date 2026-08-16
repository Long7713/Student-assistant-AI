export interface ColorScheme {
  bg: string;
  border: string;
  text: string;
  badgeBg: string;
  badgeText: string;
  ring: string;
  dot: string;
  lightBg: string;
  darkBg: string;
}

export const courseColorMap: Record<string, ColorScheme> = {
  indigo: {
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    border: 'border-indigo-200 dark:border-indigo-800',
    text: 'text-indigo-900 dark:text-indigo-200',
    badgeBg: 'bg-indigo-100 dark:bg-indigo-900/60',
    badgeText: 'text-indigo-800 dark:text-indigo-300',
    ring: 'ring-indigo-500',
    dot: 'bg-indigo-600 dark:bg-indigo-400',
    lightBg: 'bg-indigo-50/80',
    darkBg: 'dark:bg-indigo-950/50',
  },
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'border-emerald-200 dark:border-emerald-800',
    text: 'text-emerald-900 dark:text-emerald-200',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-900/60',
    badgeText: 'text-emerald-800 dark:text-emerald-300',
    ring: 'ring-emerald-500',
    dot: 'bg-emerald-600 dark:bg-emerald-400',
    lightBg: 'bg-emerald-50/80',
    darkBg: 'dark:bg-emerald-950/50',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-900 dark:text-amber-200',
    badgeBg: 'bg-amber-100 dark:bg-amber-900/60',
    badgeText: 'text-amber-800 dark:text-amber-300',
    ring: 'ring-amber-500',
    dot: 'bg-amber-600 dark:bg-amber-400',
    lightBg: 'bg-amber-50/80',
    darkBg: 'dark:bg-amber-950/50',
  },
  rose: {
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    border: 'border-rose-200 dark:border-rose-800',
    text: 'text-rose-900 dark:text-rose-200',
    badgeBg: 'bg-rose-100 dark:bg-rose-900/60',
    badgeText: 'text-rose-800 dark:text-rose-300',
    ring: 'ring-rose-500',
    dot: 'bg-rose-600 dark:bg-rose-400',
    lightBg: 'bg-rose-50/80',
    darkBg: 'dark:bg-rose-950/50',
  },
  sky: {
    bg: 'bg-sky-50 dark:bg-sky-950/40',
    border: 'border-sky-200 dark:border-sky-800',
    text: 'text-sky-900 dark:text-sky-200',
    badgeBg: 'bg-sky-100 dark:bg-sky-900/60',
    badgeText: 'text-sky-800 dark:text-sky-300',
    ring: 'ring-sky-500',
    dot: 'bg-sky-600 dark:bg-sky-400',
    lightBg: 'bg-sky-50/80',
    darkBg: 'dark:bg-sky-950/50',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    border: 'border-purple-200 dark:border-purple-800',
    text: 'text-purple-900 dark:text-purple-200',
    badgeBg: 'bg-purple-100 dark:bg-purple-900/60',
    badgeText: 'text-purple-800 dark:text-purple-300',
    ring: 'ring-purple-500',
    dot: 'bg-purple-600 dark:bg-purple-400',
    lightBg: 'bg-purple-50/80',
    darkBg: 'dark:bg-purple-950/50',
  },
};

export function getCourseColor(colorName?: string): ColorScheme {
  if (!colorName || !courseColorMap[colorName]) {
    return courseColorMap.indigo;
  }
  return courseColorMap[colorName];
}
