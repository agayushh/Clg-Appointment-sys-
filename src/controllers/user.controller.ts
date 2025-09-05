import mongoose, { mongo } from "mongoose";
import { Iuser, User } from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";

const generateAccessToken = async (userId: mongoose.Types.ObjectId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user?.generateAccessToken();
    return accessToken;
  } catch (error) {
    throw new Error("Error generating access token");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if ([name, email, password, role].some((field) => field?.trim() === "")) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //check if the role is specified and valid
  const validRoles = ["student", "professor"];
  if (role && !validRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role specified" });
  }

  if (role === "professor") {
    if (!req.body.profId) {
      return res
        .status(400)
        .json({ message: "Professor ID is required for professors" });
    }
  }
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }
  // Create new user
  const newUser = new User({
    name,
    email,
    password,
    role,
    ...(role === "professor" && { profId: req.body.profId }),
  });
  await newUser.save();
  const accessToken = await generateAccessToken(
    newUser._id as mongoose.Types.ObjectId
  );

  const { password: _, ...userWithoutPassword } = newUser.toObject();

  const option = {
    httpOnly: true,
    secure: true,
  };
  res.status(201).cookie("accessToken", accessToken, option).json({
    message: "User registered successfully",
    user: userWithoutPassword,
  });
});
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "email and password required" });
  }

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  // Check password
  const isPasswordValid = await user.validatePassword(password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const accessToken = await generateAccessToken(
    user._id as mongoose.Types.ObjectId
  );

  const { password: _, ...userWithoutPassword } = user.toObject();
  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json({ message: "Login successful", user: userWithoutPassword });
});

export { registerUser, loginUser };
