import mongoose, { Schema, Document } from 'mongoose';

export interface IUserProfile extends Document {
  sessionId: string;
  income_level?: string;
  investment_experience?: string;
  risk_level?: string;
  goals?: string[];
  interests?: string[];
  current_investments?: string[];
  financial_gaps?: string[];
  lastUpdated: Date;
}

const UserProfileSchema: Schema = new Schema({
  sessionId: { type: String, required: true, unique: true },
  income_level: { type: String },
  investment_experience: { type: String },
  risk_level: { type: String },
  goals: [{ type: String }],
  interests: [{ type: String }],
  current_investments: [{ type: String }],
  financial_gaps: [{ type: String }],
  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.models.UserProfile || mongoose.model<IUserProfile>('UserProfile', UserProfileSchema);
