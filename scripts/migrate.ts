import mongoose from "mongoose";
import Project from "../src/models/Project";
import Category from "../src/models/Category";
import Skill from "../src/models/Skill";
import Experience from "../src/models/Experience";
import Education from "../src/models/Education";
import Certification from "../src/models/Certification";
import Blog from "../src/models/Blog";
import Visitor from "../src/models/Visitor";
import Hero from "../src/models/Hero";
import Setting from "../src/models/Setting";
import Tech from "../src/models/Tech";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ ERROR: MONGODB_URI is not set in .env.local");
  process.exit(1);
}

// Custom date parsers
function parseDateString(str: string): Date {
  if (!str) return new Date();
  const parsed = Date.parse(str);
  if (!isNaN(parsed)) return new Date(parsed);

  const parts = str.split(" ");
  if (parts.length === 2) {
    const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    const month = monthNames.indexOf(parts[0].toLowerCase().slice(0, 3));
    const year = parseInt(parts[1]);
    if (month !== -1 && !isNaN(year)) {
      return new Date(year, month, 1);
    }
  }

  const yearOnly = parseInt(str);
  if (!isNaN(yearOnly) && yearOnly > 1900 && yearOnly < 2100) {
    return new Date(yearOnly, 0, 1);
  }

  return new Date();
}

function parsePeriod(period: string): { startDate: Date; endDate: Date | null } {
  if (!period) return { startDate: new Date(), endDate: null };
  const parts = period.split("-").map((p) => p.trim());
  const startDate = parseDateString(parts[0]);
  let endDate: Date | null = null;
  if (parts.length > 1) {
    const endStr = parts[1].toLowerCase();
    if (endStr !== "present" && endStr !== "current" && endStr !== "now") {
      endDate = parseDateString(parts[1]);
    }
  }
  return { startDate, endDate };
}

async function run() {
  try {
    console.log("🔄 Connecting to MongoDB database...");
    await mongoose.connect(MONGODB_URI!);
    console.log("✅ Connected successfully!");

    // ==========================================
    // 1. MIGRATING CATEGORIES AND SKILLS
    // ==========================================
    console.log("\n🔄 Step 1: Mapping Categories & Skills...");

    // Fetch all existing projects to build list of categories and skills
    const rawProjects = await Project.find({}).lean();
    console.log(`Found ${rawProjects.length} existing projects.`);

    const uniqueCategories = new Set<string>();
    const uniqueSkills = new Set<string>();

    rawProjects.forEach((p: any) => {
      if (Array.isArray(p.category)) {
        p.category.forEach((c: string) => uniqueCategories.add(c));
      } else if (typeof p.category === "string" && p.category) {
        uniqueCategories.add(p.category);
      }

      const tech = p.techNames || p.technologies || [];
      tech.forEach((t: string) => uniqueSkills.add(t));
    });

    console.log(`Unique categories detected: ${Array.from(uniqueCategories).join(", ")}`);
    console.log(`Unique skills detected: ${Array.from(uniqueSkills).join(", ")}`);

    // Create Category documents
    const categoryMap = new Map<string, mongoose.Types.ObjectId>();
    for (const catName of uniqueCategories) {
      const slug = catName.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
      const existing = await Category.findOne({ slug });
      if (existing) {
        categoryMap.set(catName, existing._id as mongoose.Types.ObjectId);
      } else {
        const created = await Category.create({ name: catName, slug });
        categoryMap.set(catName, created._id as mongoose.Types.ObjectId);
        console.log(`Created Category: "${catName}"`);
      }
    }

    // Create Skill documents
    const skillMap = new Map<string, mongoose.Types.ObjectId>();
    for (const skillName of uniqueSkills) {
      const existing = await Skill.findOne({ name: skillName });
      if (existing) {
        skillMap.set(skillName, existing._id as mongoose.Types.ObjectId);
      } else {
        const created = await Skill.create({ name: skillName, level: 80 });
        skillMap.set(skillName, created._id as mongoose.Types.ObjectId);
        console.log(`Created Skill: "${skillName}"`);
      }
    }

    // ==========================================
    // 2. MIGRATING PROJECTS
    // ==========================================
    console.log("\n🔄 Step 2: Migrating Projects to new ObjectIds references...");
    for (const p of rawProjects) {
      const rawP = p as any;
      const categoryNames: string[] = Array.isArray(rawP.category)
        ? rawP.category
        : rawP.category
          ? [rawP.category]
          : ["Full Stack"];

      const techList: string[] = Array.isArray(rawP.techNames)
        ? rawP.techNames
        : Array.isArray(rawP.technologies)
          ? rawP.technologies
          : [];

      const categoryIds = categoryNames.map((name) => categoryMap.get(name)).filter(Boolean);
      const skillIds = techList.map((name) => skillMap.get(name)).filter(Boolean);

      await Project.findByIdAndUpdate(p._id, {
        $set: {
          categoryIds,
          skillIds,
        },
        $unset: {
          category: "",
          techNames: "",
          technologies: "",
        },
      });
      console.log(`Migrated Project: "${p.title}"`);
    }

    // ==========================================
    // 3. MIGRATING EXPERIENCES
    // ==========================================
    console.log("\n🔄 Step 3: Migrating Experiences (string duration -> Dates, technologies -> skillIds)...");
    const rawExperiences = await Experience.find({}).lean();
    for (const exp of rawExperiences) {
      const rawExp = exp as any;
      const { startDate, endDate } = parsePeriod(rawExp.duration || "");

      const techList = rawExp.technologies || [];
      const skillIds = techList.map((name: string) => skillMap.get(name) || name).filter((id: any) => id instanceof mongoose.Types.ObjectId);

      await Experience.findByIdAndUpdate(exp._id, {
        $set: {
          startDate,
          endDate,
          skillIds,
        },
        $unset: {
          duration: "",
          technologies: "",
        },
      });
      console.log(`Migrated Experience: "${exp.title} at ${exp.org}"`);
    }

    // ==========================================
    // 4. MIGRATING EDUCATION
    // ==========================================
    console.log("\n🔄 Step 4: Migrating Education (string period -> Dates)...");
    const rawEducation = await Education.find({}).lean();
    for (const edu of rawEducation) {
      const rawEdu = edu as any;
      const { startDate, endDate } = parsePeriod(rawEdu.period || "");

      await Education.findByIdAndUpdate(edu._id, {
        $set: {
          startDate,
          endDate,
        },
        $unset: {
          period: "",
        },
      });
      console.log(`Migrated Education: "${edu.degree} from ${edu.institution}"`);
    }

    // ==========================================
    // 5. MIGRATING CERTIFICATIONS
    // ==========================================
    console.log("\n🔄 Step 5: Migrating Certifications (string date -> Dates)...");
    const rawCertifications = await Certification.find({}).lean();
    for (const cert of rawCertifications) {
      const rawCert = cert as any;
      if (rawCert.date) {
        const issuedAt = parseDateString(rawCert.date);
        await Certification.findByIdAndUpdate(cert._id, {
          $set: {
            issuedAt,
          },
          $unset: {
            date: "",
          },
        });
        console.log(`Migrated Certification: "${cert.title}"`);
      }
    }

    // ==========================================
    // 6. MIGRATING BLOGS
    // ==========================================
    console.log("\n🔄 Step 6: Migrating Blogs (string date -> true Dates)...");
    const rawBlogs = await Blog.find({}).lean();
    for (const blog of rawBlogs) {
      const rawBlog = blog as any;
      if (typeof rawBlog.date === "string") {
        const dateObj = parseDateString(rawBlog.date);
        await Blog.findByIdAndUpdate(blog._id, {
          $set: {
            date: dateObj,
          },
        });
        console.log(`Migrated Blog Date: "${blog.title}"`);
      }
    }

    // ==========================================
    // 7. MIGRATING VISITORS
    // ==========================================
    console.log("\n🔄 Step 7: Migrating Visitors (string date -> true Dates)...");
    const rawVisitors = await Visitor.find({}).lean();
    for (const vis of rawVisitors) {
      const rawVis = vis as any;
      if (typeof rawVis.date === "string") {
        const dateObj = parseDateString(rawVis.date);
        await Visitor.findByIdAndUpdate(vis._id, {
          $set: {
            date: dateObj,
          },
        });
        console.log(`Migrated Visitor Date: "${rawVis.date}"`);
      }
    }

    // ==========================================
    // 8. MIGRATING SINGLETONS
    // ==========================================
    console.log("\n🔄 Step 8: Hardening Singleton collections with fixed IDs...");



    // Hero
    const firstHero = await Hero.findOne({});
    if (firstHero) {
      const heroData = {
        name: firstHero.name,
        lastName: firstHero.lastName,
        profileImage: firstHero.profileImage,
        resumeUrl: firstHero.resumeUrl,
        tagline: firstHero.tagline || "",
        bio: firstHero.bio || "",
        typeSequences: firstHero.typeSequences || [],
      };
      await Hero.deleteMany({});
      const enforced = new Hero(heroData);
      enforced._id = new mongoose.Types.ObjectId("000000000000000000000002");
      await enforced.save();
      console.log("Hardened singleton: Hero");
    }

    // Setting
    const firstSetting = await Setting.findOne({});
    if (firstSetting) {
      const settingData = {
        siteName: firstSetting.siteName || "Portfolio",
        siteDescription: firstSetting.siteDescription || "A professional portfolio",
        keywords: firstSetting.keywords || [],
        contactEmail: firstSetting.contactEmail || "",
        contactPhone: firstSetting.contactPhone || "",
        contactLocation: firstSetting.contactLocation || "",
        ogImage: firstSetting.ogImage || "",
        isHireable: firstSetting.isHireable ?? true,
        maintenanceMode: firstSetting.maintenanceMode ?? false,
        accentColor: firstSetting.accentColor || "emerald",
      };
      await Setting.deleteMany({});
      const enforced = new Setting(settingData);
      enforced._id = new mongoose.Types.ObjectId("000000000000000000000003");
      await enforced.save();
      console.log("Hardened singleton: Setting");
    }

    // Tech
    const firstTech = await Tech.findOne({});
    if (firstTech) {
      const techData = {
        techList: firstTech.techList || [],
      };
      await Tech.deleteMany({});
      const enforced = new Tech(techData);
      enforced._id = new mongoose.Types.ObjectId("000000000000000000000004");
      await enforced.save();
      console.log("Hardened singleton: Tech");
    }

    console.log("\n🎉 DATABASE MIGRATION COMPLETED SUCCESSFULLY! 🎉");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ MIGRATION FAILED WITH ERROR:", error);
    process.exit(1);
  }
}

run();
