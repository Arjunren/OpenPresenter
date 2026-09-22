import { useCallback, useState } from 'react';
import type { DragEvent, ChangeEvent } from 'react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
}

export const UploadZone = ({ onFileSelect }: UploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setError(null);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.name.toLowerCase().endsWith('.pptx')) {
        onFileSelect(file);
      } else {
        setError('Please drop a valid .pptx file.');
      }
    }
  }, [onFileSelect]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setError(null);
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.name.toLowerCase().endsWith('.pptx')) {
        onFileSelect(file);
      } else {
        setError('Please select a valid .pptx file.');
      }
    }
  }, [onFileSelect]);

  return (
    <div className="w-full max-w-2xl">
      <div 
        className={`bg-white border-2 border-dashed rounded-xl p-12 text-center shadow-sm transition-colors cursor-pointer relative ${
          isDragging ? 'border-blue-500 bg-blue-50/50' : 'border-slate-300 hover:border-blue-500 hover:bg-blue-50/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          type="file"
          accept=".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleChange}
          title=""
        />
        <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 pointer-events-none">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2 pointer-events-none">
          {isDragging ? 'Drop presentation here' : 'Drop your PPTX here'}
        </h2>
        <p className="text-slate-500 mb-6 pointer-events-none">or click to browse from your computer</p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors shadow-sm pointer-events-none">
          Choose PPTX
        </button>
        <p className="text-xs text-slate-400 mt-4 pointer-events-none">.pptx only</p>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-center text-sm font-medium">
          {error}
        </div>
      )}

      <div className="mt-8 flex justify-center gap-8 text-sm text-slate-600 font-medium">
        <div className="flex items-center gap-2">
          <span className="text-green-500">✓</span> Private
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-500">✓</span> Browser Based
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-500">✓</span> Open Source
        </div>
      </div>
      <div className="mt-6 text-center text-sm text-slate-500 bg-slate-100 py-3 rounded-lg border border-slate-200">
        <p>Your presentation is processed locally in your browser. Your PPTX file is not uploaded to our servers.</p>
      </div>
    </div>
  );
};
