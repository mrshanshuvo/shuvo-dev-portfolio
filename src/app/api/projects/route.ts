import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";

// Public: GET /api/projects — used by portfolio pages
export async function GET() {
  await connectDB();
  const projects = await Project.find()
    .sort({ order: 1, createdAt: -1 })
    .lean();
  return NextResponse.json(projects, {
    headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
  });
}
