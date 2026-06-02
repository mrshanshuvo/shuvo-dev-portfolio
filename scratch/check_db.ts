import { connectDB } from "../src/lib/mongodb";
import Skill from "../src/models/Skill";
import Tech from "../src/models/Tech";

async function run() {
  await connectDB();
  console.log("Connected to MongoDB!");
  
  const skills = await Skill.find().lean();
  console.log("\n--- SKILLS IN DB ---");
  console.log(JSON.stringify(skills.slice(0, 10), null, 2));
  console.log(`Total skills: ${skills.length}`);
  
  const tech = await Tech.findOne().lean();
  console.log("\n--- TECH BANNER IN DB ---");
  console.log(JSON.stringify(tech, null, 2));
  
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
