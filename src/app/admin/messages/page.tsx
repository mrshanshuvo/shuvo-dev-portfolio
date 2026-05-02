"use client";

import { useState, useEffect } from "react";
import {
  FaTrash,
  FaEnvelope,
  FaEnvelopeOpen,
  FaCheck,
  FaTimes,
  FaUser,
  FaCalendarAlt,
  FaInbox,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Shadcn UI Imports
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: "unread" | "read";
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function load() {
    try {
      const res = await fetch("/api/admin/messages");
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      showToast("Failed to load messages", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("Message deleted");
        setMessages((prev) => prev.filter((m) => m._id !== id));
        if (selectedMessage?._id === id) setSelectedMessage(null);
      }
    } catch (error) {
      showToast("Failed to delete", "error");
    }
  }

  async function markAsRead(message: Message) {
    if (message.status === "read") return;
    try {
      const res = await fetch(`/api/admin/messages/${message._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "read" }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) =>
            m._id === message._id ? { ...m, status: "read" } : m,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  }

  const unreadCount = messages.filter((m) => m.status === "unread").length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-10">
      {/* Toast */}
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

      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative">
            <div className="absolute -left-4 top-0 w-1 h-12 bg-blue-500 rounded-full blur-sm" />
            <h1 className="text-4xl font-black text-white tracking-tight mb-2 flex items-center gap-4">
              Messages
              {unreadCount > 0 && (
                <Badge className="bg-blue-600 text-white rounded-lg px-2 py-0.5 text-xs animate-bounce">
                  {unreadCount} New
                </Badge>
              )}
            </h1>
            <p className="text-slate-400 font-medium">
              Manage your inquiries and client messages.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Message List */}
          <div className="lg:col-span-5 space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            {loading ? (
              /* Skeleton Loader List */
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="p-5 bg-slate-900/20 rounded-3xl border border-white/5 space-y-3 animate-pulse"
                >
                  <div className="flex justify-between items-start">
                    <div className="h-4 w-24 bg-slate-800/60 rounded" />
                    <div className="h-3 w-12 bg-slate-800/30 rounded" />
                  </div>
                  <div className="h-3 w-full bg-slate-800/20 rounded" />
                </div>
              ))
            ) : messages.length === 0 ? (
              <div className="text-center py-20 bg-slate-900/20 rounded-3xl border border-dashed border-white/5">
                <FaInbox size={40} className="mx-auto text-slate-800 mb-4" />
                <p className="text-slate-500 font-medium tracking-tight">
                  Your inbox is empty.
                </p>
              </div>
            ) : (
              messages.map((m) => (
                <motion.div
                  key={m._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => {
                    setSelectedMessage(m);
                    markAsRead(m);
                  }}
                >
                  <Card
                    className={cn(
                      "rounded-3xl border transition-all cursor-pointer group overflow-hidden relative",
                      selectedMessage?._id === m._id
                        ? "bg-blue-600/10 border-blue-500/40 shadow-lg shadow-blue-500/5"
                        : "bg-slate-900/40 border-white/5 hover:border-white/10",
                      m.status === "unread" &&
                        "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1.5 before:bg-blue-500",
                    )}
                  >
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <p
                          className={cn(
                            "font-bold truncate max-w-[150px]",
                            m.status === "unread"
                              ? "text-white"
                              : "text-slate-400",
                          )}
                        >
                          {m.name}
                        </p>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                          {new Date(m.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <p
                        className={cn(
                          "text-xs line-clamp-1",
                          m.status === "unread"
                            ? "text-slate-300"
                            : "text-slate-500",
                        )}
                      >
                        {m.message}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>

          {/* Message Content */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {selectedMessage ? (
                <motion.div
                  key={selectedMessage._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <Card className="rounded-[2.5rem] border border-white/10 bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-2xl">
                    <CardContent className="p-8 md:p-12 space-y-8">
                      {/* Meta */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                            <FaUser size={28} />
                          </div>
                          <div>
                            <h2 className="text-2xl font-black text-white tracking-tight">
                              {selectedMessage.name}
                            </h2>
                            <p className="text-blue-400 font-bold text-sm tracking-wide">
                              {selectedMessage.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-slate-500 text-xs font-bold uppercase tracking-widest bg-slate-950/50 px-4 py-2 rounded-full border border-white/5">
                          <FaCalendarAlt className="text-blue-500" />
                          {new Date(selectedMessage.createdAt).toLocaleString()}
                        </div>
                      </div>

                      {/* Body */}
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />{" "}
                          Message Body
                        </h4>
                        <div className="text-slate-300 leading-relaxed text-lg whitespace-pre-wrap font-medium">
                          {selectedMessage.message}
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between pt-8 border-t border-white/5">
                        <a
                          href={`mailto:${selectedMessage.email}`}
                          className="group"
                        >
                          <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl px-8 h-12 font-bold shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-all">
                            <FaEnvelope className="mr-2" /> Reply via Email
                          </Button>
                        </a>
                        <Button
                          variant="ghost"
                          onClick={() => handleDelete(selectedMessage._id)}
                          className="w-12 h-12 rounded-2xl bg-red-500/5 text-red-500 hover:bg-red-500/20 hover:text-red-400 border border-transparent hover:border-red-500/20"
                        >
                          <FaTrash size={18} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <div className="h-[500px] flex flex-col items-center justify-center text-center space-y-4 bg-slate-900/20 rounded-[3rem] border border-dashed border-white/5">
                  <div className="w-20 h-20 rounded-3xl bg-slate-900 flex items-center justify-center text-slate-700">
                    <FaEnvelopeOpen size={40} />
                  </div>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                    Select a message to read
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
