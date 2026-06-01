import mongoose from "mongoose";

const yadminRegisterSchema = new mongoose.Schema({
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

  password: {
    type: String,
    required: true,
  },
});

yadminRegisterSchema.index({ email: 1 }, { unique: true });

const YadminRegister =
  mongoose.models.YadminRegister ||
  mongoose.model("YadminRegister", yadminRegisterSchema);

export default YadminRegister;
