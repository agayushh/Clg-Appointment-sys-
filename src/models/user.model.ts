import mongoose from "mongoose";

enum Roles {
  Student = "student",
  Professor = "professor",
}
export interface Iuser {
  name: string;
  email: string;
  password: string;
  role: Roles;
  profId?: string;
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

export const User = mongoose.model<Iuser>("User", userSchema);


