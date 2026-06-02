import type { IconType } from "react-icons";
import {
  FaReact,
  FaNodeJs,
  FaDatabase,
  FaMobileAlt,
  FaGithub,
  FaPython,
} from "react-icons/fa";
import {
  SiNextdotjs,
  SiMongodb,
  SiTensorflow,
  SiDjango,
  SiTailwindcss,
  SiExpress,
  SiDocker,
  SiLeaflet,
  SiTypescript,
  SiPostgresql,
  SiRedis,
  SiGraphql,
  SiPrisma,
} from "react-icons/si";

export const techIconMap: Record<string, IconType> = {
  React: FaReact,
  "Next.js": SiNextdotjs,
  "Node.js": FaNodeJs,
  MongoDB: SiMongodb,
  "Tailwind CSS": SiTailwindcss,
  "Express.js": SiExpress,
  Firebase: FaMobileAlt,
  Leaflet: SiLeaflet,
  TensorFlow: SiTensorflow,
  Django: SiDjango,
  Docker: SiDocker,
  Python: FaPython,
  TypeScript: SiTypescript,
  PostgreSQL: SiPostgresql,
  Redis: SiRedis,
  GraphQL: SiGraphql,
  Prisma: SiPrisma,
  GitHub: FaGithub,
  Database: FaDatabase,
};

export function getIcon(techName: string): IconType {
  return techIconMap[techName] ?? FaDatabase;
}

export const techColorMap: Record<string, string> = {
  React: "text-sky-400",
  "Next.js": "text-slate-900 dark:text-white",
  "Node.js": "text-green-600 dark:text-green-500",
  MongoDB: "text-emerald-500",
  "Tailwind CSS": "text-sky-400",
  "Express.js": "text-slate-500 dark:text-slate-400",
  Firebase: "text-amber-500",
  Leaflet: "text-green-500",
  TensorFlow: "text-orange-500",
  Django: "text-emerald-800 dark:text-emerald-500",
  Docker: "text-blue-500",
  Python: "text-blue-400",
  TypeScript: "text-blue-600 dark:text-blue-400",
  PostgreSQL: "text-indigo-600 dark:text-indigo-400",
  Redis: "text-red-500",
  GraphQL: "text-pink-500",
  Prisma: "text-slate-800 dark:text-slate-200",
  GitHub: "text-slate-900 dark:text-white",
};

export function getColorClass(techName: string): string {
  return techColorMap[techName] ?? "text-emerald-500";
}
