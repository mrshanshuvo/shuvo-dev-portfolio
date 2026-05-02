import mongoose, { Schema, Document, Model } from "mongoose";

export interface IExperience extends Document {
  title: string;
  org: string;
  duration: string;
  details: string[];
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
    duration: { type: String, required: true },
    details: [{ type: String }],
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

const Experience: Model<IExperience> =
  mongoose.models.Experience ||
  mongoose.model<IExperience>("Experience", ExperienceSchema);

export default Experience;
