import mongoose from "mongoose";

const mentorMatchSchema = new mongoose.Schema(
  {
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "YmentorRegister",   
      required: true
    },
    matchedUsers: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "YuserRegister",
          required: true
        },
        matchedAt: {
          type: Date,
          default: Date.now     
        },
        durationMinutes: {            
          type: Number,
          default: 0,
          min: 0
        }
      }
    ],
    totalMatches: {
      type: Number,
      default: 0            
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

mentorMatchSchema.index({ mentorId: 1 }, { unique: true });

mentorMatchSchema.pre("save", function (next) {
  this.totalMatches = this.matchedUsers.length;
  next();
});

const MentorMatch =
  mongoose.models.MentorMatch ||
  mongoose.model("MentorMatch", mentorMatchSchema);

export default MentorMatch;
