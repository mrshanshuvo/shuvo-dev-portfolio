import { connectDB } from "@/lib/mongodb";
import ProjectModel from "@/models/Project";
import { notFound } from "next/navigation";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import Image from "next/image";
import { getIcon } from "@/lib/techIconMap";
import type { Project } from "@/types";
import type { Metadata } from "next";
import ProjectDetailClient from "./ProjectDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connectDB();
  const { slug } = await params;
  const project = await ProjectModel.findOne({ slug }).lean();
  if (!project) return { title: "Project Not Found" };

  const title = `${project.title} · Projects`;
  const description = project.description;
  const image = project.image || "/favicons/android-chrome-512x512.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: [{ url: image, width: 1200, height: 630, alt: project.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  await connectDB();
  const { slug } = await params;
  const raw = await ProjectModel.findOne({ slug }).lean();
  if (!raw) notFound();

  const project: Project = {
    _id: raw._id.toString(),
    title: raw.title,
    slug: raw.slug,
    description: raw.description,
    image: raw.image,
    techNames: raw.techNames,
    github: raw.github,
    live: raw.live,
    featured: raw.featured,
    category: raw.category,
    improvements: raw.improvements,
    order: raw.order,
  };

  return <ProjectDetailClient project={project} />;
}
