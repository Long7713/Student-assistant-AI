import { Course, ClassSchedule, StudentPreferences, Task, StudySession } from '../types';
import {
  initialCourses,
  initialClassSchedule,
  initialPreferences,
  initialTasks,
  initialSessions,
} from '../data/initialData';

export const STORAGE_KEYS = {
  COURSES: 'ai_student_courses',
  CLASS_SCHEDULE: 'ai_student_class_schedule',
  PREFERENCES: 'ai_student_preferences',
  TASKS: 'ai_student_tasks',
  SESSIONS: 'ai_student_sessions',
} as const;

/**
 * Safely reads and parses data from localStorage.
 * If not found or if parsing fails, returns the fallback value.
 */
export function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') {
    return fallback;
  }
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) {
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`[storage] Error reading key "${key}" from localStorage:`, error);
    return fallback;
  }
}

/**
 * Safely writes data to localStorage.
 */
export function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`[storage] Error saving key "${key}" to localStorage:`, error);
  }
}

/**
 * Removes a specific key from localStorage.
 */
export function removeFromStorage(key: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`[storage] Error removing key "${key}":`, error);
  }
}

/**
 * Clears all ai_student_* keys and repopulates them with default initial data.
 */
export function resetAllStorageToDefaults() {
  saveToStorage(STORAGE_KEYS.COURSES, initialCourses);
  saveToStorage(STORAGE_KEYS.CLASS_SCHEDULE, initialClassSchedule);
  saveToStorage(STORAGE_KEYS.PREFERENCES, initialPreferences);
  saveToStorage(STORAGE_KEYS.TASKS, initialTasks);
  saveToStorage(STORAGE_KEYS.SESSIONS, initialSessions);

  return {
    courses: initialCourses,
    classSchedule: initialClassSchedule,
    preferences: initialPreferences,
    tasks: initialTasks,
    sessions: initialSessions,
  };
}
