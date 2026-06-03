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
  technologies?: IconType[]; // frontend-only
  techNames: string[]; // backward compatibility
  skillIds?: string[]; // relational database field
  github: LinkItem[];
  live: LinkItem[];
  featured: boolean;
  category?: string | string[]; // backward compatibility
  categoryIds?: string[]; // relational database field
  improvements: string[];
  media?: MediaItem[];
  order?: number;
}

export interface Experience {
  _id?: string;
  title: string;
  org: string;
  duration?: string; // backward compatibility
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string, undefined/null means current
  details: string[];
  order?: number;
  url?: string;
  previousTitles?: string[];
  links?: LinkItem[];
  technologies?: string[]; // backward compatibility
  skillIds?: string[]; // relational database field
}

export interface Technology {
  _id?: string;
  name: string;
  iconUrl: string;
  brandColor?: string;
  order?: number;
}

export interface Skill {
  _id?: string;
  name: string;
  tech: string;
  iconUrl?: string;
  order?: number;
}

export interface SocialLink {
  _id?: string;
  href: string;
  label: string;
  iconUrl?: string;
  brandColor?: string;
  invertDark?: boolean;
  order?: number;
  icon?: any; // frontend-only
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
  aboutBio: string;
  skills: Skill[];
}

export interface Education {
  _id?: string;
  degree: string;
  institution: string;
  location: string;
  logo: string;
  period?: string;
  startDate?: string;
  endDate?: string;
  gpa: string;
  details: string[];
  link: string;
  order?: number;
}

export interface About {
  _id?: string;
  bio: string;
  skills: Skill[];
  education: Education[];
}

export interface Hero {
  _id?: string;
  name: string;
  lastName: string;
  typeSequences: TypeSequenceItem[];
  tagline: string;
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

export interface Certification {
  _id?: string;
  title: string;
  issuer: string;
  date: string;
  issuedAt?: string; // ISO date string
  expiresAt?: string; // ISO date string
  certificateFile?: string;
  badgeLogo?: string;
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

export interface Category {
  _id?: string;
  name: string;
  slug: string;
  order: number;
}

export interface Demo {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  url: string;
  github?: string;
  featured?: boolean;
  image?: string;
  tech: string[]; // backward compatibility
  skillIds?: string[]; // relational database field
  media?: MediaItem[];
  order: number;
}
