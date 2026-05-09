"use client";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  FaTrash,
  FaFileAlt,
  FaExternalLinkAlt,
  FaEye,
  FaTimes,
  FaCloudUploadAlt,
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
  accept = "image/*,video/*,application/pdf",
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

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
    <div className="space-y-4 w-full">
      {label && (
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400/80 pl-1">
          {label}
        </label>
      )}

      {error ? (
        <div className="p-6 rounded-2xl border border-rose-500/20 bg-linear-to-br from-rose-500/10 to-rose-900/10 text-rose-400 relative backdrop-blur-md shadow-[0_8px_32px_0_rgba(244,63,94,0.1)]">
          <h3 className="font-bold text-lg mb-2 text-rose-400 flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.6)]" />
            Upload Failed
          </h3>
          <p className="text-sm opacity-80 font-medium pl-5">{error}</p>
          <button
            onClick={() => setError(null)}
            className="absolute top-5 right-5 text-rose-400/50 hover:text-rose-400 p-2 hover:rotate-90 transition-all duration-300 bg-black/20 hover:bg-black/40 rounded-full"
          >
            <FaTimes size={16} />
          </button>
        </div>
      ) : loading ? (
        <div className="p-4 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-md shadow-2xl relative overflow-hidden group aspect-square flex flex-col justify-center">
          {/* Subtle animated background glow */}
          <div className="absolute inset-0 bg-linear-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 animate-pulse" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
                  <FiRefreshCw
                    className="text-indigo-400 animate-spin"
                    size={14}
                  />
                </div>
                <div>
                  <h4 className="font-bold text-slate-200 tracking-wide text-[10px] uppercase">
                    Processing
                  </h4>
                  <span className="text-indigo-300/60 font-medium truncate text-[9px] max-w-[80px] block mt-0.5">
                    {fileName}
                  </span>
                </div>
              </div>
              <span className="text-lg font-black bg-linear-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
                {progress}%
              </span>
            </div>

            {/* Premium Gradient Progress Bar */}
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] border border-white/5 relative">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 relative"
                style={{ width: `${progress}%` }}
              >
                {/* Embedded Shimmer inside the bar */}
                <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      ) : value ? (
        <div className="relative group/image rounded-2xl overflow-hidden border border-white/10 aspect-square bg-slate-950 flex flex-col items-center justify-center shadow-2xl transition-all duration-500 hover:shadow-[0_10px_40px_rgba(99,102,241,0.15)] hover:border-indigo-500/30">
          {value &&
          (value.includes("/video/upload/") ||
            value.toLowerCase().endsWith(".mp4") ||
            value.toLowerCase().endsWith(".webm")) ? (
            <video
              src={value}
              className="w-full h-full object-cover transition-all duration-700 group-hover/image:scale-105 group-hover/image:opacity-60 group-hover/image:blur-[2px]"
              muted
              loop
              onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
              onMouseOut={(e) => (e.target as HTMLVideoElement).pause()}
            />
          ) : !isPdf ? (
            <Image
              src={value}
              alt="Upload"
              fill
              className="object-contain transition-all duration-700 group-hover/image:scale-105 group-hover/image:opacity-60 group-hover/image:blur-[2px]"
            />
          ) : (
            <>
              <iframe
                src={`${value}#toolbar=0&navpanes=0&scrollbar=0&view=Fit`}
                className="w-full h-full border-none bg-white transition-all duration-700 group-hover/image:opacity-60 group-hover/image:blur-[2px]"
                title="PDF Preview"
              />
              <div className="absolute inset-0 z-0 bg-transparent" />
            </>
          )}

          {/* Premium Glassy Overlay */}
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/image:opacity-100 backdrop-blur-[px] transition-all duration-500 z-5" />

          {/* Glassmorphic Action Overlay */}
          <div className="absolute inset-0 flex items-center justify-center gap-2 z-10 opacity-0 group-hover/image:opacity-100 transition-all duration-300 scale-95 group-hover/image:scale-100">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsPreviewOpen(true);
              }}
              title="Expand Preview"
              className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 backdrop-blur-md hover:bg-indigo-500/40 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(99,102,241,0.2)] transition-all duration-300"
            >
              <FaEye size={16} />
            </button>
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              title="Open Original"
              className="p-2 rounded-xl bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 backdrop-blur-md hover:bg-fuchsia-500/40 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(217,70,239,0.2)] transition-all duration-300"
            >
              <FaExternalLinkAlt size={14} />
            </a>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              title="Change File"
              className="p-2 rounded-xl bg-white/10 text-white border border-white/20 backdrop-blur-md hover:bg-white/20 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(255,255,255,0.1)] transition-all duration-300"
            >
              <FiRefreshCw size={16} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChange("");
              }}
              title="Delete File"
              className="p-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 backdrop-blur-md hover:bg-rose-500/40 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(244,63,94,0.2)] transition-all duration-300"
            >
              <FaTrash size={14} />
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
            relative aspect-square rounded-2xl border-2 transition-all duration-500 cursor-pointer overflow-hidden
            flex flex-col items-center justify-center p-4 group/image
            ${
              isDragging
                ? "border-indigo-400 border-solid bg-indigo-500/10 shadow-[0_0_40px_rgba(99,102,241,0.2)]"
                : "border-slate-700 border-dashed bg-slate-900/50 hover:border-indigo-500/50 hover:bg-slate-800/80"
            }
          `}
        >
          {/* Subtle background glow effect on hover */}
          <div className="absolute inset-0 bg-linear-to-tr from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover/image:from-indigo-500/5 group-hover/image:via-purple-500/5 group-hover/image:to-pink-500/5 transition-all duration-700" />

          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-800/80 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/5 flex items-center justify-center group-hover/image:scale-110 group-hover/image:-translate-y-1 transition-all duration-500">
              <FaCloudUploadAlt
                className="text-indigo-400 drop-shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                size={20}
              />
            </div>
            <div className="text-center space-y-0.5">
              <h3 className="text-[11px] font-black tracking-widest bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent uppercase">
                Drop
              </h3>
              <p className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter">
                or click
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[7px] uppercase tracking-[0.2em] font-black text-slate-600 bg-slate-950/50 px-3 py-1 rounded-full border border-white/5">
              <span className="text-indigo-400/50">IMG</span>
              <span className="w-1 h-1 rounded-full bg-slate-800" />
              <span className="text-purple-400/50">VID</span>
              <span className="w-1 h-1 rounded-full bg-slate-800" />
              <span className="text-fuchsia-400/50">PDF</span>
            </div>
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

      {/* Fullscreen Premium Preview Modal */}
      {isMounted &&
        isPreviewOpen &&
        value &&
        createPortal(
          <div
            className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-8 bg-slate-950/80 backdrop-blur-sm transition-all duration-500"
            onClick={(e) => {
              e.stopPropagation();
              setIsPreviewOpen(false);
            }}
          >
            <div
              className={`relative w-full ${isPdf ? "max-w-5xl h-[85vh]" : "max-w-4xl"} bg-slate-900/90 backdrop-blur-3xl rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col transition-all duration-500 scale-100`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Refined Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-950/40">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
                  <h3 className="text-white text-[10px] font-bold tracking-[0.2em] uppercase opacity-70">
                    Preview Mode
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsPreviewOpen(false);
                  }}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300"
                >
                  <FaTimes size={18} />
                </button>
              </div>

              {/* Dynamic Content Body */}
              <div
                className={`relative w-full ${!isPdf ? "aspect-auto max-h-[70vh] p-4" : "flex-1 p-6"} flex items-center justify-center bg-black/20`}
              >
                {value &&
                (value.includes("/video/upload/") ||
                  value.toLowerCase().endsWith(".mp4") ||
                  value.toLowerCase().endsWith(".webm")) ? (
                  <video
                    src={value}
                    controls
                    autoPlay
                    className="max-w-full max-h-[70vh] rounded-xl shadow-2xl transition-transform duration-500"
                  />
                ) : !isPdf ? (
                  <div className="relative w-full h-[70vh]">
                    <Image
                      src={value}
                      alt="Preview"
                      fill
                      className="object-contain rounded-xl shadow-2xl transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-white">
                    <iframe
                      src={`${value}#toolbar=1&navpanes=0&scrollbar=1&view=Fit`}
                      className="w-full h-full border-none"
                      title="PDF Full Preview"
                    />
                  </div>
                )}
              </div>

              {/* Subtle Footer info */}
              <div className="px-6 py-3 border-t border-white/5 bg-slate-950/20 flex justify-center">
                <p className="text-[9px] font-bold text-slate-500 tracking-widest uppercase">
                  End of Preview
                </p>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
