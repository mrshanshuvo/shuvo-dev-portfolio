import {
  FaGithub,
  FaReact,
  FaNodeJs,
  FaDatabase,
  FaMobileAlt,
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
} from "react-icons/si";
import type { Project } from "@/types";

export const projects: Project[] = [
  {
    title: "Medical Camp Management System (MCMS)",
    slug: "mcms",
    description:
      "Full MERN stack system for managing medical camps with organizer & participant roles. Firebase Admin setup, Stripe payment, JWT authentication.",
    image: "/images/mcms.png",
    technologies: [FaReact, SiNextdotjs, FaNodeJs, SiMongodb, SiTailwindcss],
    techNames: ["React", "Next.js", "Node.js", "MongoDB", "Tailwind CSS"],
    github: [{ label: "GitHub", url: "https://github.com/mrshanshuvo/mcms" }],
    live: [{ label: "Live Demo", url: "https://mcms-auth.web.app/" }],
    featured: true,
    category: "Full Stack",
    improvements: [
      "Implemented JWT authentication and Firebase security rules for multi-role access.",
      "Optimized database queries to reduce load times by 40%.",
      "Handled responsive design for multiple devices.",
      "Integrated Stripe payments securely.",
      "Enhanced collaboration between frontend and backend using RESTful APIs.",
    ],
  },
  {
    title: "WhereIsIt",
    slug: "whereisit",
    description:
      "Lost & found portal for posting and recovering items. Backend API, JWT & Firebase Auth, stats tracking.",
    image: "/images/whereisit.png",
    technologies: [FaReact, FaNodeJs, SiExpress, SiMongodb, FaMobileAlt],
    techNames: ["React", "Node.js", "Express.js", "MongoDB", "Firebase"],
    github: [
      { label: "GitHub", url: "https://github.com/mrshanshuvo/whereisit" },
    ],
    live: [
      {
        label: "Live Demo",
        url: "https://simple-firebase-auth-9089a.web.app/",
      },
    ],
    featured: true,
    category: "Full Stack",
    improvements: [
      "Developed a real-time matching system using TensorFlow.",
      "Implemented JWT auth with Firebase for secure logins.",
      "Built mobile-first responsive UI for all devices.",
      "Tracked user interactions and improved search accuracy.",
      "Learned performance optimization techniques for ML models.",
    ],
  },
  {
    title: "Parcel Delivery System (ProFast)",
    slug: "profast",
    description:
      "Parcel tracking website with live map integration and responsive UI. Leaflet map, tracking dashboard, role-based UI.",
    image: "/images/profast.png",
    technologies: [
      FaReact,
      FaNodeJs,
      SiExpress,
      SiMongodb,
      SiLeaflet,
      SiTailwindcss,
    ],
    techNames: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Leaflet",
      "Tailwind CSS",
    ],
    github: [
      {
        label: "GitHub",
        url: "https://github.com/mrshanshuvo/zap-shift-client",
      },
    ],
    live: [{ label: "Live Demo", url: "https://profast-94805.web.app/" }],
    featured: true,
    category: "Full Stack",
    improvements: [
      "Integrated Leaflet maps for real-time tracking.",
      "Optimized dashboard performance for large datasets.",
      "Implemented role-based UI for admins and users.",
      "Responsive mobile design with touch gestures.",
      "Improved delivery route calculations using geolocation APIs.",
    ],
  },
  {
    title: "Car Doctor Next.js",
    slug: "car-doctor-nextjs",
    description:
      "Car repair booking platform with real-time scheduling and responsive UI. Booking system, user authentication, modern UI.",
    image: "/images/car-doctor.png",
    technologies: [SiNextdotjs, FaReact, SiTailwindcss, FaNodeJs],
    techNames: ["Next.js", "React", "Tailwind CSS", "Node.js"],
    github: [
      { label: "GitHub", url: "https://github.com/mrshanshuvo/car-doctor" },
    ],
    live: [
      { label: "Live Demo", url: "https://car-doctor-nextjs-ten.vercel.app/" },
    ],
    featured: false,
    category: "Full Stack",
    improvements: [
      "Implemented a real-time booking scheduler.",
      "Improved UI accessibility with ARIA attributes.",
      "Optimized API calls for faster page loads.",
      "Responsive design across desktop and mobile.",
    ],
  },
  {
    title: "My Personal Portfolio",
    slug: "my-portfolio",
    description:
      "Explore my full-stack projects, UI/UX designs, and professional journey in one interactive place. Responsive design, modern UI/UX, project showcase.",
    image: "/images/portfolio.png",
    technologies: [SiNextdotjs, FaReact, SiTailwindcss, FaNodeJs],
    techNames: ["Next.js", "React", "Tailwind CSS", "Node.js"],
    github: [
      { label: "GitHub", url: "https://github.com/mrshanshuvo/my-portfolio-1" },
    ],
    live: [
      {
        label: "Live Demo",
        url: "https://my-portfolio-1-five-tawny.vercel.app/",
      },
    ],
    featured: false,
    category: "Full Stack",
    improvements: [
      "Implemented smooth animations with Framer Motion.",
      "Ensured accessibility and contrast for dark mode.",
      "Optimized image loading for faster performance.",
      "Responsive layout for mobile, tablet, and desktop.",
    ],
  },
];
