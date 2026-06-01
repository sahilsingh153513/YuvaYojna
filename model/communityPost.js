import mongoose from "mongoose";

const communityAuthorSchema = new mongoose.Schema(
  {
    userToken: { type: String, default: null, index: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, trim: true, lowercase: true, default: null },
    avatar: { type: String, required: true, trim: true, maxlength: 3 },
    location: { type: String, trim: true, maxlength: 120, default: "Yuva Yojna Community" },
  },
  { _id: false }
);

const communityCommentSchema = new mongoose.Schema(
  {
    author: { type: communityAuthorSchema, required: true },
    content: { type: String, required: true, trim: true, minlength: 2, maxlength: 500 },
  },
  { timestamps: true }
);

const communityPostSchema = new mongoose.Schema(
  {
    author: { type: communityAuthorSchema, required: true },
    content: { type: String, required: true, trim: true, minlength: 5, maxlength: 1000 },
    category: {
      type: String,
      enum: ["experiences", "tips", "questions", "success"],
      default: "experiences",
      index: true,
    },
    attachment: {
      title: { type: String, trim: true, maxlength: 160 },
      url: { type: String, trim: true, maxlength: 500 },
    },
    likedBy: { type: [String], default: [] },
    comments: { type: [communityCommentSchema], default: [] },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true, versionKey: false }
);

communityPostSchema.index({
  content: "text",
  "author.name": "text",
  "author.location": "text",
});
communityPostSchema.index({ createdAt: -1 });

const CommunityPost =
  mongoose.models.CommunityPost ||
  mongoose.model("CommunityPost", communityPostSchema);

export default CommunityPost;
