import mongoose from "mongoose";

// Skills subdocument schema
const skillSchema = new mongoose.Schema({
  skillName: { type: String, required: true, trim: true },
  proficiencyLevel: {
    type: String,
    required: true,
    enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
  },
  yearsOfExperience: { type: Number, min: 0, default: 0 },
});

// Work Experience subdocument schema
const workExperienceSchema = new mongoose.Schema({
  jobTitle: { type: String, trim: true },
  company: { type: String, trim: true },
  duration: { type: String, trim: true },
  description: { type: String, trim: true },
  location: { type: String, trim: true },
});

// Education subdocument schema
const educationSchema = new mongoose.Schema({
  degree: { type: String, trim: true },
  institution: { type: String, trim: true },
  graduationYear: { type: Number, min: 1950, max: new Date().getFullYear() + 10 },
  grade: { type: String, trim: true },
});

// Certifications subdocument schema
const certificationSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  issuingOrganization: { type: String, trim: true },
  dateObtained: { type: Date },
});

// Main UserProfile schema
const userProfileSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 255 },
    email: {
      type: String,
      required: true,
      unique: true, // ✅ only one unique index
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    phone: { type: String, required: true, trim: true, match: [/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"] },
    address: { type: String, trim: true },

    skills: {
      type: [skillSchema],
      validate: { validator: (skills) => skills.length > 0, message: "At least one skill is required" },
    },
    workExperience: { type: [workExperienceSchema], default: [] },
    education: { type: [educationSchema], default: [] },
    certifications: { type: [certificationSchema], default: [] },

    isActive: { type: Boolean, default: true },
    profileCompleteness: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true, versionKey: false }
);

// ✅ Remove duplicate manual index for email
// userProfileSchema.index({ email: 1 });

// Other indexes
userProfileSchema.index({ fullName: "text", "skills.skillName": "text" });
userProfileSchema.index({ createdAt: -1 });
userProfileSchema.index({ "skills.skillName": 1 });
userProfileSchema.index({ "workExperience.company": 1 });

// Pre-save middleware to calculate profile completeness
userProfileSchema.pre("save", function (next) {
  let completeness = 0;
  const weights = { personalInfo: 30, skills: 25, workExperience: 25, education: 10, certifications: 10 };

  // Personal info
  if (this.fullName && this.email && this.phone && this.address) completeness += weights.personalInfo;
  else if (this.fullName && this.email && this.phone) completeness += weights.personalInfo * 0.8;

  if (this.skills.length > 0) completeness += weights.skills;
  if (this.workExperience.length > 0) completeness += weights.workExperience;
  if (this.education.length > 0) completeness += weights.education;
  if (this.certifications.length > 0) completeness += weights.certifications;

  this.profileCompleteness = Math.round(completeness);
  next();
});

// Virtuals & methods
userProfileSchema.methods.getSkillsByProficiency = function (level) {
  return this.skills.filter((skill) => skill.proficiencyLevel === level);
};
userProfileSchema.methods.getTotalExperience = function () {
  return this.skills.reduce((total, skill) => total + skill.yearsOfExperience, 0);
};
userProfileSchema.statics.findBySkill = function (skillName) {
  return this.find({ "skills.skillName": { $regex: skillName, $options: "i" } });
};
userProfileSchema.statics.findByCompany = function (companyName) {
  return this.find({ "workExperience.company": { $regex: companyName, $options: "i" } });
};
userProfileSchema.virtual("profileSummary").get(function () {
  return {
    name: this.fullName,
    email: this.email,
    totalSkills: this.skills.length,
    totalExperience: this.workExperience.length,
    totalEducation: this.education.length,
    totalCertifications: this.certifications.length,
    completeness: this.profileCompleteness,
  };
});
userProfileSchema.set("toJSON", { virtuals: true });

const UserProfile = mongoose.models.UserProfile || mongoose.model("UserProfile", userProfileSchema);

export default UserProfile;
