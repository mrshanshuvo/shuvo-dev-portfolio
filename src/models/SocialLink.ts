import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISocialLink extends Document {
  platform: string;
  href: string;
  label: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const SocialLinkSchema = new Schema<ISocialLink>(
  {
    platform: { type: String, required: true },
    href: { type: String, required: true },
    label: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Force delete the model from mongoose.models in development to pick up schema changes
if (process.env.NODE_ENV === "development") {
  delete mongoose.models.SocialLink;
}

const SocialLink: Model<ISocialLink> =
  mongoose.models.SocialLink || mongoose.model<ISocialLink>("SocialLink", SocialLinkSchema);

export default SocialLink;
