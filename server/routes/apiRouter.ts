import { Router } from "express";
import { optimizeScheduleHandler } from "../controllers/scheduleController";
import { analyzeDocHandler, semanticSearchHandler } from "../controllers/docsController";
import { chatHandler } from "../controllers/chatController";

export const apiRouter = Router();

// 1. Schedule Optimization Route
apiRouter.post("/gemini/optimize-schedule", optimizeScheduleHandler);

// 2. Documents Analysis & Semantic Search Routes
apiRouter.post("/gemini/doc-analyze", analyzeDocHandler);
apiRouter.post("/gemini/semantic-search", semanticSearchHandler);

// 3. Gen Z AI Chatbot Route
apiRouter.post("/gemini/chat", chatHandler);

// 4. Health Check Route
apiRouter.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "EduMind AI Server",
    timestamp: new Date().toISOString(),
  });
});
