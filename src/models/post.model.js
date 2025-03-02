import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    img: {
      type: String, //cloudinary
    },
    content: {
      type: String,
      required: [true, 'Content is required if image is not provided.'],
      validate: {
        validator: function(value) {
          
          return this.img || !value; 
        },
        message: 'Image must be provided if content is not given.',
      },
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likesCount:{
      type:Number,
      default:0,

    },
    tags: [
      { type: String },     // User-defined tags
    ],
    concepts: [
      { type: String },   // AI-generated categories
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

export const Post = mongoose.model("Post", postSchema);
