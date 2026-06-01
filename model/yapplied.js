import mongoose from "mongoose";

const appliedSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "yuserRegister",   
      required: true
    },
    token: {
      type: String,
      required: true,         
      trim: true
    },
    schemeName: {
      type: String,
      required: true,         
      trim: true
    },
    appliedDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ["pending","approved","rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);

// agar ek user ek hi scheme me sirf ek baar apply kar sakta hai:
appliedSchema.index({ userId:1, schemeName:1 }, { unique:true });

const Yappliedsave =
  mongoose.models.Yappliedsave ||
  mongoose.model("Yappliedsave", appliedSchema);

export default Yappliedsave;
