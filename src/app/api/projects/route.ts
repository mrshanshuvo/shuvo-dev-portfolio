import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import Skill from "@/models/Skill";
import Category from "@/models/Category";

// Public: GET /api/projects — used by portfolio pages
export async function GET() {
  await connectDB();
  // Ensure target schemas are registered before populate is called
  const _modelRef = [Skill, Category];
  if (_modelRef.length > 0) { /* register model check */ }
  const projects = await Project.find()
    .populate("skillIds")
    .populate("categoryIds")
    .sort({ order: 1, createdAt: -1 })
    .lean();

  const mappedProjects = projects.map((p: any) => ({
    ...p,
    techNames: Array.isArray(p.skillIds) ? p.skillIds.map((s: any) => s.name || s.toString()) : [],
    category: Array.isArray(p.categoryIds) ? p.categoryIds.map((c: any) => c.name || c.toString()) : [],
  }));

  return NextResponse.json(mappedProjects, {
    headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
  });
}
