import { connectDB } from "@/lib/mongodb";
import ProjectModel from "@/models/Project";
import type { Project } from "@/types";
import ProjectsClient from "./ProjectsClient";

async function getProjects() {
  await connectDB();
  const raw = await ProjectModel.find({ featured: true })
    .sort({ order: 1, createdAt: -1 })
    .lean();
  // Ensure deep serialization of subdocuments (github/live links)
  return JSON.parse(JSON.stringify(raw));
}

export default async function Projects() {
  const projects = await getProjects();
  return <ProjectsClient projects={projects} />;
}
