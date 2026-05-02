import { connectDB } from "@/lib/mongodb";
import ExperienceModel from "@/models/Experience";
import type { Experience } from "@/types";
import ExperienceClient from "./ExperienceClient";

async function getExperiences(): Promise<Experience[]> {
  await connectDB();
  const raw = await ExperienceModel.find({ type: "work" }).sort({ order: 1 }).lean();
  return raw.map((e) => ({
    _id: e._id.toString(),
    title: e.title,
    org: e.org,
    duration: e.duration,
    details: e.details,
    color: e.color,
    type: e.type,
    order: e.order,
  }));
}

export default async function Experience() {
  const experiences = await getExperiences();
  return <ExperienceClient experiences={experiences} />;
}
