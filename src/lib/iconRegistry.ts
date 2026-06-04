import { connectDB } from "./mongodb";
import TechnologyModel from "@/models/Technology";

export async function getIconRegistry(): Promise<Record<string, string>> {
  await connectDB();
  const techs = await TechnologyModel.find({ iconUrl: { $ne: "" } }).lean();
  const registry: Record<string, string> = {};
  for (const t of techs as any[]) {
    if (t.name && t.iconUrl) {
      registry[t.name] = t.iconUrl;
    }
  }
  return registry;
}
