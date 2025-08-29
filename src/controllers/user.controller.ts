import { User } from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";


const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.find({ email });
  if (existingUser.length > 0) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Create new user
  const newUser = new User({ username, email, password });
  await newUser.save();
  
  res.status(201).json({ message: "User registered successfully", user: newUser });
});
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.find  ({ email });
  if (user.length === 0) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  // Check password
  if (user[0].password !== password) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  res.status(200).json({ message: "Login successful", user: user[0] });
});

export { registerUser, loginUser };