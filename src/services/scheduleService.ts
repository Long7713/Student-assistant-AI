import { apiClient } from "./apiClient";
import { Course, ScheduleOptimizerResponse } from "../types";

export const scheduleService = {
  async optimizeSchedule(
    prompt: string,
    currentCourses: Course[],
    signal?: AbortSignal
  ): Promise<ScheduleOptimizerResponse> {
    return apiClient<ScheduleOptimizerResponse>("/api/gemini/optimize-schedule", {
      method: "POST",
      body: JSON.stringify({ prompt, currentCourses }),
      signal,
    });
  },
};
