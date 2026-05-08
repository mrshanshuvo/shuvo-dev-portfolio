import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import About from "@/models/About";
import Skill from "@/models/Skill";
import Stat from "@/models/Stat";
import Experience from "@/models/Experience";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const about = await About.findOne().lean();
  const [skills, stats, education] = await Promise.all([
    Skill.find().sort({ order: 1 }).lean(),
    Stat.find().sort({ order: 1 }).lean(),
    Experience.find({ type: "education" }).sort({ order: 1 }).lean(),
  ]);

  return NextResponse.json({
    ...(about ?? {}),
    title: about?.title || "Hello! I'm Shuvo",
    bio1: (about?.aboutBio || "").split("\n\n")[0] || "",
    bio2: (about?.aboutBio || "").split("\n\n").slice(1).join("\n\n") || "",
    skills: skills || [],
    stats: stats || [],
    education: education.map((edu: any) => ({
      degree: edu.title,
      institution: edu.org,
      period: edu.duration,
      details: Array.isArray(edu.details) ? edu.details[0] : edu.details,
    })),
  });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await request.json();

  // Only manage what this route owns: bio text, highlights, techList.
  // Skills → /api/admin/skills, Stats → /api/admin/stats, Education → /api/admin/education
  const aboutData = {
    title: body.title || "Hello! I'm Shuvo",
    aboutBio: `${body.bio1 || ""}\n\n${body.bio2 || ""}`.trim(),
    highlights: body.highlights || [],
    techList: body.techList || [],
  };
  const about = await About.findOneAndUpdate({}, aboutData, {
    returnDocument: "after",
    upsert: true,
    runValidators: true,
  });

  return NextResponse.json({ success: true, about });
}
