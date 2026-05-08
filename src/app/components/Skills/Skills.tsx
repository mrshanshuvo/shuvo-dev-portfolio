import { connectDB } from "@/lib/mongodb";
import SkillModel from "@/models/Skill";
import TechModel from "@/models/Tech";
import SkillsClient from "./SkillsClient";

async function getSkillsData() {
  await connectDB();
  const [skillDocs, techDoc] = await Promise.all([
    SkillModel.find().sort({ order: 1 }).lean(),
    TechModel.findOne().lean(),
  ]);

  return {
    skills: JSON.parse(JSON.stringify(skillDocs)),
    techList: techDoc?.techList || [],
  };
}

export default async function Skills() {
  const { skills, techList } = await getSkillsData();
  if (!skills || skills.length === 0) return null;
  return <SkillsClient skills={skills} techList={techList} />;
}
