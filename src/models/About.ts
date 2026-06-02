import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAbout extends Document {
  aboutBio: string;
  createdAt: Date;
  updatedAt: Date;
}

const AboutSchema = new Schema<IAbout>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId("000000000000000000000001"),
    },
    aboutBio: { type: String },
  },
  { timestamps: true },
);

// Enforce singleton behavior by forcing a fixed _id
AboutSchema.pre("save", function (this: any) {
  this._id = new mongoose.Types.ObjectId("000000000000000000000001");
});

// Force delete the model from mongoose.models in development to pick up schema changes
if (process.env.NODE_ENV === "development") {
  delete mongoose.models.About;
}

const About: Model<IAbout> =
  mongoose.models.About || mongoose.model<IAbout>("About", AboutSchema);

export default About;
