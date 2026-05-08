import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Skill from "@/models/Skill";
import Tech from "@/models/Tech";

export async function GET() {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const [skills, techDoc] = await Promise.all([
    Skill.find().sort({ order: 1 }).lean(),
    Tech.findOne().lean(),
  ]);

  return NextResponse.json({
    skills: skills || [],
    techList: techDoc?.techList || [],
  });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { skills, techList } = await req.json();

  // Save Skills
  await Skill.deleteMany({});
  if (skills && skills.length > 0) {
    await Skill.insertMany(
      skills.map((s: any, i: number) => ({
        name: s.name,
        tech: s.tech,
        level: s.level,
        iconName: s.iconName,
        order: i,
        _id: undefined,
      })),
    );
  }

  // Save Tech List
  await Tech.findOneAndUpdate(
    {},
    { techList: techList || [] },
    { upsert: true, new: true },
  );

  return NextResponse.json({ message: "Skills & Tech saved" });
}
