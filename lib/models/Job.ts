import mongoose, { Schema, Document, Types } from "mongoose";

export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  type: string;
  contactEmail: string;
  contactPhone: string;
  postedBy: Types.ObjectId;
  createdAt: Date;
}

const JobSchema = new Schema<IJob>({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  contactEmail: { type: String, required: false },
  contactPhone: { type: String, required: false },
  postedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

export default (mongoose.models.Job as mongoose.Model<IJob>) || mongoose.model<IJob>("Job", JobSchema);
