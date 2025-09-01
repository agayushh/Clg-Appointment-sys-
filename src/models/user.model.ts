import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

enum Roles {
  Student = "student",
  Professor = "professor",
}
export interface Iuser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: Roles;
  profId?: string;
  validatePassword(password: string): Promise<boolean>;
  generateAccessToken(): string;
}

const userSchema = new mongoose.Schema<Iuser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(Roles),
      required: true,
      default: Roles.Student,
    },
    profId: {
      type: String,
      required: function () {
        return this.role === Roles.Professor;
      },
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.validatePassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.SECRET_KEY!,
    { expiresIn: "1h" }
  );
};

export const User = mongoose.model<Iuser>("User", userSchema);
