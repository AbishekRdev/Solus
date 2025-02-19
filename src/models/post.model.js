import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    img: {
      type: String, //cloudinary
    },
    content: {
      type: String,
      required: true,
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    tags: [
      {
        type: String,
        unique: true,
      },
    ],
    tags: [
      { type: String },     // User-defined tags
    ],
    aiMetadata: [
      { type: String },   // AI-generated categories
    ],
  },
  { timestamps: true }
);
postSchema.pre("save");

postSchema.methods.toggleLike = async function (userId) {
  if (this.likedBy.includes(userId)) {
    this.likedBy = this.likedBy.filter(
      (user) => user.toString() !== userId.toString()
    );
    this.likesCount -= 1;
  } else {
    this.likedBy.push(userId);
    this.likesCount += 1;
  }
  await this.save();
};

export const Post = mongoose.model("Post", postSchema);
