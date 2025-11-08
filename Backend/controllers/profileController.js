const SeekerProfile = require("../models/SeekerProfile");
const Company = require("../models/Company");
const User = require("../models/User");

/**
 * Get the authenticated user's profile.
 * If employer -> return Company profile, else return SeekerProfile.
 */
exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    if (req.user.role === "employer") {
      const company = await Company.findOne({ user: userId }).populate("user", "name email");
      if (!company) return res.status(404).json({ message: "Company profile not found" });
      return res.json(company);
    } else {
      const profile = await SeekerProfile.findOne({ user: userId }).populate("user", "name email");
      if (!profile) return res.status(404).json({ message: "Seeker profile not found" });
      return res.json(profile);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Create or update profile for authenticated user (seeker or employer).
 * For employers, we upsert Company; for seekers we upsert SeekerProfile.
 */
exports.upsertMyProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const payload = req.body;

    if (req.user.role === "employer") {
      const company = await Company.findOneAndUpdate(
        { user: userId },
        { $set: payload },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      return res.json(company);
    } else {
      const profile = await SeekerProfile.findOneAndUpdate(
        { user: userId },
        { $set: payload },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      return res.json(profile);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Public: Get a user's public profile by user id (seeker or employer).
 * Query param role can be 'seeker' or 'employer' to force type.
 */
exports.getPublicProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const role = req.query.role;

    if (role === "employer") {
      const company = await Company.findOne({ user: id }).populate("user", "name");
      if (!company) return res.status(404).json({ message: "Company not found" });
      return res.json(company);
    } else {
      const profile = await SeekerProfile.findOne({ user: id }).populate("user", "name");
      if (!profile) return res.status(404).json({ message: "Seeker profile not found" });
      return res.json(profile);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};