import { connectDB } from "@/lib/mongodb";
import BlogModel from "@/models/Blog";
import type { Blog } from "@/types";
import BlogArchiveClient from "./BlogArchiveClient";
import Navbar from "@/app/components/Navbar/Navbar";
import HeroModel from "@/models/Hero";
import SocialLinkModel from "@/models/SocialLink";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog & Technical Writing | Shahid Hasan Shuvo",
  description:
    "Explore my latest thoughts on software engineering, machine learning, and web development.",
};

async function getBlogs(): Promise<Blog[]> {
  await connectDB();
  const raw = await BlogModel.find().sort({ order: 1, createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(raw));
}

export default async function BlogPage() {
  const blogs = await getBlogs();

  // Need these for Navbar and Footer consistency
  const [heroDoc, socialDocs] = await Promise.all([
    HeroModel.findOne().lean(),
    SocialLinkModel.find().sort({ order: 1 }).lean(),
  ]);

  const resumeUrl = heroDoc?.resumeUrl || "/Resume_of_Shahid_Hasan_Shuvo.pdf";
  const socialLinks = JSON.parse(JSON.stringify(socialDocs));

  return (
    <>
      <Navbar resumeUrl={resumeUrl} />
      <BlogArchiveClient blogs={blogs} />
    </>
  );
}
