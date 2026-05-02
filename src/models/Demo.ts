import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDemo extends Document {
  title: string;
  description: string;
  url: string;
  tech: string[];
  order: number;
}

const DemoSchema = new Schema<IDemo>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String, required: true },
    tech: [{ type: String }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Force delete the model from mongoose.models in development to pick up schema changes
if (process.env.NODE_ENV === "development") {
  delete mongoose.models.Demo;
}

const Demo: Model<IDemo> =
  mongoose.models.Demo || mongoose.model<IDemo>("Demo", DemoSchema);

export default Demo;
