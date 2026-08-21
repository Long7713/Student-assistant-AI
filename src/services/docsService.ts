import { apiClient } from "./apiClient";
import { DocAnalyzeResponse, SemanticSearchResponse, SmartDoc } from "../types";

export const docsService = {
  async analyzeDocument(
    title: string,
    excerpt: string,
    existingDocs: { id: string; title: string; subject: string }[],
    signal?: AbortSignal
  ): Promise<DocAnalyzeResponse> {
    return apiClient<DocAnalyzeResponse>("/api/gemini/doc-analyze", {
      method: "POST",
      body: JSON.stringify({ title, excerpt, existingDocs }),
      signal,
    });
  },

  async semanticSearch(
    query: string,
    docs: SmartDoc[],
    signal?: AbortSignal
  ): Promise<SemanticSearchResponse> {
    return apiClient<SemanticSearchResponse>("/api/gemini/semantic-search", {
      method: "POST",
      body: JSON.stringify({ query, docs }),
      signal,
    });
  },
};
