import { useState, useEffect } from "react";
import { 
  BookOpen, 
  Search, 
  UploadCloud, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Download, 
  Tag, 
  Layers, 
  Sparkles, 
  HardDrive,
  Database,
  ExternalLink,
  Loader2,
  FileCode
} from "lucide-react";
import { SmartDoc } from "../types";

interface DocsViewProps {
  docs: SmartDoc[];
  onAddDoc: (doc: SmartDoc) => void;
}

export const DocsView = ({ docs, onAddDoc }: DocsViewProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả");
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false);

  // Semantic Search states
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [semanticResults, setSemanticResults] = useState<SmartDoc[] | null>(null);
  
  // Upload simulation states
  const [uploadingFile, setUploadingFile] = useState<boolean>(false);
  const [analyzingWithGemini, setAnalyzingWithGemini] = useState<boolean>(false);
  const [uploadTitle, setUploadTitle] = useState<string>("De_thi_giua_ky_Cau_truc_du_lieu_2025.pdf");
  const [uploadExcerpt, setUploadExcerpt] = useState<string>(
    "Đề thi giữa kỳ môn Cấu trúc Dữ liệu và Giải thuật. Bao gồm bài toán cây nhị phân tìm kiếm BST, xoay cây AVL và bài toán đường đi ngắn nhất Dijkstra đồ thị có trọng số dương."
  );
  const [analysisResult, setAnalysisResult] = useState<{
    metadata: any;
    duplicateCheck: any;
  } | null>(null);

  const categories = ["Tất cả", "Đề thi & Lời giải", "Giáo trình", "Slide bài giảng", "Tóm tắt ôn tập"];

  // Semantic Search Effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSemanticResults(null);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch("/api/gemini/semantic-search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: searchQuery, docs }),
        });
        const data = await response.json();
        if (data.success) {
          setSemanticResults(data.results);
        }
      } catch (err) {
        console.error("Semantic search failed:", err);
      } finally {
        setIsSearching(false);
      }
    }, 600); // 600ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery, docs]);

  // Filter docs by search and category
  const getFilteredDocs = () => {
    const baseDocs = semanticResults && searchQuery.trim() ? semanticResults : docs;
    
    return baseDocs.filter((doc) => {
      const matchesCategory = selectedCategory === "Tất cả" || doc.category === selectedCategory;
      
      // If we have semantic results, we don't need keyword matching anymore
      if (semanticResults && searchQuery.trim()) return matchesCategory;

      const matchesSearch =
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        doc.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  };

  const filteredDocs = getFilteredDocs();

  const handleSimulateSmartUpload = async () => {
    setAnalyzingWithGemini(true);
    setAnalysisResult(null);

    try {
      const response = await fetch("/api/gemini/doc-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: uploadTitle,
          excerpt: uploadExcerpt,
          existingDocs: docs.map((d) => ({ id: d.id, title: d.title, subject: d.subject })),
        }),
      });

      const data = await response.json();
      if (data.success) {
        setAnalysisResult({
          metadata: data.metadata,
          duplicateCheck: data.duplicateCheck,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzingWithGemini(false);
    }
  };

  const handleConfirmSaveDoc = () => {
    if (!analysisResult) return;
    const newDoc: SmartDoc = {
      id: `doc-${Date.now()}`,
      title: uploadTitle,
      subject: analysisResult.metadata.subject || "Cấu trúc Dữ liệu & Giải thuật",
      subjectCode: "CSE102",
      category: analysisResult.metadata.category || "Đề thi & Lời giải",
      author: analysisResult.metadata.author || "Nam (Sinh viên tải lên)",
      tags: analysisResult.metadata.tags || ["Đề thi", "Môn chuyên ngành"],
      academicYear: "2025-2026",
      summary: analysisResult.metadata.summary || "Tài liệu được phân loại tự động bởi Gemini AI.",
      fileSize: "3.2 MB",
      fileType: "pdf",
      uploadDate: "Hôm nay",
      downloads: 1,
      likes: 0,
      gcsUri: `gs://edumind-bucket-vn/uploads/${uploadTitle}`,
    };

    onAddDoc(newDoc);
    setUploadModalOpen(false);
    setAnalysisResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: GCS & Semantic Search Info */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Kho Tài Liệu Thông Minh & Google Cloud Storage
            </h2>
            <span className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-slate-200">
              Vertex AI Vector Search
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Lưu trữ Google Cloud Storage, trích xuất metadata và chống trùng lặp bộ nhớ bằng Gemini AI
          </p>
        </div>

        <button
          onClick={() => {
            setUploadModalOpen(true);
            setAnalysisResult(null);
          }}
          className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
        >
          <UploadCloud className="w-4 h-4 text-emerald-400" />
          <span>Tải Lên & Quét Trùng Bằng AI</span>
        </button>
      </div>

      {/* Cloud Quota & Vector Search Status Widget */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <HardDrive className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Dung lượng GCS Bucket</div>
            <div className="text-sm font-bold text-slate-900">4.2 GB / 15 GB (28%)</div>
            <div className="text-[10px] text-emerald-600 font-medium">Tiết kiệm 1.8 GB nhờ AI De-duplication</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Vector Search Index</div>
            <div className="text-sm font-bold text-slate-900">768-dim Embeddings Active</div>
            <div className="text-[10px] text-slate-500 font-medium">Độ trễ tìm kiếm ngữ nghĩa &lt; 45ms</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Điểm thưởng đóng góp</div>
            <div className="text-sm font-bold text-slate-900">+50 XP / Tài liệu hợp lệ</div>
            <div className="text-[10px] text-slate-500 font-medium">Đã nhận: +250 XP từ cộng đồng</div>
          </div>
        </div>
      </div>

      {/* Semantic Search Bar & Filters */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm ngữ nghĩa (ví dụ: 'Tìm tài liệu nói về thuật toán Dijkstra môn Cấu trúc dữ liệu')..."
            className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-12 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {isSearching && <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                    <FileText className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {doc.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono ml-2">{doc.subjectCode}</span>
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-mono shrink-0">{doc.fileSize}</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">{doc.title}</h3>
              <p className="text-xs text-slate-600 mt-1.5 line-clamp-2">{doc.summary}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {doc.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer: Metadata & Download */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="line-clamp-1">Tác giả: {doc.author}</span>
              <button
                onClick={() => alert(`Bắt đầu tải xuống tệp từ Google Cloud Storage: ${doc.gcsUri}`)}
                className="flex items-center gap-1 text-xs font-semibold text-slate-800 hover:text-slate-900 transition-colors bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải về ({doc.downloads})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* SMART UPLOAD & DUPLICATE DETECTION MODAL */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-xl w-full shadow-lg border border-slate-200 animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Tải Tài Liệu & Quét Trùng Bằng Vertex AI
                </h3>
              </div>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center text-xs font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tên tệp tin cần tải</label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Đoạn trích xuất nội dung (OCR / Text preview)
                </label>
                <textarea
                  rows={3}
                  value={uploadExcerpt}
                  onChange={(e) => setUploadExcerpt(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <button
                onClick={handleSimulateSmartUpload}
                disabled={analyzingWithGemini}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
              >
                {analyzingWithGemini ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Gemini đang trích xuất metadata & so sánh vector embeddings...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Trích xuất Metadata & Kiểm tra trùng lặp tệp</span>
                  </>
                )}
              </button>

              {/* Analysis Result */}
              {analysisResult && (
                <div className="space-y-3 pt-3 border-t border-slate-200 animate-in fade-in duration-150">
                  {/* Duplicate Detection Warning (Chức năng 4 in PRD) */}
                  {analysisResult.duplicateCheck?.isDuplicate ? (
                    <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>
                          CẢNH BÁO TRÙNG LẶP NỘI DUNG (Độ tương đồng {analysisResult.duplicateCheck.similarityScore}%)
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-800">
                        {analysisResult.duplicateCheck.duplicateWith?.matchReason}
                      </p>
                      <div className="text-[10px] text-amber-900 font-mono bg-white/70 p-2 rounded-lg border border-amber-200">
                        Tệp trùng khớp: {analysisResult.duplicateCheck.duplicateWith?.title}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center gap-2 text-emerald-800 font-semibold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Tài liệu mới 100%! Không trùng lặp trên Google Cloud Storage.</span>
                    </div>
                  )}

                  {/* Extracted Metadata Card */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Metadata tự động trích xuất bởi Gemini API
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-400">Môn học:</span>{" "}
                        <strong className="text-slate-800">{analysisResult.metadata?.subject}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Thể loại:</span>{" "}
                        <strong className="text-slate-800">{analysisResult.metadata?.category}</strong>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-600 italic">"{analysisResult.metadata?.summary}"</p>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => setUploadModalOpen(false)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-lg transition-colors"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      onClick={handleConfirmSaveDoc}
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-lg transition-colors"
                    >
                      Lưu lên GCS & Nhận +50 XP
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
