import { connectDB } from "@/lib/mongodb";
import ProjectModel from "@/models/Project";
import type { Project } from "@/types";
import ProjectsArchiveClient from "./ProjectsArchiveClient";
import Navbar from "@/app/components/Navbar/Navbar";
import HeroModel from "@/models/Hero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects Archive | Shahid Hasan Shuvo",
  description:
    "A comprehensive showcase of my technical projects across various domains.",
};

async function getProjects(): Promise<Project[]> {
  await connectDB();
  const raw = await ProjectModel.find()
    .sort({ order: 1, createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(raw));
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  // Need this for Navbar consistency
  const heroDoc = await HeroModel.findOne().lean();

  const resumeUrl = heroDoc?.resumeUrl || "/Resume_of_Shahid_Hasan_Shuvo.pdf";

  return (
    <>
      <Navbar resumeUrl={resumeUrl} />
      <ProjectsArchiveClient projects={projects} />
    </>
  );
}
