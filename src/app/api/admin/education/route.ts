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
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const items: any[] = await req.json();

  await Education.deleteMany({});
  if (items.length > 0) {
    await Education.insertMany(
      items.map((item: any, i: number) => ({
        degree: item.degree,
        institution: item.institution,
        period: item.period,
        details: item.details,
        order: i,
      }))
    );
  }

  return NextResponse.json({ message: "Education saved" });
}
