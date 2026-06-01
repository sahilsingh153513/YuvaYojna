import mongoose from "mongoose";

const ymentorRegisterSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    mentorToken: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"],
    },
    age: {
      type: Number,
      default: null,
    },
    gender: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    specilizedIn: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    experience: {
      type: Number,
      required: true,
      min: 0,
    },
    availableSlots: {
      type: [String],
      default: [],
    },
    profilePicture: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 1024,
    },
  },

  {
    timestamps: true,
    versionKey: false,
  }
);

ymentorRegisterSchema.index({ email: 1 }, { unique: true });

const YmentorRegister =
  mongoose.models.YmentorRegister ||
  mongoose.model("YmentorRegister", ymentorRegisterSchema);

export default YmentorRegister;
