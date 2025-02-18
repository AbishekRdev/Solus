import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },

    fullname: {
      type: String,
      required: true,
    },
    clusters: [
      {
        type: Schema.Types.ObjectId,
        ref: "Cluster",
      },
    ],
    avatar: {
      //from cloudinary;
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: ["user", "admin", "moderator"], 
      default: "user",
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
