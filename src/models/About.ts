import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAbout extends Document {
  title: string;
  aboutBio: string;
  highlights: string[];
  createdAt: Date;
  updatedAt: Date;
}

const AboutSchema = new Schema<IAbout>(
  {
    title: { type: String, default: "Hello! I'm Shuvo" },
    aboutBio: { type: String },
    highlights: [{ type: String }],
  },
  { timestamps: true },
);

// Force delete the model from mongoose.models in development to pick up schema changes
if (process.env.NODE_ENV === "development") {
  delete mongoose.models.About;
}

const About: Model<IAbout> =
  mongoose.models.About || mongoose.model<IAbout>("About", AboutSchema);

export default About;
