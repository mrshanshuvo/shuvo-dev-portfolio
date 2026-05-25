import { IconType } from "react-icons";

// ─── Portfolio types ────────────────────────────────────────────────

export interface MediaItem {
  type: "image" | "video" | "embed";
  url: string;
  caption?: string;
  thumbnail?: string;
}

export interface LinkItem {
  label?: string;
  url: string;
}

export interface Project {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  technologies?: IconType[]; // frontend-only, built from techNames
  techNames: string[];
  github: LinkItem[];
  live: LinkItem[];
  featured: boolean;
  category: string | string[];
  improvements: string[];
  media?: MediaItem[];
  order?: number;
}

export interface Experience {
  _id?: string;
  title: string;
  org: string;
  duration: string;
  details: string[];
  order?: number;
  url?: string;
  previousTitles?: string[];
  links?: LinkItem[];
  technologies?: string[];
}

export interface Skill {
  name: string;
  tech: string;
  level: number;
  iconName: string;
}

export interface Stat {
  _id?: string;
  number: string;
  label: string;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
  order?: number; // display order
}

export interface SocialLink {
  platform: string;
  href: string;
  label: string;
  icon?: IconType; // frontend-only
}

export interface TypeSequenceItem {
  text: string;
  delay: number;
}

export interface Profile {
  _id?: string;
  name: string;
  lastName: string;
  profileImage: string;
  resumeUrl: string;
  typeSequences: TypeSequenceItem[];
  heroBio: string;
  socialLinks: SocialLink[];
  aboutTitle: string;
  aboutBio: string;
  highlights: string[];
  stats: Stat[];
  skills: Skill[];
}

export interface Education {
  _id?: string;
  degree: string;
  institution: string;
  location: string;
  logo: string;
  period: string;
  gpa: string;
  details: string[];
  link: string;
  order?: number;
}

export interface About {
  _id?: string;
  title: string;
  bio1: string;
  bio2: string;
  highlights: string[];
  stats: Stat[];
  skills: Skill[];
  education: Education[];
}

export interface Hero {
  _id?: string;
  name: string;
  lastName: string;
  typeSequences: TypeSequenceItem[];
  bio: string;
  profileImage: string;
  resumeUrl: string;
  socialLinks: SocialLink[];
}

// ─── Legacy / util types ────────────────────────────────────────────

export interface NavItem {
  id: string;
  label: string;
}

export interface ContactInfo {
  icon: IconType;
  label: string;
  value: string;
  link: string | null;
}

export interface Status {
  message: string;
  type: "success" | "error" | "loading" | "";
}

export interface Testimonial {
  _id?: string;
  name: string;
  role: string;
  content: string;
  avatar?: string;
  company?: string;
  order: number;
}

export interface Certification {
  _id?: string;
  title: string;
  issuer: string;
  date: string;
  link?: string;
  image?: string;
  details: string[];
  order: number;
}

export interface Blog {
  _id?: string;
  title: string;
  description: string;
  link: string;
  date: string;
  tags: string[];
  image?: string;
  order: number;
}

export interface Service {
  _id?: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  order: number;
}

export interface WorkflowStep {
  _id?: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

export interface Category {
  _id?: string;
  name: string;
  slug: string;
  order: number;
}

export interface Demo {
  _id?: string;
  title: string;
  description: string;
  url: string;
  tech: string[];
  media?: MediaItem[];
  order: number;
}
