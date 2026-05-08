import { connectDB } from "@/lib/mongodb";
import AboutModel from "@/models/About";
import StatModel from "@/models/Stat";
import type { About } from "@/types";
import AboutClient from "./AboutClient";

async function getAbout(): Promise<About> {
  await connectDB();

  const [aboutDoc, statDocs] = await Promise.all([
    AboutModel.findOne().lean(),
    StatModel.find().sort({ order: 1 }).lean(),
  ]);

  const aboutRaw = aboutDoc ? JSON.parse(JSON.stringify(aboutDoc)) : {};
  const stats = statDocs ? JSON.parse(JSON.stringify(statDocs)) : [];

  // Split aboutBio into bio1 and bio2 by double newline
  const bios = (aboutRaw.aboutBio || "").split("\n\n");

  return {
    _id: aboutRaw._id?.toString(),
    title: aboutRaw.title || "Hello! I'm Shuvo",
    bio1: bios[0] || "",
    bio2: bios.slice(1).join("\n\n") || "",
    highlights: aboutRaw.highlights || [],
    stats: stats,
    skills: [], // Independent now
    education: [], // Independent now
  };
}

export default async function About() {
  const about = await getAbout();
  return <AboutClient about={about} />;
}
