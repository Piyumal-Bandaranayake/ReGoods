import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
  },
  nationality: {
    type: String,
  },
  image: {
    type: String,
  },
  bio: {
    type: String,
    maxlength: 500
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item"
  }],
  cart: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item"
  }],
  warningCount: {
    type: Number,
    default: 0
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  banReason: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ["Unverified", "Pending", "Verified", "Rejected"],
    default: "Unverified"
  }
}, { timestamps: true });

if (process.env.NODE_ENV === "development") {
  delete mongoose.models.User;
}

export default mongoose.models.User || mongoose.model('User', UserSchema);