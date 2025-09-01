import mongoose from "mongoose";
import bcrypt from "bcrypt";

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

export const User = mongoose.model<Iuser>("User", userSchema);
