"use client";
import { useState, useEffect } from "react";
import type { SocialLink } from "@/types";
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
} from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { motion, AnimatePresence } from "framer-motion";

// Shadcn UI Imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export default function AdminSocialsPage() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => {
    fetch("/api/admin/hero")
      .then((r) => r.json())
      .then((d) => {
        setLinks(d.socialLinks || []);
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    // We still save through the hero endpoint for now, or create a dedicated one
    // Let's use the dedicated /api/admin/socials I created earlier if possible
    const res = await fetch("/api/admin/socials", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(links),
    });
    setSaving(false);
    if (res.ok) showToast("Social links saved!");
    else showToast("Failed to save.", "error");
  }

  function addLink() {
    setLinks((prev) => [
      ...prev,
      { platform: "GitHub", href: "", label: "GitHub" },
    ]);
  }

  function updateLink(i: number, field: keyof SocialLink, val: string) {
    setLinks((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: val };
      if (field === "platform") next[i].label = val;
      return next;
    });
  }
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-3 ${
              toast.type === "success"
                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                : "bg-red-500/20 border-red-500/50 text-red-400"
            }`}
          >
            {toast.type === "success" ? <FaCheck /> : <FaTimes />}
            <span className="font-semibold">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
              Social Links
            </h1>
            <p className="text-slate-400">
              Manage your professional presence across the web.
            </p>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold px-8 shadow-lg shadow-emerald-600/20"
          >
            <FaSave className={cn("mr-2", saving && "animate-spin")} />
            {saving ? "Saving..." : "Save Links"}
          </Button>
        </header>

        <Card className="rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-white">
                Connections
              </CardTitle>
              <Button
                variant="outline"
                onClick={addLink}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border-white/5 rounded-xl"
              >
                <FaPlus size={12} className="mr-2" /> Add Link
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <AnimatePresence mode="popLayout">
              {loading ? (
                /* Skeleton Loader List */
                Array.from({ length: 4 }).map((_, i) => (
                  <motion.div
                    key={`skeleton-${i}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col md:flex-row gap-4 p-4 bg-slate-950/20 rounded-2xl border border-white/5 items-center animate-pulse mb-4"
                  >
                    <div className="w-full md:w-48 h-10 bg-slate-800/40 rounded-xl" />
                    <div className="flex-1 w-full h-10 bg-slate-800/20 rounded-xl" />
                    <div className="w-10 h-10 bg-slate-800/10 rounded-xl" />
                  </motion.div>
                ))
              ) : (
                links.map((link, i) => {
                  const Icon = platformIconMap[link.platform] || FaLink;
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={i}
                      className="flex flex-col md:flex-row gap-4 p-4 bg-slate-950/40 rounded-2xl border border-white/5 items-center mb-4"
                    >
                      <div className="w-full md:w-48">
                        <Select
                          value={link.platform}
                          onValueChange={(val) =>
                            val && updateLink(i, "platform", val)
                          }
                        >
                          <SelectTrigger className="bg-slate-900/50 border-white/10 text-slate-200 rounded-xl">
                            <div className="flex items-center gap-2">
                              <Icon size={16} className="text-blue-400" />
                              <SelectValue />
                            </div>
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-white/10 text-slate-200">
                            {PLATFORM_OPTIONS.map((p) => (
                              <SelectItem key={p} value={p}>
                                {p}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1 w-full">
                        <Input
                          className="bg-slate-900/50 border-white/10 text-slate-200 rounded-xl"
                          value={link.href}
                          onChange={(e) =>
                            updateLink(i, "href", e.target.value)
                          }
                          placeholder="https://..."
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setLinks((prev) => prev.filter((_, idx) => idx !== i))
                        }
                        className="text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl"
                      >
                        <FaTimes size={16} />
                      </Button>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
