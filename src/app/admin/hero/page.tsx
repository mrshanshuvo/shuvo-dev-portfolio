"use client";
import { useState, useEffect, useRef } from "react";
import type { Hero, TypeSequenceItem, SocialLink } from "@/types";
import {
  FaPlus,
  FaTimes,
  FaCheck,
  FaSave,
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaTwitter,
  FaInstagram,
  FaLink,
  FaUser,
  FaInfoCircle,
  FaImage,
  FaFileAlt,
  FaCog,
} from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { motion, AnimatePresence } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import Image from "next/image";
import ImageUpload from "../components/ImageUpload";

// Shadcn UI Imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const DEFAULT: Hero = {
  name: "Shahid Hasan",
  lastName: "Shuvo",
  typeSequences: [
    { text: "Full-Stack Web Developer", delay: 2000 },
    { text: "Computer Engineer", delay: 2000 },
  ],
  bio: "Crafting exceptional digital experiences with clean code and modern technologies.",
  profileImage: "/PP1.jpeg",
  resumeUrl: "/Resume_of_Shahid_Hasan_Shuvo.pdf",
  socialLinks: [],
};

const PLATFORM_OPTIONS = [
  "GitHub",
  "LinkedIn",
  "LeetCode",
  "Email",
  "Twitter",
  "Instagram",
];

const platformIconMap: Record<string, any> = {
  GitHub: FaGithub,
  LinkedIn: FaLinkedin,
  LeetCode: SiLeetcode,
  Email: FaEnvelope,
  Twitter: FaTwitter,
  Instagram: FaInstagram,
};

export default function AdminHeroPage() {
  const [data, setData] = useState<Hero>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => {
    fetch("/api/admin/hero")
      .then((r) => r.json())
      .then((d) => {
        setData(Object.keys(d).length ? { ...DEFAULT, ...d } : DEFAULT);
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/admin/hero", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    if (res.ok) showToast("Hero section saved successfully!");
    else showToast("Failed to save changes.", "error");
  }

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    field: "profileImage" | "resumeUrl",
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(field);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const d = await res.json();
      if (d.url) {
        setData((prev) => ({ ...prev, [field]: d.url }));
        showToast("File uploaded successfully!");
      } else {
        showToast(d.error || "Upload failed", "error");
      }
    } catch (err) {
      showToast("Upload failed", "error");
    } finally {
      setUploading(null);
    }
  }

  function updateSeq(
    i: number,
    field: keyof TypeSequenceItem,
    val: string | number,
  ) {
    setData((d) => {
      const seqs = [...d.typeSequences];
      seqs[i] = { ...seqs[i], [field]: val };
      return { ...d, typeSequences: seqs };
    });
  }

  function addLink() {
    setData((d) => ({
      ...d,
      socialLinks: [
        ...d.socialLinks,
        { platform: "GitHub", href: "", label: "GitHub" },
      ],
    }));
  }

  function updateLink(i: number, field: keyof SocialLink, val: string) {
    setData((d) => {
      const links = [...d.socialLinks];
      links[i] = { ...links[i], [field]: val };
      if (field === "platform") links[i].label = val;
      return { ...d, socialLinks: links };
    });
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-slate-400 font-medium animate-pulse">
            Loading Hero Data...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-3 ${
              toast.type === "success"
                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                : "bg-red-500/20 border-red-500/50 text-red-400"
            }`}
          >
            <div
              className={`p-2 rounded-full ${toast.type === "success" ? "bg-emerald-500/20" : "bg-red-500/20"}`}
            >
              {toast.type === "success" ? <FaCheck /> : <FaTimes />}
            </div>
            <span className="font-semibold">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
              Hero Section
            </h1>
            <p className="text-slate-400">
              Update your name, bio, typing sequences & social links.
            </p>
          </div>
          <Button
            id="save-hero-btn"
            onClick={handleSave}
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold px-8 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all group"
          >
            <FaSave
              className={cn(
                "mr-2 transition-transform duration-500",
                saving ? "animate-spin" : "group-hover:rotate-12",
              )}
            />
            {saving ? "Saving Changes..." : "Save Changes"}
          </Button>
        </header>

        <div className="space-y-8">
          {/* Identity Card */}
          <Card className="rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl">
                  <FaUser size={20} />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-white">
                    Identity
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Your personal branding and display name.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                  First Name
                </label>
                <Input
                  className="bg-slate-950/50 border-white/10 text-white rounded-xl focus-visible:ring-emerald-500/50"
                  value={data.name}
                  onChange={(e) =>
                    setData((d) => ({ ...d, name: e.target.value }))
                  }
                  placeholder="e.g. Shahid Hasan"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Last Name{" "}
                  <span className="text-blue-400 font-normal">
                    (Highlighted)
                  </span>
                </label>
                <Input
                  className="bg-slate-950/50 border-white/10 text-white rounded-xl focus-visible:ring-emerald-500/50"
                  value={data.lastName}
                  onChange={(e) =>
                    setData((d) => ({ ...d, lastName: e.target.value }))
                  }
                  placeholder="e.g. Shuvo"
                />
              </div>
            </CardContent>
          </Card>

          {/* Typing Sequences Card */}
          <Card className="rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-purple-500/20 text-purple-400 rounded-xl">
                    <FaInfoCircle size={20} />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-white">
                      Typing Sequences
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Animated roles that appear on your hero section.
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setData((d) => ({
                      ...d,
                      typeSequences: [
                        ...d.typeSequences,
                        { text: "", delay: 2000 },
                      ],
                    }))
                  }
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 border-white/5 rounded-xl active:scale-95"
                >
                  <FaPlus size={12} className="mr-1" /> Add New
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <AnimatePresence>
                {data.typeSequences.map((seq, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={i}
                    className="flex flex-col md:flex-row gap-4 items-start md:items-center p-4 bg-slate-950/30 rounded-2xl border border-white/5 group transition-all hover:bg-slate-950/50"
                  >
                    <div className="flex-1 w-full">
                      <Input
                        className="bg-transparent border-white/10 text-white rounded-xl focus-visible:ring-purple-500/50 h-10"
                        value={seq.text}
                        onChange={(e) => updateSeq(i, "text", e.target.value)}
                        placeholder="e.g. Full-Stack Developer"
                      />
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="relative">
                        <Input
                          type="number"
                          className="bg-transparent border-white/10 text-white rounded-xl focus-visible:ring-purple-500/50 w-28 pr-10 h-10"
                          value={seq.delay}
                          onChange={(e) =>
                            updateSeq(i, "delay", +e.target.value)
                          }
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-600 uppercase">
                          ms
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setData((d) => ({
                            ...d,
                            typeSequences: d.typeSequences.filter(
                              (_, idx) => idx !== i,
                            ),
                          }))
                        }
                        className="text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl"
                      >
                        <FaTimes size={14} />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {data.typeSequences.length === 0 && (
                <div className="text-center py-8 bg-slate-950/20 rounded-2xl border border-dashed border-white/5">
                  <p className="text-slate-500 text-sm italic">
                    No typing sequences added.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assets Card */}
          <Card className="rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl">
                  <FaImage size={20} />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-white">
                    Assets
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Profile picture and resume document.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Profile Image UI */}
                <div className="space-y-4">
                  <ImageUpload
                    label="Profile Image"
                    value={data.profileImage}
                    onChange={(url) =>
                      setData((prev) => ({ ...prev, profileImage: url }))
                    }
                  />
                </div>

                {/* Resume PDF UI */}
                <div className="space-y-4">
                  <ImageUpload
                    label="Resume PDF"
                    value={data.resumeUrl}
                    onChange={(url) =>
                      setData((prev) => ({ ...prev, resumeUrl: url }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        .glass-card {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        ::selection {
          background: rgba(16, 185, 129, 0.3);
          color: white;
        }
      `}</style>
    </div>
  );
}
