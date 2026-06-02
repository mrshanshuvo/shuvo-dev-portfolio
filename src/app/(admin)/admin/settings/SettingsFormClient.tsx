"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FaGlobe, FaEnvelope, FaPalette, FaShieldAlt } from "react-icons/fa";
import ImageUpload from "../components/ImageUpload";

export default function SettingsForm({
  initialSettings,
}: {
  initialSettings: any;
}) {
  const [settings, setSettings] = useState(initialSettings);
  const [prevInitialSettings, setPrevInitialSettings] = useState(initialSettings);
  const [status, setStatus] = useState<string | null>(null);
  const router = useRouter();

  // Keep local state in sync if initialSettings changes
  if (initialSettings !== prevInitialSettings) {
    setPrevInitialSettings(initialSettings);
    setSettings(initialSettings);
  }

  const saveMutation = useMutation({
    mutationFn: async (newSettings: any) => {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });
      if (!res.ok) throw new Error();
      return newSettings;
    },
    onSuccess: () => {
      setStatus("Settings applied successfully!");
      setTimeout(() => setStatus(null), 3000);
      router.refresh();
      // Optional: if we were querying this via React Query on client side, we'd invalidate here
    },
    onError: () => {
      setStatus("Failed to apply settings.");
      setTimeout(() => setStatus(null), 3000);
    },
  });

  const handleSave = async () => {
    setStatus("Saving DNA...");
    saveMutation.mutate(settings);
  };

  return (
    <div className="space-y-8 pb-20">
      {status && (
        <div
          className={`fixed top-24 right-8 z-100 px-6 py-4 rounded-2xl border shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-500 ${
            status.includes("Failed")
              ? "bg-red-500/10 border-red-500/20 text-red-400"
              : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
          }`}
        >
          <p className="font-bold">{status}</p>
        </div>
      )}

      {/* SEO & Brand */}
      <Card className="bg-white dark:bg-slate-900/40 border-slate-200 dark:border-white/5 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-sm dark:shadow-none">
        <CardHeader className="p-8 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-950/20">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
              <FaGlobe size={24} />
            </div>
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
              SEO & Branding
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Site Display Name
              </label>
              <Input
                value={settings.siteName}
                onChange={(e) =>
                  setSettings({ ...settings, siteName: e.target.value })
                }
                className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <ImageUpload
                label="OG Image (Social Share)"
                value={settings.ogImage}
                onChange={(url) => setSettings({ ...settings, ogImage: url })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Meta Description
            </label>
            <Textarea
              value={settings.siteDescription}
              onChange={(e) =>
                setSettings({ ...settings, siteDescription: e.target.value })
              }
              className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-white/10 rounded-xl h-24 text-slate-900 dark:text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Communication */}
      <Card className="bg-white dark:bg-slate-900/40 border-slate-200 dark:border-white/5 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-sm dark:shadow-none">
        <CardHeader className="p-8 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-950/20">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
              <FaEnvelope size={24} />
            </div>
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
              Communication
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Target Email (For Contact Form)
            </label>
            <Input
              type="email"
              value={settings.contactEmail}
              onChange={(e) =>
                setSettings({ ...settings, contactEmail: e.target.value })
              }
              className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white"
              placeholder="you@example.com"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Contact Phone
              </label>
              <Input
                value={settings.contactPhone}
                onChange={(e) =>
                  setSettings({ ...settings, contactPhone: e.target.value })
                }
                className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white"
                placeholder="+880123456789"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Contact Location
              </label>
              <Input
                value={settings.contactLocation}
                onChange={(e) =>
                  setSettings({ ...settings, contactLocation: e.target.value })
                }
                className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white"
                placeholder="Dhaka, Bangladesh"
              />
            </div>
          </div>
          <div className="flex items-center justify-between p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5">
            <div>
              <p className="text-slate-900 dark:text-white font-bold text-sm">
                Open for Hiring
              </p>
              <p className="text-slate-500 text-[10px] uppercase tracking-wider font-bold">
                Toggle &quot;Hire Me&quot; badges across the site.
              </p>
            </div>
            <button
              onClick={() =>
                setSettings({ ...settings, isHireable: !settings.isHireable })
              }
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.isHireable ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"}`}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.isHireable ? "left-7" : "left-1"}`}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Visuals & DNA */}
      <Card className="bg-white dark:bg-slate-900/40 border-slate-200 dark:border-white/5 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-sm dark:shadow-none">
        <CardHeader className="p-8 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-950/20">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400">
              <FaPalette size={24} />
            </div>
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
              Visual DNA
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Global Accent Color
            </label>
            <div className="flex flex-wrap gap-4">
              {["emerald", "blue", "purple", "rose", "amber"].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() =>
                    setSettings({ ...settings, accentColor: color })
                  }
                  className={`w-12 h-12 rounded-xl border-4 transition-all ${
                    settings.accentColor === color
                      ? "border-emerald-500 scale-110 shadow-lg"
                      : "border-transparent opacity-50 hover:opacity-100"
                  } bg-${color === "rose" ? "pink" : color === "emerald" ? "emerald" : color === "blue" ? "blue" : color === "purple" ? "purple" : "amber"}-500`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System */}
      <Card className="bg-white dark:bg-slate-900/40 border-rose-200 dark:border-red-500/10 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-sm dark:shadow-none">
        <CardHeader className="p-8 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-950/20">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-red-500/10 text-red-400">
              <FaShieldAlt size={24} />
            </div>
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
              Advanced System Controls
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="flex items-center justify-between p-6 rounded-2xl bg-rose-50 dark:bg-red-500/5 border border-rose-200 dark:border-red-500/10">
            <div>
              <p className="text-slate-900 dark:text-white font-bold text-sm">
                Maintenance Mode
              </p>
              <p className="text-slate-500 text-[10px] uppercase tracking-wider font-bold">
                Temporarily disable public access.
              </p>
            </div>
            <button
              onClick={() =>
                setSettings({
                  ...settings,
                  maintenanceMode: !settings.maintenanceMode,
                })
              }
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.maintenanceMode ? "bg-red-500" : "bg-slate-200 dark:bg-slate-800"}`}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.maintenanceMode ? "left-7" : "left-1"}`}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button
          onClick={handleSave}
          disabled={saveMutation.isPending}
          className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl px-12 h-16 font-black shadow-[0_20px_50px_rgba(16,185,129,0.3)] text-lg"
        >
          {saveMutation.isPending ? "Saving DNA..." : "Apply Global Changes"}
        </Button>
      </div>
    </div>
  );
}
