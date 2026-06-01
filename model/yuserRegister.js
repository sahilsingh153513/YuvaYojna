import mongoose from "mongoose";

const yuserRegisterSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      maxlength: 255,
    },
    email: {
      type: String,
      unique: true, // ✅ unique already creates index
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    userToken: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"],
    },
    provider: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials",
    },
    age: {
      type: Number,
      default: null,
    },
    gender: {
      type: String,
    },
    password: {
      type: String,
      required: function () {
        return this.provider === "credentials";
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      default: null,
    },
    emailVerificationExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// ✅ Removed manual duplicate index
// yuserRegisterSchema.index({ email: 1 }, { unique: true });

const YuserRegister =
  mongoose.models.YuserRegister ||
  mongoose.model("YuserRegister", yuserRegisterSchema);

export default YuserRegister;
