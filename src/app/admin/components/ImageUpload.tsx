"use client";
import { useState, useRef } from "react";
import {
  FaTrash,
  FaFileAlt,
  FaExternalLinkAlt,
  FaEye,
  FaTimes,
} from "react-icons/fa";
import Image from "next/image";
import { FiRefreshCw } from "react-icons/fi";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  accept?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label,
  accept = "image/*,application/pdf",
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    setProgress(0);
    setFileName(file.name);

    try {
      // 1. Get the upload signature from our backend
      const sigRes = await fetch("/api/admin/upload/signature");
      if (!sigRes.ok) throw new Error("Failed to get upload signature");
      const { timestamp, signature, cloudName, apiKey } = await sigRes.json();

      if (!cloudName) {
        throw new Error("Cloudinary not configured properly");
      }

      // 2. Prepare payload for Cloudinary API
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("folder", "portfolio");

      // Cloudinary processes PDFs as images by default and restricts their viewing for security.
      // Uploading them as 'raw' ensures they are treated as standard downloadable/viewable files.
      const isPdfFile =
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf");
      const resourceType = isPdfFile ? "raw" : "auto";

      // 3. Upload directly to Cloudinary from the client
      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
        true,
      );

      // Real, exact progress tracking!
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round(
            (event.loaded / event.total) * 100,
          );
          setProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          if (data.secure_url) {
            // Let the user see "100%" briefly
            setTimeout(() => {
              onChange(data.secure_url);
              setLoading(false);
            }, 500);
          } else {
            setError("File upload failed");
            setLoading(false);
          }
        } else {
          try {
            const errData = JSON.parse(xhr.responseText);
            setError(errData.error?.message || "File upload failed");
          } catch {
            setError("File upload failed");
          }
          setLoading(false);
        }
      };

      xhr.onerror = () => {
        setError("Network error occurred during upload");
        setLoading(false);
      };

      xhr.send(formData);
    } catch (err: any) {
      setError(err.message || "File upload failed");
      setLoading(false);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const isPdf = value?.toLowerCase().endsWith(".pdf");

  return (
    <div className="space-y-4">
      {label && (
        <label className="text-xs font-black uppercase tracking-widest text-slate-500">
          {label}
        </label>
      )}

      {error ? (
        <div className="p-6 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400 relative">
          <h3 className="font-bold text-lg mb-2 text-red-500">Upload Error</h3>
          <p className="text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="absolute top-4 right-4 text-red-400 hover:text-red-300 font-bold p-2"
          >
            ✕
          </button>
        </div>
      ) : loading ? (
        <div className="p-6 rounded-2xl border border-white/10 bg-slate-900 shadow-sm text-slate-200">
          <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
            <span className="font-semibold text-slate-300">Uploading:</span>
            <span className="text-blue-400 font-medium truncate">
              {fileName}
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 mb-2 overflow-hidden">
            <div
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-right text-xs text-slate-400">
            {progress}% Complete
          </div>
        </div>
      ) : value ? (
        <div className="relative group rounded-3xl overflow-hidden border border-white/10 aspect-video bg-slate-950 flex flex-col items-center justify-center">
          {!isPdf ? (
            <Image
              src={value}
              alt="Upload"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <iframe
              src={`${value}#toolbar=0&navpanes=0&scrollbar=0&view=Fit`}
              className="w-full h-full pointer-events-none border-none bg-white overflow-hidden"
              title="PDF Preview"
            />
          )}
          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-10">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsPreviewOpen(true);
              }}
              title="View Preview Here"
              className="p-4 rounded-2xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 hover:scale-105 transition-all"
            >
              <FaEye size={24} />
            </button>
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              title="View File in New Tab"
              className="p-4 rounded-2xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 hover:scale-105 transition-all"
            >
              <FaExternalLinkAlt size={20} />
            </a>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              title="Replace File"
              className="p-4 rounded-2xl bg-white/10 text-white hover:bg-white/20 hover:scale-105 transition-all"
            >
              <FiRefreshCw size={24} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChange("");
              }}
              title="Remove File"
              className="p-4 rounded-2xl bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:scale-105 transition-all"
            >
              <FaTrash size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative aspect-video rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden
            flex flex-col items-center justify-center p-8 
            ${isDragging ? "border-blue-500 bg-blue-500/10" : "border-blue-500/50 bg-blue-500/5 hover:bg-blue-500/10"}
          `}
        >
          <div className="text-center">
            <p className="text-blue-500 font-semibold text-lg md:text-xl">
              Drag & drop files here,{" "}
              <span className="font-normal text-blue-400">
                or click to select
              </span>
            </p>
          </div>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileSelect}
        accept={accept}
        className="hidden"
      />

      {/* Fullscreen Preview Modal */}
      {isPreviewOpen && value && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="relative w-full max-w-6xl h-[90vh] bg-slate-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-950/50">
              <h3 className="text-white font-semibold truncate px-2">
                File Preview
              </h3>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsPreviewOpen(false);
                }}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              >
                <FaTimes size={24} />
              </button>
            </div>
            <div className="flex-1 w-full h-full p-4 md:p-6 relative bg-slate-950/50">
              {!isPdf ? (
                <div className="relative w-full h-full">
                  <Image
                    src={value}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <iframe
                  src={`${value}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
                  className="w-full h-full rounded-xl bg-white"
                  title="PDF Full Preview"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
