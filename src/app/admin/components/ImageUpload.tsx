"use client";
import { useState, useRef } from "react";
import { FaCloudUploadAlt, FaTrash, FaImage, FaFileAlt } from "react-icons/fa";
import Image from "next/image";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        onChange(data.url);
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
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

      {value ? (
        <div className="relative group rounded-3xl overflow-hidden border border-white/10 aspect-video bg-slate-950 flex flex-col items-center justify-center">
          {!isPdf ? (
            <Image
              src={value}
              alt="Upload"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
              <FaFileAlt size={48} className="text-amber-500/80 mb-2" />
              <p className="text-xs font-semibold px-4 text-center break-all">
                {value.split("/").pop()}
              </p>
            </div>
          )}
          {loading && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-20">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
                <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin relative z-10" />
              </div>
              <p className="text-emerald-400 font-bold animate-pulse">
                Uploading...
              </p>
            </div>
          )}
          {!loading && (
            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 z-10">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-4 rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <FaCloudUploadAlt size={24} />
              </button>
              <button
                onClick={() => onChange("")}
                className="p-4 rounded-2xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
              >
                <FaTrash size={20} />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => !loading && fileInputRef.current?.click()}
          className={`
            relative aspect-video rounded-[2.5rem] border-2 border-dashed transition-all duration-300 overflow-hidden
            flex flex-col items-center justify-center gap-4 p-8
            ${loading ? "cursor-default border-emerald-500/50 bg-emerald-500/5" : "cursor-pointer"}
            ${isDragging && !loading ? "border-emerald-500 bg-emerald-500/5" : ""}
            ${!isDragging && !loading ? "border-white/10 bg-slate-950/50 hover:bg-slate-950 hover:border-white/20" : ""}
          `}
        >
          {loading ? (
            <div className="flex flex-col items-center gap-4 z-10">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
                <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin relative z-10" />
              </div>
              <div className="text-center">
                <p className="text-emerald-400 font-bold animate-pulse">
                  Uploading...
                </p>
                <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest font-bold">
                  Please wait
                </p>
              </div>
            </div>
          ) : (
            <>
              <div
                className={`p-6 rounded-3xl bg-slate-900 text-slate-500 transition-transform duration-500 ${isDragging ? "scale-110 rotate-3 text-emerald-400" : ""}`}
              >
                <FaCloudUploadAlt size={32} />
              </div>
              <div className="text-center">
                <p className="text-white font-bold">Click or drag to upload</p>
                <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest font-bold">
                  Files allowed
                </p>
              </div>
            </>
          )}
          {loading && (
            <div className="absolute inset-0 bg-linear-to-t from-emerald-500/10 to-transparent animate-pulse" />
          )}
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileSelect}
        accept={accept}
        className="hidden"
      />
    </div>
  );
}
