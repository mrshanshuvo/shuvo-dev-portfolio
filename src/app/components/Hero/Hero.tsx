import { connectDB } from "@/lib/mongodb";
import HeroModel from "@/models/Hero";
import SocialLinkModel from "@/models/SocialLink";
import AboutModel from "@/models/About";
import type { Hero } from "@/types";
import HeroClient from "./HeroClient";

export default async function Hero() {
  await connectDB();
  const [heroDoc, socialDocs, aboutDoc] = await Promise.all([
    HeroModel.findOne().lean(),
    SocialLinkModel.find().sort({ order: 1 }).lean(),
    AboutModel.findOne().lean(),
  ]);

  const raw = heroDoc ? JSON.parse(JSON.stringify(heroDoc)) : {};
  const socials = socialDocs ? JSON.parse(JSON.stringify(socialDocs)) : [];
  const about = aboutDoc ? JSON.parse(JSON.stringify(aboutDoc)) : {};

  const hero: Hero = {
    _id: raw._id?.toString(),
    name: raw.name ?? "Shahid Hasan",
    lastName: raw.lastName ?? "Shuvo",
    typeSequences: raw.typeSequences?.length
      ? raw.typeSequences
      : [{ text: "Full-Stack Web Developer", delay: 2000 }],
    bio:
      raw.heroBio ??
      raw.bio ??
      "Crafting exceptional digital experiences with clean code and modern technologies.",
    profileImage: raw.profileImage ?? "/PP1.jpeg",
    resumeUrl: raw.resumeUrl ?? "/Resume_of_Shahid_Hasan_Shuvo.pdf",
    socialLinks: socials,
  };

  return <HeroClient hero={hero} aboutBio={about.aboutBio || ""} />;
}
