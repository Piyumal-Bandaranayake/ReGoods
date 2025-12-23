import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  reportedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  reason: {
    type: String,
    required: true,
    enum: [
      "Fraud/Scam",
      "Inappropriate Content",
      "Selling Prohibited Items",
      "Harassment",
      "Fake Account",
      "Other"
    ]
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  images: [{
    type: String
  }],
  status: {
    type: String,
    enum: ["Pending", "Reviewed", "Resolved", "Dismissed"],
    default: "Pending"
  }
}, { timestamps: true });

export default mongoose.models.Report || mongoose.model('Report', ReportSchema);
