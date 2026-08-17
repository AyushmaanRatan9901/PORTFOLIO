import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "ayushmaanratan9901@gmail.com")
  .toLowerCase()
  .trim();

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const normalizedEmail = email?.toLowerCase().trim();

  if (normalizedEmail !== ADMIN_EMAIL) {
    return res
      .status(403)
      .json({ message: "Only the configured admin account can be created" });
  }

  const exists = await User.findOne({ email: normalizedEmail });
  if (exists) return res.status(400).json({ message: "Admin already exists" });

  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
    role: "admin",
  });
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email?.toLowerCase().trim();

  if (normalizedEmail !== ADMIN_EMAIL) {
    return res.status(401).json({ message: "Invalid admin email or password" });
  }

  const user = await User.findOne({ email: normalizedEmail });
  if (user && user.role === "admin" && (await user.matchPassword(password))) {
    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  }

  res.status(401).json({ message: "Invalid admin email or password" });
};
