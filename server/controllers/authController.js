const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createToken = (user) => {
  return jwt.sign(
    {
      userId: user._id.toString(),
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

const sanitizeUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  avatar: user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.email)}`,
  preferredCurrency: user.preferredCurrency || "INR",
  preferredLanguage: user.preferredLanguage || "English (US)",
  savedDestinations: user.savedDestinations || [],
});

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        message: "Name, email and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(normalizedEmail)}`,
      preferredCurrency: "INR",
    });

    const token = createToken(user);

    return res.status(201).json({
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Registration failed.",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = createToken(user);

    return res.json({
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Login failed.",
    });
  }
};

const getMe = async (req, res) => {
  try {
    return res.json({
      user: sanitizeUser(req.user),
    });
  } catch (error) {
    console.error("GetMe error:", error);
    return res.status(500).json({ message: "Failed to fetch profile." });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, avatar, preferredCurrency, preferredLanguage, savedDestinations } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (name !== undefined) user.name = name.trim();
    if (avatar !== undefined) user.avatar = avatar.trim();
    if (preferredCurrency !== undefined) user.preferredCurrency = preferredCurrency;
    if (preferredLanguage !== undefined) user.preferredLanguage = preferredLanguage;
    if (Array.isArray(savedDestinations)) user.savedDestinations = savedDestinations;

    await user.save();

    return res.json({
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Failed to update profile." });
  }
};

const demoLogin = async (req, res) => {
  try {
    const demoEmail = "demo@globetrotter.io";
    let demoUser = await User.findOne({ email: demoEmail });

    if (!demoUser) {
      const passwordHash = await bcrypt.hash("demo123", 12);
      demoUser = await User.create({
        name: "Demo Traveler",
        email: demoEmail,
        passwordHash,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        preferredCurrency: "INR",
        savedDestinations: ["Daman, India", "Ahmedabad, India", "Tokyo, Japan", "Rome, Italy"],
      });
    }

    const token = createToken(demoUser);

    return res.json({
      token,
      user: sanitizeUser(demoUser),
    });
  } catch (error) {
    console.error("Demo login error:", error);
    return res.status(500).json({ message: "Demo login failed." });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  demoLogin,
};