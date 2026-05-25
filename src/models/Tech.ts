import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITech extends Document {
  techList: string[];
  createdAt: Date;
  updatedAt: Date;
}

const TechSchema = new Schema<ITech>(
  {
    techList: [{ type: String }],
  },
  { timestamps: true },
);

// Force delete the model from mongoose.models in development to pick up schema changes
if (process.env.NODE_ENV === "development") {
  delete mongoose.models.Tech;
}

const Tech: Model<ITech> =
  mongoose.models.Tech || mongoose.model<ITech>("Tech", TechSchema);

export default Tech;
