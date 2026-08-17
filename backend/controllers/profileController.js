import Profile from "../models/Profile.js";

// @desc    Get live portfolio profile
// @route   GET /api/profile
// @access  Public
export const getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      // Return 404 or empty object if not seeded yet
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update live portfolio profile
// @route   PUT /api/profile
// @access  Private/Admin
export const updateProfile = async (req, res) => {
  try {
    const body = { ...req.body };
    if (body.resume && typeof body.resume === "object") {
      body.resume = body.resume.url || body.resume.src || String(body.resume);
    }
    if (body.avatar && typeof body.avatar === "object") {
      body.avatar = body.avatar.url || body.avatar.src || String(body.avatar);
    }

    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create(body);
    } else {
      profile = await Profile.findByIdAndUpdate(profile._id, body, {
        new: true,
        runValidators: false,
      });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
