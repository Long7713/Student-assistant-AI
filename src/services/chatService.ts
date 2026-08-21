import { apiClient } from "./apiClient";
import { ChatResponse } from "../types";

export interface ChatContext {
  gpa: number;
  drl: number;
  streak: number;
  school?: string;
  userName?: string;
  [key: string]: any;
}

export const chatService = {
  async sendMessage(
    message: string,
    context: ChatContext,
    signal?: AbortSignal
  ): Promise<ChatResponse> {
    return apiClient<ChatResponse>("/api/gemini/chat", {
      method: "POST",
      body: JSON.stringify({ message, context }),
      signal,
    });
  },
};
