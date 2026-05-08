import { connectDB } from "@/lib/mongodb";
import SkillModel from "@/models/Skill";
import AboutModel from "@/models/About";
import SkillsClient from "./SkillsClient";

async function getSkillsData() {
  await connectDB();
  const [skillDocs, aboutDoc] = await Promise.all([
    SkillModel.find().sort({ order: 1 }).lean(),
    AboutModel.findOne().lean(),
  ]);

  return {
    skills: JSON.parse(JSON.stringify(skillDocs)),
    techList: aboutDoc?.techList || [],
  };
}

export default async function Skills() {
  const { skills, techList } = await getSkillsData();
  if (!skills || skills.length === 0) return null;
  return <SkillsClient skills={skills} techList={techList} />;
}
