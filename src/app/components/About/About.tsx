import { connectDB } from "@/lib/mongodb";
import AboutModel from "@/models/About";
import SkillModel from "@/models/Skill";
import StatModel from "@/models/Stat";
import ExperienceModel from "@/models/Experience";
import EducationModel from "@/models/Education";
import type { About, Education } from "@/types";
import AboutClient from "./AboutClient";

async function getAbout(): Promise<About> {
  await connectDB();

  const [aboutDoc, skillDocs, statDocs, educationDocs] = await Promise.all([
    AboutModel.findOne().lean(),
    SkillModel.find().sort({ order: 1 }).lean(),
    StatModel.find().sort({ order: 1 }).lean(),
    EducationModel.find().sort({ order: 1 }).lean(),
  ]);

  const aboutRaw = aboutDoc ? JSON.parse(JSON.stringify(aboutDoc)) : {};
  const skills = skillDocs ? JSON.parse(JSON.stringify(skillDocs)) : [];
  const stats = statDocs ? JSON.parse(JSON.stringify(statDocs)) : [];
  const education: Education[] = educationDocs.map((edu: any) => ({
    degree: edu.degree,
    institution: edu.institution,
    period: edu.period,
    details: edu.details,
    location: edu.location,
    logo: edu.logo,
    gpa: edu.gpa,
    link: edu.link,
  }));

  // Split aboutBio into bio1 and bio2 by double newline
  const bios = (aboutRaw.aboutBio || "").split("\n\n");

  return {
    _id: aboutRaw._id?.toString(),
    bio1: bios[0] || "",
    bio2: bios.slice(1).join("\n\n") || "",
    highlights: aboutRaw.highlights || [],
    stats: stats,
    skills: skills,
    techList: aboutRaw.techList || [],
    education: education,
  };
}

export default async function About() {
  const about = await getAbout();
  return <AboutClient about={about} />;
}
