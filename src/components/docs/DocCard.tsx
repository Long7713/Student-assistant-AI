import { FileText, Download, Tag, HardDrive } from "lucide-react";
import { SmartDoc } from "../../types";

interface DocCardProps {
  doc: SmartDoc;
  onLike?: (docId: string) => void;
}

export const DocCard = ({ doc, onLike }: DocCardProps) => {
  return (
    <div
      id={`doc-card-${doc.id}`}
      className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
    >
      <div>
        {/* Category & File Type */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
            {doc.category}
          </span>
          <span className="text-[10px] font-mono font-semibold text-slate-500 uppercase bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded">
            {doc.fileType} • {doc.fileSize}
          </span>
        </div>

        <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 mb-1">
          {doc.title}
        </h3>
        <p className="text-xs text-slate-500 mb-2">
          {doc.subject} • Tác giả: {doc.author}
        </p>

        <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 line-clamp-3 mb-3 leading-relaxed">
          {doc.summary}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {doc.tags.map((tag, i) => (
            <span
              key={i}
              className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1"
            >
              <Tag className="w-2.5 h-2.5 text-slate-400" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer & Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
          <HardDrive className="w-3 h-3 text-slate-400" />
          <span>GCS Bucket</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onLike && onLike(doc.id)}
            className="text-slate-600 hover:text-rose-600 font-medium text-xs px-2.5 py-1.5 rounded-md hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>❤️</span>
            <span>{doc.likes}</span>
          </button>
          <a
            href={`#download-${doc.id}`}
            onClick={(e) => {
              e.preventDefault();
              alert(`Bắt đầu tải tệp "${doc.title}" từ Google Cloud Storage!`);
            }}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-3 py-1.5 rounded-lg shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải về</span>
          </a>
        </div>
      </div>
    </div>
  );
};
