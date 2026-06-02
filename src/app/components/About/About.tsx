import { connectDB } from "@/lib/mongodb";
import AboutModel from "@/models/About";
import type { About } from "@/types";
import AboutClient from "./AboutClient";

async function getAbout(): Promise<About> {
  await connectDB();

  const aboutDoc = await AboutModel.findOne().lean();

  const aboutRaw = aboutDoc ? JSON.parse(JSON.stringify(aboutDoc)) : {};

  return {
    _id: aboutRaw._id?.toString(),
    bio: aboutRaw.aboutBio || "",
    highlights: aboutRaw.highlights || [],
    skills: [], // Independent now
    education: [], // Independent now
  };
}

export default async function About() {
  const about = await getAbout();
  return <AboutClient about={about} />;
}
