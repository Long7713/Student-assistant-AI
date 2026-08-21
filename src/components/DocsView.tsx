import { useState, useEffect, useRef } from "react";
import { SmartDoc } from "../types";
import { useApp } from "../context/AppContext";
import { docsService } from "../services/docsService";
import { DocsHeader } from "./docs/DocsHeader";
import { DocCard } from "./docs/DocCard";
import { DocUploadModal } from "./docs/DocUploadModal";

interface DocsViewProps {
  docs?: SmartDoc[];
  onAddDoc?: (doc: SmartDoc) => void;
}

export const DocsView = (props: DocsViewProps) => {
  const app = useApp();

  const docs = props.docs ?? app.docs;
  const onAddDoc = props.onAddDoc ?? app.addDoc;

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả");
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false);

  // Semantic Search states
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [semanticResults, setSemanticResults] = useState<SmartDoc[] | null>(null);

  const categories = [
    "Tất cả",
    "Đề thi & Lời giải",
    "Giáo trình",
    "Slide bài giảng",
    "Tóm tắt ôn tập",
  ];

  const searchAbortRef = useRef<AbortController | null>(null);

  // Semantic Search Effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSemanticResults(null);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      if (searchAbortRef.current) {
        searchAbortRef.current.abort();
      }
      searchAbortRef.current = new AbortController();

      try {
        const data = await docsService.semanticSearch(
          searchQuery,
          docs,
          searchAbortRef.current.signal
        );
        if (data.success) {
          setSemanticResults(data.results);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Semantic search failed:", err);
        }
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
      const matchesCategory =
        selectedCategory === "Tất cả" || doc.category === selectedCategory;

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

  return (
    <div className="space-y-6">
      {/* Header & Filter/Search Controls */}
      <DocsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isSearching={isSearching}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categories={categories}
        onOpenUploadModal={() => setUploadModalOpen(true)}
      />

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <DocCard key={doc.id} doc={doc} onLike={app.likeDoc} />
        ))}
      </div>

      {filteredDocs.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-2xs">
          <p className="text-slate-500 text-xs">
            Không tìm thấy tài liệu phù hợp với từ khóa tìm kiếm.
          </p>
        </div>
      )}

      {/* Upload Modal */}
      <DocUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        docs={docs}
        onAddDoc={onAddDoc}
      />
    </div>
  );
};
