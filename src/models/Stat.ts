import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStat extends Document {
  number: string; // Intentionally typed as string to allow rich metrics formatting, e.g. "10+", "~50" or "100%"
  label: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const StatSchema = new Schema<IStat>(
  {
    number: { type: String, required: true }, // Intentionally typed as string to support "10+", "~50"
    label: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Force delete the model from mongoose.models in development to pick up schema changes
if (process.env.NODE_ENV === "development") {
  delete mongoose.models.Stat;
}

const Stat: Model<IStat> =
  mongoose.models.Stat || mongoose.model<IStat>("Stat", StatSchema);

export default Stat;
