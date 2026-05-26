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
