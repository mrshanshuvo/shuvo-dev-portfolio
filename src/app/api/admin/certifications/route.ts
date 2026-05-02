import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Certification from "@/models/Certification";

import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const data = await Certification.find().sort({ order: 1 }).lean();
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
    const certifications: any[] = await req.json();

    // Clean slate synchronization
    await Certification.deleteMany({});
    
    if (certifications.length > 0) {
      const sanitized = certifications.map((c: any, i: number) => ({
        title: c.title,
        issuer: c.issuer,
        date: c.date,
        link: c.link || "",
        image: c.image || "",
        details: Array.isArray(c.details) 
          ? c.details 
          : (c.details ? [c.details] : []),
        order: i,
      }));

      await Certification.insertMany(sanitized);
    }

    return NextResponse.json({ message: "Certifications synchronized" });
  } catch (error: any) {
    console.error("Certification Sync Error:", error);
    return NextResponse.json({ error: error.message || "Failed to save" }, { status: 500 });
  }
}
