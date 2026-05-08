import { connectDB } from "@/lib/mongodb";
import HeroModel from "@/models/Hero";
import SocialLinkModel from "@/models/SocialLink";
import type { Hero } from "@/types";
import HeroClient from "./HeroClient";

async function getHero(): Promise<Hero> {
  await connectDB();
  const [heroDoc, socialDocs] = await Promise.all([
    HeroModel.findOne().lean(),
    SocialLinkModel.find().sort({ order: 1 }).lean(),
  ]);

  const raw = heroDoc ? JSON.parse(JSON.stringify(heroDoc)) : {};
  const socials = socialDocs ? JSON.parse(JSON.stringify(socialDocs)) : [];

  return {
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
}

export default async function Hero() {
  const hero = await getHero();
  return <HeroClient hero={hero} />;
}
