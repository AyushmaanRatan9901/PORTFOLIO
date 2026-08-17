import User from "../models/User.js";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "ayushmaanratan9901@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ayushmaan@9900";
const ADMIN_NAME = process.env.ADMIN_NAME || "Prince Kumar";

export const seedAdmin = async () => {
  const email = ADMIN_EMAIL.toLowerCase().trim();
  const admin = await User.findOne({ email });

  if (!admin) {
    await User.create({
      name: ADMIN_NAME,
      email,
      password: ADMIN_PASSWORD,
      role: "admin",
    });
    console.log(`Admin created: ${email}`);
    return;
  }

  let changed = false;
  if (admin.role !== "admin") {
    admin.role = "admin";
    changed = true;
  }
  if (admin.name !== ADMIN_NAME) {
    admin.name = ADMIN_NAME;
    changed = true;
  }

  // Keeps the requested default password active for local deployment.
  const passwordMatches = await admin.matchPassword(ADMIN_PASSWORD);
  if (!passwordMatches) {
    admin.password = ADMIN_PASSWORD;
    changed = true;
  }

  if (changed) {
    await admin.save();
    console.log(`Admin updated: ${email}`);
  } else {
    console.log(`Admin ready: ${email}`);
  }
};
