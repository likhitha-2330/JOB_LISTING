const mongoose = require("mongoose");

const ExperienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: String,
  location: String,
  startDate: Date,
  endDate: Date,
  currentlyWorking: { type: Boolean, default: false },
  description: String
}, { _id: false });

const EducationSchema = new mongoose.Schema({
  school: String,
  degree: String,
  fieldOfStudy: String,
  startDate: Date,
  endDate: Date,
  description: String
}, { _id: false });

const SeekerProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  headline: { type: String, trim: true },
  bio: { type: String, trim: true },
  location: { type: String, trim: true },
  skills: [{ type: String, trim: true }],
  experience: [ExperienceSchema],
  education: [EducationSchema],
  resumeUrl: { type: String },
  portfolioUrl: { type: String },
  desiredJobTypes: { type: [String], enum: ["full-time", "part-time", "contract", "internship", "remote"], default: ["full-time"] },
  openToRelocate: { type: Boolean, default: false },
  availability: { type: String, enum: ["immediate", "2 weeks", "1 month", "negotiable"], default: "negotiable" }
}, { timestamps: true });

module.exports = mongoose.model("SeekerProfile", SeekerProfileSchema);