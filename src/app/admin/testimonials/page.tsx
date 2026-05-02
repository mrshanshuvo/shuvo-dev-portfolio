"use client";
import { useState, useEffect } from "react";
import {
  FaPlus,
  FaTimes,
  FaCheck,
  FaSave,
  FaQuoteLeft,
  FaUserCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import ImageUpload from "../components/ImageUpload";
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
import { cn } from "@/lib/utils";

interface Testimonial {
  name: string;
  role: string;
  content: string;
  avatar?: string;
  company?: string;
}

export default function AdminTestimonialsPage() {
  const [data, setData] = useState<Testimonial[]>([]);
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
    fetch("/api/admin/testimonials")
      .then((r) => r.json())
      .then((d) => {
        setData(Array.isArray(d) ? d : []);
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/admin/testimonials", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    if (res.ok) showToast("Testimonials saved!");
    else showToast("Failed to save.", "error");
  }

  function addTestimonial() {
    setData((prev) => [
      ...prev,
      { name: "New Client", role: "CEO", content: "", company: "" },
    ]);
  }

  function updateTestimonial(i: number, field: keyof Testimonial, val: string) {
    setData((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: val };
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
              Testimonials
            </h1>
            <p className="text-slate-400">
              Manage client feedback and social proof.
            </p>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold px-8 shadow-lg shadow-blue-600/20"
          >
            <FaSave className={cn("mr-2", saving && "animate-spin")} />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </header>

        <Card className="rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-white">
                Client Quotes
              </CardTitle>
              <Button
                variant="outline"
                onClick={addTestimonial}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border-white/5 rounded-xl"
              >
                <FaPlus size={12} className="mr-2" /> Add Quote
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <AnimatePresence mode="popLayout">
              {loading ? (
                /* Skeleton Loader List */
                Array.from({ length: 3 }).map((_, i) => (
                  <motion.div
                    key={`skeleton-${i}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="p-6 bg-slate-950/20 rounded-2xl border border-white/5 space-y-6 animate-pulse mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="w-full h-32 bg-slate-800/30 rounded-2xl" />
                          <div className="h-10 w-full bg-slate-800/40 rounded-xl" />
                          <div className="h-10 w-full bg-slate-800/40 rounded-xl" />
                        </div>
                        <div className="h-40 bg-slate-800/20 rounded-2xl w-full" />
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                data.map((item, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={i}
                    className="p-6 bg-slate-950/40 rounded-2xl border border-white/5 relative group mb-4"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setData((prev) => prev.filter((_, idx) => idx !== i))
                      }
                      className="absolute top-4 right-4 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl"
                    >
                      <FaTimes size={14} />
                    </Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <ImageUpload
                          label="Client Avatar"
                          value={item.avatar || ""}
                          onChange={(url) =>
                            updateTestimonial(i, "avatar", url)
                          }
                        />
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                            Client Name
                          </label>
                          <div className="relative">
                            <FaUserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <Input
                              className="bg-slate-900/50 border-white/10 text-white rounded-xl pl-10"
                              value={item.name}
                              onChange={(e) =>
                                updateTestimonial(i, "name", e.target.value)
                              }
                              placeholder="John Doe"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                            Role / Position
                          </label>
                          <Input
                            className="bg-slate-900/50 border-white/10 text-white rounded-xl"
                            value={item.role}
                            onChange={(e) =>
                              updateTestimonial(i, "role", e.target.value)
                            }
                            placeholder="CTO at Tech Corp"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                          Testimonial Content
                        </label>
                        <div className="relative">
                          <FaQuoteLeft className="absolute left-3 top-3 text-slate-700" />
                          <Textarea
                            className="bg-slate-900/50 border-white/10 text-white rounded-xl min-h-[100px] pl-10"
                            value={item.content}
                            onChange={(e) =>
                              updateTestimonial(i, "content", e.target.value)
                            }
                            placeholder="He is an amazing developer..."
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
            {data.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-3xl">
                <FaQuoteLeft className="mx-auto text-slate-800 mb-4" size={32} />
                <p className="text-slate-500">No testimonials added yet.</p>
                <Button
                  variant="link"
                  onClick={addTestimonial}
                  className="text-blue-400 mt-2"
                >
                  Add your first one
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
