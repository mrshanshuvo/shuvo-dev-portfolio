import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Hero from "@/models/Hero";
import About from "@/models/About";
import SocialLink from "@/models/SocialLink";
import Skill from "@/models/Skill";
import Stat from "@/models/Stat";
import Testimonial from "@/models/Testimonial";
import Certification from "@/models/Certification";
import Blog from "@/models/Blog";
import Service from "@/models/Service";
import Workflow from "@/models/Workflow";
import Demo from "@/models/Demo";

export async function GET() {
  await connectDB();

  const [
    hero,
    about,
    socialLinks,
    skills,
    stats,
    testimonials,
    certifications,
    blogs,
    services,
    workflow,
    demos,
  ] = await Promise.all([
    Hero.findOne().lean(),
    About.findOne().lean(),
    SocialLink.find().sort({ order: 1 }).lean(),
    Skill.find().sort({ order: 1 }).lean(),
    Stat.find().sort({ order: 1 }).lean(),
    Testimonial.find().sort({ order: 1 }).lean(),
    Certification.find().sort({ order: 1 }).lean(),
    Blog.find().sort({ order: 1 }).lean(),
    Service.find().sort({ order: 1 }).lean(),
    Workflow.find().sort({ order: 1 }).lean(),
    Demo.find().sort({ order: 1 }).lean(),
  ]);

  const profile = {
    ...(hero || {}),
    ...(about || {}),
    socialLinks: socialLinks || [],
    skills: skills || [],
    stats: stats || [],
    testimonials: testimonials || [],
    certifications: certifications || [],
    blogs: blogs || [],
    services: services || [],
    workflow: workflow || [],
    demos: demos || [],
  };

  return NextResponse.json(profile, {
    headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
  });
}
