"use client";

import { useCallback, useState, useRef, type ReactNode } from "react";

interface FileUploadProps {
  accept: string;
  multiple?: boolean;
  maxSize?: number;
  onFiles: (files: File[]) => void;
  children?: ReactNode;
  className?: string;
}

export function FileUpload({
  accept,
  multiple = false,
  maxSize = 100 * 1024 * 1024,
  onFiles,
  children,
  className = "",
}: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      setError(null);
      const files = Array.from(fileList);
      const oversized = files.find((f) => f.size > maxSize);
      if (oversized) {
        setError(`File "${oversized.name}" exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`);
        return;
      }
      onFiles(files);
    },
    [maxSize, onFiles]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  return (
    <div className={className}>
      <div
        className={`drop-zone ${dragOver ? "drag-over" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label={`Upload ${multiple ? "files" : "file"}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {children || (
          <div className="space-y-3">
            <svg className="w-12 h-12 mx-auto text-text-light dark:text-text-dark-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
            </svg>
            <p className="text-lg font-medium text-text dark:text-text-dark">
              Drag & drop {multiple ? "files" : "a file"} here
            </p>
            <p className="text-sm text-text-light dark:text-text-dark-muted">
              or click to browse · Max {Math.round(maxSize / 1024 / 1024)}MB per file
            </p>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-500" role="alert">{error}</p>
      )}
    </div>
  );
}
