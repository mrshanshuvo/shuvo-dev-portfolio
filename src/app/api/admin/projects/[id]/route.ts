import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import mongoose from "mongoose";

type Params = { params: Promise<{ id: string }> };

function sanitizeProject(it: any) {
  let media = Array.isArray(it.media) ? it.media : [];
  if (media.length === 0 && it.image) {
    media = [{ type: "image", url: it.image, caption: "Project Showcase" }];
  }
  return {
    title: it.title,
    slug: it.slug || it.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
    description: it.description,
    image: it.image || (media[0]?.type === "image" ? media[0].url : ""),
    techNames: Array.isArray(it.techNames) ? it.techNames : [],
    github: Array.isArray(it.github)
      ? it.github.map((g: any) => ({ label: g.label || "Repository", url: g.url || "" }))
      : it.github ? [{ label: "Repository", url: it.github }] : [],
    live: Array.isArray(it.live)
      ? it.live.map((l: any) => ({ label: l.label || "Live Demo", url: l.url || "" }))
      : it.live ? [{ label: "Live Demo", url: it.live }] : [],
    featured: !!it.featured,
    category: it.category || "Full Stack",
    improvements: Array.isArray(it.improvements) ? it.improvements : [],
    media: media.map((m: any) => ({
      type: ["image", "video", "embed"].includes(m.type) ? m.type : "image",
      url: m.url || "",
      caption: m.caption || "",
      thumbnail: m.thumbnail || "",
    })),
    order: it.order ?? 0,
  };
}

export async function GET(_req: Request, { params }: Params) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await connectDB();
    const project = await Project.findById(id).lean();
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const p = project as any;
    return NextResponse.json({
      ...p,
      github: Array.isArray(p.github) ? p.github : p.github ? [{ label: "Repository", url: p.github }] : [],
      live: Array.isArray(p.live) ? p.live : p.live ? [{ label: "Live Demo", url: p.live }] : [],
      media: Array.isArray(p.media) ? p.media : [],
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await connectDB();
    const body = await req.json();
    const sanitized = sanitizeProject(body);

    const updated = await Project.findByIdAndUpdate(id, sanitized, { new: true }).lean();
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await connectDB();
    await Project.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
