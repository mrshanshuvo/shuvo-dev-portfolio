import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEducation extends Document {
  degree: string;
  institution: string;
  location: string;
  logo?: string;
  period: string;
  gpa?: string;
  details: string[];
  link?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const EducationSchema = new Schema<IEducation>(
  {
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    location: { type: String, default: "" },
    logo: { type: String, default: "" },
    period: { type: String, required: true },
    gpa: { type: String, default: "" },
    details: { type: [String], default: [] },
    link: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Force delete the model from mongoose.models in development to pick up schema changes
if (process.env.NODE_ENV === "development") {
  delete mongoose.models.Education;
}

const Education: Model<IEducation> =
  mongoose.models.Education ||
  mongoose.model<IEducation>("Education", EducationSchema);

export default Education;
