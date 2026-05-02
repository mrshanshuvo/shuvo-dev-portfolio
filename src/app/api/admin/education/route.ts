import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Education from "@/models/Education";

export async function GET() {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const education = await Education.find().sort({ order: 1 }).lean();
  return NextResponse.json(education);
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const items: any[] = await req.json();

    // Clean slate: delete all and re-insert for perfect synchronization
    await Education.deleteMany({});
    
    if (items.length > 0) {
      const sanitizedItems = items.map((item: any, i: number) => ({
        degree: item.degree,
        institution: item.institution,
        location: item.location || "",
        logo: item.logo || "",
        period: item.period,
        gpa: item.gpa || "",
        // Ensure details is an array for the new schema
        details: Array.isArray(item.details) 
          ? item.details 
          : (item.details ? [item.details] : []),
        link: item.link || "",
        order: i,
      }));

      await Education.insertMany(sanitizedItems);
    }

    return NextResponse.json({ message: "Education synchronized successfully" });
  } catch (err: any) {
    console.error("Education Sync Error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
