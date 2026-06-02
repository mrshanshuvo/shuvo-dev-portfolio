import { connectDB } from "@/lib/mongodb";
import DemoModel from "@/models/Demo";
import PlaygroundClient from "./PlaygroundClient";
import { getIconRegistry } from "@/lib/iconRegistry";

async function getDemos(): Promise<any[]> {
  await connectDB();
  const raw = await DemoModel.find().sort({ createdAt: -1 }).limit(4).lean();
  return JSON.parse(JSON.stringify(raw));
}

export default async function Playground() {
  const demos = await getDemos();
  if (!demos || demos.length === 0) return null;
  const iconRegistry = await getIconRegistry();
  return <PlaygroundClient demos={demos} iconRegistry={iconRegistry} />;
}
