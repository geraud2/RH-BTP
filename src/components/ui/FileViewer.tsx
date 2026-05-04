import { FileText, X } from 'lucide-react';

interface FileViewerProps {
  filename: string;
  onClose: () => void;
}

export function FileViewer({ filename, onClose }: FileViewerProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-amber-500" />
            <span className="font-medium text-gray-900 text-sm">{filename}</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100"><X size={20} className="text-gray-500" /></button>
        </div>
        <div className="p-8 flex flex-col items-center justify-center gap-4 text-gray-400">
          <FileText size={64} className="text-gray-200" />
          <p className="text-sm">Aperçu du document simulé</p>
          <p className="text-xs text-gray-300">{filename}</p>
        </div>
      </div>
    </div>
  );
}
