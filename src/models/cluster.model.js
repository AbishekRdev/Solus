import mongoose, { Schema } from "mongoose";

const clusterSchema = new Schema(
  {

    name: {
      type: String,
      required: true,
    },
    ownedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    clusterType: {
      enum: ["private,public"],
      default: "public",
    },

    
  },{ timestamps: true });

export const Cluster = mongoose.model("Cluster", clusterSchema);
