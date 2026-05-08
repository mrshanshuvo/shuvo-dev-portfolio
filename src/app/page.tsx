import { Suspense } from "react";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import Skills from "./components/Skills/Skills";
import Education from "./components/Education/Education";
import Contact from "./components/Contact/Contact";
import Projects from "./components/Projects/Projects";
import Experience from "./components/Experience/Experience";
import Services from "./components/Services/Services";
import Workflow from "./components/Workflow/Workflow";
import Playground from "./components/Playground/Playground";
import Blog from "./components/Writing/Blog";
import Certifications from "./components/Certifications/Certifications";
import Testimonials from "./components/Testimonials/Testimonials";
import VisitorTracker from "./components/Analytics/VisitorTracker";
import {
  SectionSkeleton,
  TimelineSkeleton,
  ListSkeleton,
} from "./components/UI/Skeletons";

import { connectDB } from "@/lib/mongodb";
import SocialLinkModel from "@/models/SocialLink";
import SettingModel from "@/models/Setting";
import HeroModel from "@/models/Hero";
import type { SocialLink } from "@/types";

export default async function Home() {
  await connectDB();
  const [socialDocs, settingDoc, heroDoc] = await Promise.all([
    SocialLinkModel.find().sort({ order: 1 }).lean(),
    SettingModel.findOne().lean(),
    HeroModel.findOne().lean(),
  ]);

  const socialLinks = JSON.parse(JSON.stringify(socialDocs)) as SocialLink[];
  const contactEmail = settingDoc?.contactEmail || "mrshanshuvo@gmail.com";
  const resumeUrl = heroDoc?.resumeUrl || "/Resume_of_Shahid_Hasan_Shuvo.pdf";

  return (
    <>
      <VisitorTracker />
      <Navbar resumeUrl={resumeUrl} />
      <main id="main-content">
        <Hero />
        <Suspense fallback={<SectionSkeleton cols={1} />}>
          <About />
        </Suspense>
        <Suspense fallback={<SectionSkeleton cols={1} />}>
          <Skills />
        </Suspense>
        <Suspense fallback={<SectionSkeleton cols={3} />}>
          <Education />
        </Suspense>
        <Suspense fallback={<SectionSkeleton cols={3} />}>
          <Services />
        </Suspense>
        <Suspense fallback={<SectionSkeleton cols={4} />}>
          <Workflow />
        </Suspense>
        <Suspense fallback={<TimelineSkeleton />}>
          <Experience />
        </Suspense>
        <Suspense fallback={<SectionSkeleton cols={3} />}>
          <Projects />
        </Suspense>
        <Suspense fallback={<SectionSkeleton cols={2} />}>
          <Playground />
        </Suspense>
        <Suspense fallback={<SectionSkeleton cols={3} />}>
          <Blog />
        </Suspense>
        <Suspense fallback={<ListSkeleton count={6} />}>
          <Certifications />
        </Suspense>
        <Suspense fallback={<SectionSkeleton cols={3} />}>
          <Testimonials />
        </Suspense>
        <Contact
          socialLinks={socialLinks}
          contactEmail={contactEmail}
          contactPhone={settingDoc?.contactPhone}
          contactLocation={settingDoc?.contactLocation}
        />
      </main>
    </>
  );
}
