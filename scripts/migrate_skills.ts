// Migration script — one-time use, run via ts-node scripts/migrate_skills.ts
import { connectDB } from "../src/lib/mongodb";
import Skill from "../src/models/Skill";
import Tech from "../src/models/Tech";

const migrationMap: Record<string, { slug: string; color: string }> = {
  "React": { slug: "react", color: "#61DAFB" },
  "Next.js": { slug: "nextdotjs", color: "#000000" },
  "Next.js 14": { slug: "nextdotjs", color: "#000000" },
  "Node.js": { slug: "nodedotjs", color: "#339933" },
  "MongoDB": { slug: "mongodb", color: "#47A248" },
  "Tailwind CSS": { slug: "tailwindcss", color: "#38BDF8" },
  "Express": { slug: "express", color: "#000000" },
  "Express.js": { slug: "express", color: "#000000" },
  "Firebase": { slug: "firebase", color: "#FFCA28" },
  "Leaflet": { slug: "leaflet", color: "#199900" },
  "TensorFlow": { slug: "tensorflow", color: "#FF9F00" },
  "Django": { slug: "django", color: "#092E20" },
  "Docker": { slug: "docker", color: "#2496ED" },
  "Python": { slug: "python", color: "#3776AB" },
  "TypeScript": { slug: "typescript", color: "#3178C6" },
  "PostgreSQL": { slug: "postgresql", color: "#4169E1" },
  "Redis": { slug: "redis", color: "#DC382D" },
  "GraphQL": { slug: "graphql", color: "#E10098" },
  "Prisma": { slug: "prisma", color: "#2D3748" },
  "GitHub": { slug: "github", color: "#181717" },
  "Git": { slug: "git", color: "#F05032" },
  "AWS": { slug: "amazonwebservices", color: "#FF9900" },
  "Google Cloud": { slug: "googlecloud", color: "#4285F4" },
  "GitHub Actions": { slug: "githubactions", color: "#2088FF" },
  "CI/CD": { slug: "githubactions", color: "#2088FF" },
  "FastAPI": { slug: "fastapi", color: "#009688" },
  "Flask": { slug: "flask", color: "#000000" },
  "Scikit-learn": { slug: "scikitlearn", color: "#F7931E" },
  "Pandas": { slug: "pandas", color: "#150458" },
  "NumPy": { slug: "numpy", color: "#013243" },
};

async function runMigration() {
  await connectDB();
  console.log("Connected to MongoDB for skills migration...");

  // 1. Fetch singleton Tech banner document
  const techDoc = await Tech.findOne().lean();
  const techList = techDoc?.techList || [];
  console.log(`Found ${techList.length} technologies in Tech banner model.`);

  // 2. Loop over techList and migrate into Skill documents
  let createdCount = 0;
  let updatedCount = 0;

  for (const techName of techList) {
    const meta = migrationMap[techName] || { slug: techName.toLowerCase().replace(/[^a-z0-9]/g, ""), color: "#10B981" };
    
    // Check if Skill document with this name already exists
    const existing = await Skill.findOne({ name: techName });

    if (existing) {
      // Update existing record with technology meta
      await Skill.findByIdAndUpdate(existing._id, {
        isTechnology: true,
        iconSlug: meta.slug,
        brandColor: meta.color,
        tech: "Technology",
      });
      console.log(`Updated existing Skill document: "${techName}" -> slug: ${meta.slug}, color: ${meta.color}`);
      updatedCount++;
    } else {
      // Create new Skill technology document
      await Skill.create({
        name: techName,
        tech: "Technology",
        level: 80,
        iconName: "FaCode",
        isTechnology: true,
        iconSlug: meta.slug,
        brandColor: meta.color,
      });
      console.log(`Created new Technology Skill document: "${techName}" -> slug: ${meta.slug}, color: ${meta.color}`);
      createdCount++;
    }
  }

  console.log("\n🎉 MIGRATION COMPLETE!");
  console.log(`Total processed: ${techList.length}`);
  console.log(`Created new skills: ${createdCount}`);
  console.log(`Updated existing skills: ${updatedCount}`);
  
  process.exit(0);
}

runMigration().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
