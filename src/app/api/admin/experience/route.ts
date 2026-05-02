import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Experience from "@/models/Experience";

export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const experiences = await Experience.find({ type: "work" }).sort({ order: 1 }).lean();
    return NextResponse.json(experiences);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const experiences: any[] = await req.json();

    // Clean slate synchronization
    await Experience.deleteMany({ type: "work" });
    
    if (experiences.length > 0) {
      const sanitized = experiences.map((e: any, i: number) => ({
        title: e.title,
        org: e.org,
        location: e.location || "",
        duration: e.duration,
        logo: e.logo || "",
        details: Array.isArray(e.details) 
          ? e.details 
          : (e.details ? [e.details] : []),
        color: e.color || "emerald",
        type: "work",
        order: i,
      }));

      await Experience.insertMany(sanitized);
    }

    return NextResponse.json({ message: "Experience synchronized" });
  } catch (error: any) {
    console.error("Experience Sync Error:", error);
    return NextResponse.json({ error: error.message || "Failed to save" }, { status: 500 });
  }
}
