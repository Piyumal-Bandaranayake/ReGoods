import mongoose from 'mongoose';

const VerificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  nicFront: {
    type: String,
    required: true
  },
  nicBack: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  nicNumber: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
  },
  adminNotes: {
    type: String
  }
}, { timestamps: true });

if (process.env.NODE_ENV === "development") {
  delete mongoose.models.Verification;
}

export default mongoose.models.Verification || mongoose.model('Verification', VerificationSchema);
