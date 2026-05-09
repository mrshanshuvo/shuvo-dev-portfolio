import { connectDB } from "@/lib/mongodb";
import EducationModel from "@/models/Education";
import type { Education as EducationType } from "@/types";
import EducationClient from "./EducationClient";

async function getEducation() {
  await connectDB();
  const raw = await EducationModel.find().sort({ order: 1 }).lean();
  // Ensure deep serialization for subdocuments
  return JSON.parse(JSON.stringify(raw));
}

export default async function Education() {
  const education = await getEducation();
  if (!education || education.length === 0) return null;
  return <EducationClient education={education} />;
}
