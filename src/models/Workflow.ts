import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWorkflow extends Document {
  title: string;
  description: string;
  icon: string;
  order: number;
}

const WorkflowSchema = new Schema<IWorkflow>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Force delete the model from mongoose.models in development to pick up schema changes
if (process.env.NODE_ENV === "development") {
  delete mongoose.models.Workflow;
}

const Workflow: Model<IWorkflow> =
  mongoose.models.Workflow ||
  mongoose.model<IWorkflow>("Workflow", WorkflowSchema);

export default Workflow;
