import { Search, Sparkles, UploadCloud, Loader2 } from "lucide-react";

interface DocsHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isSearching: boolean;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories: string[];
  onOpenUploadModal: () => void;
}

export const DocsHeader = ({
  searchQuery,
  onSearchChange,
  isSearching,
  selectedCategory,
  onSelectCategory,
  categories,
  onOpenUploadModal,
}: DocsHeaderProps) => {
  return (
    <div className="space-y-4">
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
            Tìm kiếm bằng ngữ nghĩa tự nhiên (Semantic Search) & Tự động phát hiện tài liệu trùng lặp
          </p>
        </div>

        <button
          onClick={onOpenUploadModal}
          className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Tải Tài Liệu Lên (+50 XP)</span>
        </button>
      </div>

      {/* Semantic Search Bar & Category Chips */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm ngữ nghĩa (VD: 'đề thi thuật toán cây nhị phân', 'bài tập tiếng anh')..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-10 pr-28 py-3 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 placeholder:text-slate-400"
          />

          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-[11px] text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-2xs pointer-events-none">
            {isSearching ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-800" />
                <span>Đang quét Vector...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Semantic AI</span>
              </>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
