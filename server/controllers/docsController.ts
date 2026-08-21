import { Request, Response } from "express";
import { getGeminiClient } from "../config/gemini";
import { DOCS_ANALYSIS_SYSTEM_INSTRUCTION } from "../prompts/docsPrompts";

// Helper: Cosine Similarity
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (normA * normB);
}

// In-memory Vector Store (Simulating pgvector / Vertex AI)
const vectorStore: Record<string, number[]> = {};

async function getEmbedding(text: string): Promise<number[] | null> {
  const ai = getGeminiClient();
  if (!ai) return null;
  try {
    const result = await ai.models.embedContent({
      model: "text-embedding-004",
      contents: text,
    });
    const embedRes = result as any;
    return embedRes.embedding?.values || embedRes.embeddings?.[0]?.values || null;
  } catch (err) {
    console.error("Embedding error:", err);
    return null;
  }
}

const FALLBACK_DOC_ANALYSIS = {
  success: true,
  metadata: {
    title: "Tài liệu ôn tập môn học",
    subject: "Cấu trúc Dữ liệu & Giải thuật",
    category: "Đề thi & Lời giải",
    author: "CLB Học Thuật Khoa CNTT",
    tags: ["Đề cương", "Thuật toán đồ thị", "Cây AVL", "Độ phức tạp O(n)"],
    academicYear: "2025-2026",
    summary:
      "Tổng hợp bài tập lớn và 15 đề thi thử môn Cấu trúc dữ liệu có lời giải chi tiết.",
  },
  duplicateCheck: {
    isDuplicate: true,
    similarityScore: 89,
    duplicateWith: {
      id: "doc-01",
      title: "Tong_hop_De_thi_CTDL_GT_2025.pdf",
      matchReason:
        "Trùng khớp 89% nội dung với tệp đã có trên Google Cloud Storage. Khuyến nghị dùng liên kết cũ để tiết kiệm dung lượng.",
    },
  },
};

export async function analyzeDocHandler(req: Request, res: Response) {
  const { title, excerpt, existingDocs } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    return res.json({
      ...FALLBACK_DOC_ANALYSIS,
      metadata: {
        ...FALLBACK_DOC_ANALYSIS.metadata,
        title: title || FALLBACK_DOC_ANALYSIS.metadata.title,
      },
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `Tài liệu mới: Tiêu đề: "${title}", Nội dung trích xuất: "${excerpt}". Danh sách tệp đã lưu: ${JSON.stringify(
        existingDocs || []
      )}`,
      config: {
        systemInstruction: DOCS_ANALYSIS_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");

    // Vector Similarity & Duplicate Detection
    const contentToEmbed = `${title} ${excerpt} ${parsed.metadata?.summary || ""}`;
    const newEmbedding = await getEmbedding(contentToEmbed);

    if (newEmbedding) {
      let highestSimilarity = 0;
      let mostSimilarDoc: any = null;

      for (const [id, vec] of Object.entries(vectorStore)) {
        const similarity = cosineSimilarity(newEmbedding, vec);
        if (similarity > highestSimilarity) {
          highestSimilarity = similarity;
          mostSimilarDoc = existingDocs?.find((d: any) => d.id === id);
        }
      }

      if (highestSimilarity > 0.9 && mostSimilarDoc) {
        parsed.duplicateCheck = {
          isDuplicate: true,
          similarityScore: Math.round(highestSimilarity * 100),
          duplicateWith: {
            id: mostSimilarDoc.id,
            title: mostSimilarDoc.title,
            matchReason: `Trùng khớp ngữ nghĩa ${Math.round(
              highestSimilarity * 100
            )}% (Vector Similarity Search).`,
          },
        };
      }

      const tempId = `temp-${Date.now()}`;
      vectorStore[tempId] = newEmbedding;
    }

    return res.json({ success: true, ...parsed });
  } catch (error: any) {
    console.error("Gemini doc analyze error:", error);
    return res.json({
      ...FALLBACK_DOC_ANALYSIS,
      metadata: {
        ...FALLBACK_DOC_ANALYSIS.metadata,
        title: title || FALLBACK_DOC_ANALYSIS.metadata.title,
      },
    });
  }
}

export async function semanticSearchHandler(req: Request, res: Response) {
  const { query, docs } = req.body;
  if (!query || !docs || docs.length === 0) {
    return res.json({ success: true, results: docs || [] });
  }

  const queryEmbedding = await getEmbedding(query);

  if (!queryEmbedding) {
    return res.json({ success: true, results: docs });
  }

  try {
    const scoredDocs = await Promise.all(
      docs.map(async (doc: any) => {
        const docText = `${doc.title} ${doc.summary} ${doc.subject} ${(
          doc.tags || []
        ).join(" ")}`;
        const docEmbedding = await getEmbedding(docText);
        if (!docEmbedding) {
          return { ...doc, score: 0.5 };
        }
        const score = cosineSimilarity(queryEmbedding, docEmbedding);
        return { ...doc, score };
      })
    );

    scoredDocs.sort((a: any, b: any) => (b.score || 0) - (a.score || 0));
    return res.json({ success: true, results: scoredDocs });
  } catch (error) {
    console.error("Semantic search error:", error);
    return res.json({ success: true, results: docs });
  }
}
