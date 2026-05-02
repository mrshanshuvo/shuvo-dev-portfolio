import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";

import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const data = await Blog.find().sort({ order: 1 }).lean();
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
    await Blog.deleteMany({});
    
    if (items.length > 0) {
      const sanitized = items.map((it: any, i: number) => ({
        title: it.title,
        description: it.description,
        link: it.link,
        date: it.date,
        tags: Array.isArray(it.tags) ? it.tags : [],
        image: it.image || "",
        order: i,
      }));

      await Blog.insertMany(sanitized);
    }

    return NextResponse.json({ message: "Blogs synchronized" });
  } catch (error: any) {
    console.error("Blog Sync Error:", error);
    return NextResponse.json({ error: error.message || "Failed to save" }, { status: 500 });
  }
}
