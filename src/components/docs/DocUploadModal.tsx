import { useState, useRef } from "react";
import {
  UploadCloud,
  Sparkles,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Database,
  ExternalLink,
} from "lucide-react";
import { SmartDoc } from "../../types";
import { docsService } from "../../services/docsService";
import { generateUniqueId } from "../../utils/idGenerator";

interface DocUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  docs: SmartDoc[];
  onAddDoc: (doc: SmartDoc) => void;
}

export const DocUploadModal = ({
  isOpen,
  onClose,
  docs,
  onAddDoc,
}: DocUploadModalProps) => {
  const [analyzingWithGemini, setAnalyzingWithGemini] = useState<boolean>(false);
  const [uploadTitle, setUploadTitle] = useState<string>(
    "De_thi_giua_ky_Cau_truc_du_lieu_2025.pdf"
  );
  const [uploadExcerpt, setUploadExcerpt] = useState<string>(
    "Đề thi giữa kỳ môn Cấu trúc Dữ liệu và Giải thuật. Bao gồm bài toán cây nhị phân tìm kiếm BST, xoay cây AVL và bài toán đường đi ngắn nhất Dijkstra đồ thị có trọng số dương."
  );
  const [analysisResult, setAnalysisResult] = useState<{
    metadata: any;
    duplicateCheck: any;
  } | null>(null);

  const uploadAbortRef = useRef<AbortController | null>(null);

  if (!isOpen) return null;

  const handleSimulateSmartUpload = async () => {
    setAnalyzingWithGemini(true);
    setAnalysisResult(null);

    if (uploadAbortRef.current) {
      uploadAbortRef.current.abort();
    }
    uploadAbortRef.current = new AbortController();

    try {
      const data = await docsService.analyzeDocument(
        uploadTitle,
        uploadExcerpt,
        docs.map((d) => ({ id: d.id, title: d.title, subject: d.subject })),
        uploadAbortRef.current.signal
      );

      if (data.success) {
        setAnalysisResult({
          metadata: data.metadata,
          duplicateCheck: data.duplicateCheck,
        });
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("Doc analysis error:", err);
      }
    } finally {
      setAnalyzingWithGemini(false);
    }
  };

  const handleConfirmSaveDoc = () => {
    if (!analysisResult) return;
    const newDoc: SmartDoc = {
      id: generateUniqueId("doc"),
      title: uploadTitle,
      subject: analysisResult.metadata.subject || "Cấu trúc Dữ liệu & Giải thuật",
      subjectCode: "CSE102",
      category: analysisResult.metadata.category || "Đề thi & Lời giải",
      author: analysisResult.metadata.author || "Nam (Sinh viên tải lên)",
      tags: analysisResult.metadata.tags || ["Đề thi", "Môn chuyên ngành"],
      academicYear: "2025-2026",
      summary:
        analysisResult.metadata.summary ||
        "Tài liệu được phân loại tự động bởi Gemini AI.",
      fileSize: "3.2 MB",
      fileType: "pdf",
      uploadDate: "Hôm nay",
      downloads: 1,
      likes: 0,
      gcsUri: `gs://edumind-bucket-vn/uploads/${uploadTitle}`,
    };

    onAddDoc(newDoc);
    onClose();
    setAnalysisResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-lg border border-slate-200 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-slate-800" />
            <h3 className="text-base font-bold text-slate-900">
              Tải Tài Liệu & Phân Tích Thông Minh
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Simulated File Drop */}
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-5 text-center bg-slate-50">
            <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-800">
              Kéo thả tệp PDF, DOCX, PPTX vào đây
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Tự động lưu trữ an toàn trên Google Cloud Storage
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tên tệp tin tải lên:
            </label>
            <input
              type="text"
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-lg p-2.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Trích xuất nội dung văn bản (Excerpt / OCR):
            </label>
            <textarea
              rows={3}
              value={uploadExcerpt}
              onChange={(e) => setUploadExcerpt(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-lg p-2.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <button
            onClick={handleSimulateSmartUpload}
            disabled={analyzingWithGemini}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            {analyzingWithGemini ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-300" />
                <span>Gemini đang trích xuất Metadata & Quét Vector Trùng lặp...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Trích xuất Metadata & Kiểm tra Trùng lặp</span>
              </>
            )}
          </button>

          {/* Analysis Results Display */}
          {analysisResult && (
            <div className="space-y-3 pt-2 border-t border-slate-200 animate-in fade-in">
              {/* Duplicate Warning if matched */}
              {analysisResult.duplicateCheck?.isDuplicate && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-amber-950 flex items-center gap-1.5">
                      <span>Cảnh báo Trùng lặp ({analysisResult.duplicateCheck.similarityScore}%)</span>
                    </div>
                    <p className="mt-0.5 text-amber-800 text-[11px] leading-relaxed">
                      {analysisResult.duplicateCheck.duplicateWith?.matchReason}
                    </p>
                  </div>
                </div>
              )}

              {/* Extracted Metadata Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Metadata Trích xuất bởi Gemini:</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400">Môn học:</span>
                    <p className="font-semibold text-slate-800">
                      {analysisResult.metadata.subject}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Thể loại:</span>
                    <p className="font-semibold text-slate-800">
                      {analysisResult.metadata.category}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400">Tóm tắt tự động:</span>
                    <p className="text-slate-700 italic mt-0.5">
                      "{analysisResult.metadata.summary}"
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleConfirmSaveDoc}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors cursor-pointer shadow-2xs"
              >
                Xác nhận Tải lên Kho Tài Liệu (+50 XP)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
