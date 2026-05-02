import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";

import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const data = await Testimonial.find().sort({ order: 1 }).lean();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const testimonials: any[] = await req.json();

    // Clean slate synchronization
    await Testimonial.deleteMany({});
    
    if (testimonials.length > 0) {
      const sanitized = testimonials.map((t: any, i: number) => ({
        name: t.name,
        role: t.role,
        company: t.company || "",
        content: t.content,
        avatar: t.avatar || "",
        order: i,
      }));

      await Testimonial.insertMany(sanitized);
    }

    return NextResponse.json({ message: "Testimonials synchronized" });
  } catch (error: any) {
    console.error("Testimonial Sync Error:", error);
    return NextResponse.json({ error: error.message || "Failed to save" }, { status: 500 });
  }
}
