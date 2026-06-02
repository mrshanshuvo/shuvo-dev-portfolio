import { connectDB } from "@/lib/mongodb";
import AboutModel from "@/models/About";
import type { About } from "@/types";
import AboutClient from "./AboutClient";

async function getAbout(): Promise<About> {
  await connectDB();

  const aboutDoc = await AboutModel.findOne().lean();

  const aboutRaw = aboutDoc ? JSON.parse(JSON.stringify(aboutDoc)) : {};

  // Split aboutBio into bio1 and bio2 by double newline
  const bios = (aboutRaw.aboutBio || "").split("\n\n");

  return {
    _id: aboutRaw._id?.toString(),
    title: aboutRaw.title || "Hello! I'm Shuvo",
    bio1: bios[0] || "",
    bio2: bios.slice(1).join("\n\n") || "",
    highlights: aboutRaw.highlights || [],
    skills: [], // Independent now
    education: [], // Independent now
  };
}

export default async function About() {
  const about = await getAbout();
  return <AboutClient about={about} />;
}
