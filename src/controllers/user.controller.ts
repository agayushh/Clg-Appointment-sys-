import { User } from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;

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
    username,
    email,
    password,
    role,
    ...(role === "professor" && { profId: req.body.profId }),
  });
  await newUser.save();
  const registeredUser = await User.findOne({ email }).select("-password");

  res
    .status(201)
    .json({ message: "User registered successfully", user: registeredUser });
});
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

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
  const loggedInUser = await User.findById(user._id).select("-password");

  res.status(200).json({ message: "Login successful", user: loggedInUser });
});

export { registerUser, loginUser };
