import { connectDB } from "@/lib/mongodb";
import AboutModel from "@/models/About";
import SkillModel from "@/models/Skill";
import StatModel from "@/models/Stat";
import ExperienceModel from "@/models/Experience";
import EducationModel from "@/models/Education";
import type { About, Education } from "@/types";
import AboutClient from "./AboutClient";

const DEFAULT_ABOUT: About = {
  bio1: "I'm a passionate Computer Science & Engineering student at Green University of Bangladesh, specializing in full-stack development and machine learning.",
  bio2: "With over 2 years of experience, I've mastered technologies like React, Node.js, Django, TensorFlow, and more.",
  highlights: [
    "Building scalable full-stack applications",
    "Machine Learning & AI integration",
    "Clean code & best practices advocate",
    "Continuous learner & tech enthusiast",
  ],
  stats: [
    { number: "20+", label: "Projects Completed" },
    { number: "2+", label: "Years Experience" },
    { number: "10+", label: "Technologies" },
    { number: "5", label: "Certifications" },
  ],
  skills: [
    { name: "Frontend", tech: "React, Next.js, JavaScript", level: 90, iconName: "SiReact" },
    { name: "Backend", tech: "Node.js, Express, Django", level: 85, iconName: "SiNodedotjs" },
    { name: "Database", tech: "MongoDB, MySQL, Firebase", level: 80, iconName: "FaDatabase" },
    { name: "DevOps", tech: "Netlify, Docker, Vercel", level: 75, iconName: "FaCloud" },
    { name: "ML/AI", tech: "TensorFlow, PyTorch, Scikit-learn", level: 70, iconName: "SiTensorflow" },
    { name: "Other", tech: "Python, Java, C++", level: 85, iconName: "FaRobot" },
  ],
  techList: [
    "React", "Next.js", "Node.js", "Express", "MongoDB", "Python",
    "Django", "TensorFlow", "Git", "Tailwind CSS", "TypeScript", "PostgreSQL", "AWS", "Docker",
  ],
  education: [
    {
      degree: "BSc in Computer Science & Engineering",
      institution: "Green University of Bangladesh",
      period: "2021 - 2024",
      details: "Specialized in Software Engineering & Machine Learning",
    },
  ],
};

async function getAbout(): Promise<About> {
  await connectDB();
  
  const [aboutDoc, skillDocs, statDocs, educationDocs] = await Promise.all([
    AboutModel.findOne().lean(),
    SkillModel.find().sort({ order: 1 }).lean(),
    StatModel.find().sort({ order: 1 }).lean(),
    EducationModel.find().sort({ order: 1 }).lean(),
  ]);

  if (!aboutDoc) return DEFAULT_ABOUT;

  const about = JSON.parse(JSON.stringify(aboutDoc));
  const skills = JSON.parse(JSON.stringify(skillDocs));
  const stats = JSON.parse(JSON.stringify(statDocs));
  const education: Education[] = educationDocs.map((edu: any) => ({
    degree: edu.degree,
    institution: edu.institution,
    period: edu.period,
    details: edu.details,
  }));

  // Split aboutBio into bio1 and bio2 by double newline
  const bios = (about.aboutBio || "").split("\n\n");

  return {
    _id: about._id?.toString(),
    bio1: bios[0] || DEFAULT_ABOUT.bio1,
    bio2: bios.slice(1).join("\n\n") || DEFAULT_ABOUT.bio2,
    highlights: about.highlights?.length ? about.highlights : DEFAULT_ABOUT.highlights,
    stats: stats.length ? stats : DEFAULT_ABOUT.stats,
    skills: skills.length ? skills : DEFAULT_ABOUT.skills,
    techList: about.techList?.length ? about.techList : DEFAULT_ABOUT.techList,
    education: education.length ? education : DEFAULT_ABOUT.education,
  };
}

export default async function About() {
  const about = await getAbout();
  return <AboutClient about={about} />;
}
