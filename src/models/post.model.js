import mongoose, { Schema } from "mongoose";
import { analyzeImage } from "../utils/clarifai.js";

const postSchema = new Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, 
    },
    img: {
      type: String, 
      required: true
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likesCount: {
      type: Number,
      default: 0,
    },
    tags: [
      { type: String },
    ],
    concepts: [
      {
        name: {
          type: String,
          required: true, 
        },
        value: {
          type: Number,
          required: true,
        }
      }
    ],
    colors: [
      {
        name: {
          type: String,
          required: true, 
        },
        hex: {
          type: String,
          required: true, 
        },
        confidence: {
          type: Number,
          required: true, 
        }
      }
    ],
  },
  { timestamps: true }
);

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


// postSchema.pre("save", async function (next) {
//   const analyzeImageData=await analyzeImage(this.img)
//   this.concepts=await analyzeImageData.concepts;
//   this.colors= await analyzeImageData.colors ;
//   next();
// });






export const Post = mongoose.model("Post", postSchema);
