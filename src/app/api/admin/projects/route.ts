import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";

export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const projects = await Project.find().sort({ order: 1 }).lean();
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const items: any[] = await req.json();

    // Clean slate synchronization
    await Project.deleteMany({});
    
    if (items.length > 0) {
      const sanitized = items.map((it: any, i: number) => {
        // Self-healing: if media is empty but legacy image exists, migrate it
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
          github: it.github || "",
          live: it.live || "",
          featured: !!it.featured,
          category: it.category || "Full Stack",
          improvements: Array.isArray(it.improvements) ? it.improvements : [],
          media: media.map((m: any) => ({
            type: ["image", "video", "embed"].includes(m.type) ? m.type : "image",
            url: m.url || "",
            caption: m.caption || "",
            thumbnail: m.thumbnail || "",
          })),
          order: i,
        };
      });

      await Project.insertMany(sanitized);
    }

    return NextResponse.json({ message: "Projects synchronized" });
  } catch (error: any) {
    console.error("Project Sync Error:", error);
    return NextResponse.json({ error: error.message || "Failed to save" }, { status: 500 });
  }
}
