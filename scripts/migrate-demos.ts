import mongoose from "mongoose";
import Demo from "../src/models/Demo";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ ERROR: MONGODB_URI is not set in .env.local");
  process.exit(1);
}

async function run() {
  try {
    console.log("🔄 Connecting to MongoDB database...");
    await mongoose.connect(MONGODB_URI!);
    console.log("✅ Connected successfully!");

    console.log("\n🔄 Seeding Demos with high-end generated assets...");

    // 1. AI Image Classifier
    const demo1 = await Demo.findOne({ title: /AI Image Classifier/i });
    if (demo1) {
      console.log('Seeding "AI Image Classifier" visual showcase assets...');
      await Demo.findByIdAndUpdate(demo1._id, {
        $set: {
          slug: "ai-image-classifier",
          image: "/images/ai-classifier-thumb.png",
          github: "https://github.com/mrshanshuvo/ai-image-classifier",
          featured: true, // Mark featured for star badges
          media: [
            {
              type: "image",
              url: "/images/ai-classifier-gal1.png",
              caption: "Feature Extraction Visualization Screen",
            },
            {
              type: "image",
              url: "/images/ai-classifier-gal2.png",
              caption: "Prediction Confidence Analytics Dashboard",
            },
          ],
        },
      });
    }

    // 2. 3D Portfolio Scene
    const demo2 = await Demo.findOne({ title: /3D Portfolio Scene/i });
    if (demo2) {
      console.log('Seeding "3D Portfolio Scene" visual showcase assets...');
      await Demo.findByIdAndUpdate(demo2._id, {
        $set: {
          slug: "3d-portfolio-scene",
          image: "/images/three-d-thumb.png",
          github: "https://github.com/mrshanshuvo/3d-portfolio-scene",
          featured: true, // Mark featured for star badges
          media: [
            {
              type: "image",
              url: "/images/three-d-gal1.png",
              caption: "WebGL High-Performance Particle Streams Flow",
            },
            {
              type: "image",
              url: "/images/three-d-gal2.png",
              caption: "3D Glassmorphism Cards Workspace View",
            },
          ],
        },
      });
    }

    console.log("\n🎉 DEMO SEEDING COMPLETED SUCCESSFULLY! 🎉");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ SEEDING FAILED WITH ERROR:", error);
    process.exit(1);
  }
}

run();
