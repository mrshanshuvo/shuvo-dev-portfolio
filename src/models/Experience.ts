import mongoose, { Schema, Document, Model } from "mongoose";

export interface IExperience extends Document {
  title: string;
  org: string;
  location?: string;
  duration: string;
  details: string[];
  logo?: string;
  color: "emerald" | "blue" | "amber";
  type: "work";
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ExperienceSchema = new Schema<IExperience>(
  {
    title: { type: String, required: true },
    org: { type: String, required: true },
    location: { type: String },
    duration: { type: String, required: true },
    details: [{ type: String }],
    logo: { type: String },
    color: {
      type: String,
      enum: ["emerald", "blue", "amber"],
      default: "emerald",
    },
    type: {
      type: String,
      enum: ["work"],
      default: "work",
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Force delete the model from mongoose.models in development to pick up schema changes
if (process.env.NODE_ENV === "development") {
  delete mongoose.models.Experience;
}

const Experience: Model<IExperience> =
  mongoose.models.Experience ||
  mongoose.model<IExperience>("Experience", ExperienceSchema);

export default Experience;
