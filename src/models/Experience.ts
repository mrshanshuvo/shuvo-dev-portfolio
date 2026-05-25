import mongoose, { Schema, Document, Model } from "mongoose";

export interface IExperience extends Document {
  title: string;
  org: string;
  duration: string;
  details: string[];
  type: "work";
  order: number;
  createdAt: Date;
  updatedAt: Date;
  previousTitles?: string[];
  links?: { label?: string; url: string }[];
  technologies?: string[];
}

const ExperienceSchema = new Schema<IExperience>(
  {
    title: { type: String, required: true },
    org: { type: String, required: true },
    duration: { type: String, required: true },
    details: [{ type: String }],
    type: {
      type: String,
      enum: ["work"],
      default: "work",
    },
    order: { type: Number, default: 0 },
    previousTitles: [{ type: String }],
    links: [
      {
        label: { type: String },
        url: { type: String, required: true },
      },
    ],
    technologies: [{ type: String }],
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
