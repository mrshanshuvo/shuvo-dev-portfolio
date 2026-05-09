"use client";
import { useState, useEffect, useRef, useCallback } from "react";
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
  FaGripLines,
} from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { motion, AnimatePresence } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import Image from "next/image";
import ImageUpload from "../components/ImageUpload";

// dnd-kit
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

// ─── Sortable Sequence Row ────────────────────────────────────────────────────
interface SeqRowProps {
  id: string;
  seq: TypeSequenceItem;
  index: number;
  onUpdate: (
    i: number,
    field: keyof TypeSequenceItem,
    val: string | number,
  ) => void;
  onRemove: (i: number) => void;
}

function SortableSeqItem({ id, seq, index, onUpdate, onRemove }: SeqRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col md:flex-row gap-4 items-start md:items-center p-2 bg-slate-50 dark:bg-slate-950/30 rounded-2xl border border-slate-200 dark:border-white/5 group transition-all hover:bg-slate-100 dark:hover:bg-slate-950/50 mb-2 shadow-sm dark:shadow-none"
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-slate-600 hover:text-slate-400 transition-colors p-1 rounded-lg hover:bg-slate-800/60 shrink-0 touch-none self-center"
        aria-label="Drag to reorder"
        type="button"
      >
        <FaGripLines size={13} />
      </button>

      {/* Order badge */}
      <span className="text-[10px] font-bold text-slate-600 w-4 text-center shrink-0 self-center">
        {index + 1}
      </span>

      {/* Text input */}
      <div className="flex-1 w-full">
        <Input
          className="bg-white dark:bg-transparent border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl focus-visible:ring-purple-500/50 h-10 shadow-sm dark:shadow-none"
          value={seq.text}
          onChange={(e) => onUpdate(index, "text", e.target.value)}
          placeholder="e.g. Full-Stack Developer"
        />
      </div>

      {/* Delay + remove */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="relative">
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            className="bg-white dark:bg-transparent border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl focus-visible:ring-purple-500/50 w-28 pr-10 h-10 shadow-sm dark:shadow-none"
            value={seq.delay}
            onChange={(e) => onUpdate(index, "delay", +e.target.value || 0)}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-600 uppercase">
            ms
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(index)}
          className="text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
          type="button"
        >
          <FaTimes size={14} />
        </Button>
      </div>
    </div>
  );
}

// ─── Drag Overlay ghost card ──────────────────────────────────────────────────
function SeqOverlay({ seq }: { seq: TypeSequenceItem }) {
  return (
    <div className="w-full flex items-center gap-4 p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl border border-purple-500/30 shadow-2xl shadow-purple-500/10 ring-1 ring-purple-400/20">
      <FaGripLines size={13} className="text-purple-400/70 shrink-0" />
      <span className="w-4" />
      <div className="flex-1 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-900 dark:text-white text-sm truncate">
        {seq.text || <span className="text-slate-500 italic">empty</span>}
      </div>
      <div className="w-28 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-900 dark:text-white text-sm text-right">
        {seq.delay} <span className="text-slate-500 text-[10px]">ms</span>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminHeroPage() {
  const [data, setData] = useState<Hero>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [activeSeqId, setActiveSeqId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

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

  const updateSeq = useCallback(
    (i: number, field: keyof TypeSequenceItem, val: string | number) => {
      setData((d) => {
        const seqs = [...d.typeSequences];
        seqs[i] = { ...seqs[i], [field]: val };
        return { ...d, typeSequences: seqs };
      });
    },
    [],
  );

  const removeSeq = useCallback((i: number) => {
    setData((d) => ({
      ...d,
      typeSequences: d.typeSequences.filter((_, idx) => idx !== i),
    }));
  }, []);

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

  function handleSeqDragStart(e: DragStartEvent) {
    setActiveSeqId(e.active.id as string);
  }

  function handleSeqDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (over && active.id !== over.id) {
      setData((d) => {
        const oldIndex = d.typeSequences.findIndex(
          (_, i) => i.toString() === active.id,
        );
        const newIndex = d.typeSequences.findIndex(
          (_, i) => i.toString() === over.id,
        );
        return {
          ...d,
          typeSequences: arrayMove(d.typeSequences, oldIndex, newIndex),
        };
      });
    }
    setActiveSeqId(null);
  }

  const activeSeq =
    activeSeqId !== null ? data.typeSequences[Number(activeSeqId)] : null;

  return (
    // DndContext at outermost level so DragOverlay is outside all
    // backdrop-blur/overflow containers — prevents coordinate offset bug
    <DndContext
      sensors={sensors}
      onDragStart={handleSeqDragStart}
      onDragEnd={handleSeqDragEnd}
    >
      <div className="p-4 md:p-8 space-y-6">
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

        <div className="max-w-350 mx-auto space-y-6">
          {/* Floating save button will be at the bottom */}

          <div className="space-y-8">
            {loading ? (
              /* Skeleton State */
              Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/20 backdrop-blur-sm overflow-hidden shadow-sm dark:shadow-none">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-100 dark:bg-slate-800/40 rounded-xl w-10 h-10 animate-pulse" />
                        <div className="space-y-2">
                          <div className="h-5 w-32 bg-slate-100 dark:bg-slate-800/60 rounded-lg animate-pulse" />
                          <div className="h-3 w-48 bg-slate-800/30 rounded-lg animate-pulse" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="h-12 bg-slate-800/20 rounded-2xl animate-pulse" />
                        <div className="h-12 bg-slate-800/20 rounded-2xl animate-pulse" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-700">
                <div className="flex flex-col gap-6">
                  {/* Identity Card */}
                  <Card className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-sm dark:shadow-none">
                    <CardHeader className="p-4 pb-1">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl">
                          <FaUser size={20} />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                            Identity
                          </CardTitle>
                          <CardDescription className="text-slate-500 dark:text-slate-400">
                            Your personal branding and display name.
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                          First Name
                        </label>
                        <Input
                          className="bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl focus-visible:ring-emerald-500/50 shadow-sm dark:shadow-none"
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
                          className="bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl focus-visible:ring-emerald-500/50 shadow-sm dark:shadow-none"
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
                  <Card className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-sm dark:shadow-none">
                    <CardHeader className="p-4 pb-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-purple-500/20 text-purple-400 rounded-xl">
                            <FaInfoCircle size={20} />
                          </div>
                          <div>
                            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                              Typing Sequences
                            </CardTitle>
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
                          className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-white/5 rounded-xl active:scale-95 shadow-sm dark:shadow-none"
                        >
                          <FaPlus size={12} className="mr-1" /> Add New
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      {/* Column labels */}
                      {data.typeSequences.length > 0 && (
                        <div className="flex items-center gap-4 px-1 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                          <span className="w-5" />
                          <span className="w-4" />
                          <span className="flex-1">Text</span>
                          <span className="w-28 text-center">Delay</span>
                          <span className="w-9" />
                        </div>
                      )}

                      {/* Sortable list */}
                      <SortableContext
                        items={data.typeSequences.map((_, i) => i.toString())}
                        strategy={verticalListSortingStrategy}
                      >
                        <AnimatePresence mode="popLayout">
                          {data.typeSequences.map((seq, i) => (
                            <motion.div
                              key={`seq-${i}`}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.16 }}
                            >
                              <SortableSeqItem
                                id={i.toString()}
                                seq={seq}
                                index={i}
                                onUpdate={updateSeq}
                                onRemove={removeSeq}
                              />
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </SortableContext>

                      {data.typeSequences.length === 0 && (
                        <div className="text-center py-8 bg-slate-50 dark:bg-slate-950/20 rounded-2xl border border-dashed border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
                          <p className="text-slate-500 text-sm italic">
                            No typing sequences added.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                {/* Assets Card */}
                <Card className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-sm dark:shadow-none">
                  <CardHeader className="p-4 pb-1">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl">
                        <FaImage size={20} />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                          Assets
                        </CardTitle>
                        <CardDescription className="text-slate-500 dark:text-slate-400">
                          Profile picture and resume document.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            )}
          </div>
        </div>
      </div>

      {/* DragOverlay outside all backdrop-blur containers to avoid
          fixed-position coordinate offset bug */}
      <DragOverlay dropAnimation={null}>
        {activeSeq ? <SeqOverlay seq={activeSeq} /> : null}
      </DragOverlay>

      {/* Floating Save Button */}
      <div className="fixed bottom-10 right-10 z-50">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl p-6 font-black shadow-[0_20px_50px_rgba(16,185,129,0.3)] text-base active:scale-95 transition-all group"
        >
          <FaSave
            className={cn(
              "mr-1 transition-transform duration-500",
              saving ? "animate-spin" : "group-hover:rotate-12",
            )}
            size={20}
          />
          {saving ? "Saving DNA..." : "Apply Changes"}
        </Button>
      </div>
    </DndContext>
  );
}
