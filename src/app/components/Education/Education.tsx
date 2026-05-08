import { connectDB } from "@/lib/mongodb";
import EducationModel from "@/models/Education";
import type { Education as EducationType } from "@/types";
import EducationClient from "./EducationClient";

async function getEducation(): Promise<EducationType[]> {
  await connectDB();
  const educationDocs = await EducationModel.find().sort({ order: 1 }).lean();

  return educationDocs.map((edu: any) => ({
    degree: edu.degree,
    institution: edu.institution,
    period: edu.period,
    details: edu.details,
    location: edu.location,
    logo: edu.logo,
    gpa: edu.gpa,
    link: edu.link,
  }));
}

export default async function Education() {
  const education = await getEducation();
  if (!education || education.length === 0) return null;
  return <EducationClient education={education} />;
}
