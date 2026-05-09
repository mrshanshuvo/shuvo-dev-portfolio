import { connectDB } from "@/lib/mongodb";
import DemoModel from "@/models/Demo";
import type { Demo } from "@/types";
import PlaygroundArchiveClient from "./PlaygroundArchiveClient";
import Navbar from "@/app/components/Navbar/Navbar";
import HeroModel from "@/models/Hero";
import SocialLinkModel from "@/models/SocialLink";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technical Playground | Shahid Hasan Shuvo",
  description:
    "A lab for experimental code, prototypes, and technical explorations.",
};

async function getDemos(): Promise<Demo[]> {
  await connectDB();
  const raw = await DemoModel.find().sort({ order: 1, createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(raw));
}

export default async function PlaygroundPage() {
  const demos = await getDemos();

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
      <PlaygroundArchiveClient demos={demos} />
    </>
  );
}
