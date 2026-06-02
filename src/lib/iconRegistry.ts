import { connectDB } from "./mongodb";
import SkillModel from "@/models/Skill";

export async function getIconRegistry(): Promise<Record<string, string>> {
  await connectDB();
  const skills = await SkillModel.find({ isTechnology: true, iconUrl: { $ne: "" } }).lean();
  const registry: Record<string, string> = {};
  for (const s of skills as any[]) {
    if (s.name && s.iconUrl) {
      registry[s.name] = s.iconUrl;
    }
  }
  return registry;
}
