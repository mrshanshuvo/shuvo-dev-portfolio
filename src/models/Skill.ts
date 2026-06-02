import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISkill extends Document {
  name: string;
  tech: string;
  level: number;
  order: number;
  iconUrl?: string;
  isTechnology?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true },
    tech: { type: String },
    level: { type: Number, min: 0, max: 100, default: 80 },
    order: { type: Number, default: 0 },
    isTechnology: { type: Boolean, default: false },
    iconUrl: { type: String, default: "" },
  },
  { timestamps: true },
);

// Force delete the model from mongoose.models in development to pick up schema changes
if (process.env.NODE_ENV === "development") {
  delete mongoose.models.Skill;
}

const Skill: Model<ISkill> =
  mongoose.models.Skill || mongoose.model<ISkill>("Skill", SkillSchema);

export default Skill;
