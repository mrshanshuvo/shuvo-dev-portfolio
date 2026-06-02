import { connectDB } from "@/lib/mongodb";
import ProjectModel from "@/models/Project";
import ProjectsClient from "./ProjectsClient";
import { getIconRegistry } from "@/lib/iconRegistry";

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
  const iconRegistry = await getIconRegistry();
  return <ProjectsClient projects={projects} iconRegistry={iconRegistry} />;
}
