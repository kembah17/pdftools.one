"use client";

import { useCallback, useRef, useState } from "react";

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  onFiles: (files: File[]) => void;
  children?: React.ReactNode;
}

export function FileUpload({ accept, multiple = false, maxSize, onFiles, children }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;
      let files = Array.from(fileList);
      if (accept) {
        const exts = accept.split(",").map((e) => e.trim().toLowerCase());
        files = files.filter((f) => {
          const name = f.name.toLowerCase();
          const type = f.type.toLowerCase();
          return exts.some((ext) => {
            if (ext.startsWith(".")) return name.endsWith(ext);
            if (ext.includes("/")) {
              if (ext.endsWith("/*")) return type.startsWith(ext.replace("/*", "/"));
              return type === ext;
            }
            return name.endsWith(ext);
          });
        });
      }
      if (maxSize) {
        files = files.filter((f) => f.size <= maxSize);
      }
      if (files.length > 0) onFiles(files);
    },
    [accept, maxSize, onFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
        isDragging
          ? "border-primary bg-primary-light/50"
          : "border-border hover:border-primary hover:bg-primary-light/20"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
      {children}
    </div>
  );
}
