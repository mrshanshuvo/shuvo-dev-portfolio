import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVisitor extends Document {
  date: string; // YYYY-MM-DD
  count: number;
}

const VisitorSchema = new Schema<IVisitor>(
  {
    date: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Force delete the model from mongoose.models in development to pick up schema changes
if (process.env.NODE_ENV === "development") {
  delete mongoose.models.Visitor;
}

const Visitor: Model<IVisitor> =
  mongoose.models.Visitor || mongoose.model<IVisitor>("Visitor", VisitorSchema);

export default Visitor;
