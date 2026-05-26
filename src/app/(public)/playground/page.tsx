import { connectDB } from "@/lib/mongodb";
import DemoModel from "@/models/Demo";
import type { Demo } from "@/types";
import PlaygroundArchiveClient from "./PlaygroundArchiveClient";
import Navbar from "@/app/components/Navbar/Navbar";
import HeroModel from "@/models/Hero";
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

  const heroDoc = await HeroModel.findOne().lean();

  const resumeUrl = heroDoc?.resumeUrl || "/Resume_of_Shahid_Hasan_Shuvo.pdf";

  return (
    <>
      <Navbar resumeUrl={resumeUrl} />
      <PlaygroundArchiveClient demos={demos} />
    </>
  );
}
