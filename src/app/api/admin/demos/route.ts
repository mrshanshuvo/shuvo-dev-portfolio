import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Demo from "@/models/Demo";

import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const data = await Demo.find().sort({ order: 1 }).lean();
    return NextResponse.json(data);
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
    await Demo.deleteMany({});
    
    if (items.length > 0) {
      const sanitized = items.map((it: any, i: number) => {
        // Self-healing: handle legacy images if they exist
        let media = Array.isArray(it.media) ? it.media : [];
        if (media.length === 0 && (it as any).image) {
          media = [{ type: "image", url: (it as any).image, caption: "Demo Preview" }];
        }

        return {
          title: it.title,
          description: it.description,
          url: it.url,
          tech: Array.isArray(it.tech) ? it.tech : [],
          media: media.map((m: any) => ({
            type: ["image", "video", "embed"].includes(m.type) ? m.type : "image",
            url: m.url || "",
            caption: m.caption || "",
          })),
          order: i,
        };
      });

      await Demo.insertMany(sanitized);
    }

    return NextResponse.json({ message: "Demos synchronized" });
  } catch (error: any) {
    console.error("Demo Sync Error:", error);
    return NextResponse.json({ error: error.message || "Failed to save" }, { status: 500 });
  }
}
