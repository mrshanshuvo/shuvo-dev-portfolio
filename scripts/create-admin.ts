import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import "dotenv/config";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: "Admin" },
  },
  { timestamps: true },
);

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI not set");

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  const User = mongoose.models.User || mongoose.model("User", UserSchema);

  const email = "mrshanshuvo@gmail.com";
  const password = "mr420shan";
  const hash = await bcrypt.hash(password, 12);

  await User.findOneAndUpdate(
    { email },
    { email, passwordHash: hash, name: "Shahid Hasan Shuvo" },
    { upsert: true, new: true },
  );

  console.log(`✅ Admin user created/updated: ${email}`);
  await mongoose.disconnect();
}

main().catch(console.error);
