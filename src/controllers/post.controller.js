import { ApiError } from "../utils/ApiError.js";
import { Post } from "../models/post.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import wrapAsync from "../utils/wrapAsync.js";
import { Query } from "mongoose";





const newPost = wrapAsync(async (req, res) => {
  const { content, tags } = req.body;

  const createdBy = req.user?._id;
  if (!tags) {
    throw new ApiError(400, "Tags required !");
  }
  const imgLocalPath = req.files?.img[0]?.path;

  if (!imgLocalPath) {
    throw new ApiError(400, "post img is required");
  }

  const img = await uploadOnCloudinary(imgLocalPath);

  if (!img) {
    throw new ApiError(400, "Failed to upload the image. Please try again ");
  }

  const post = await Post.create({
    createdBy,
    img: img.url,
    tags,
  });

  const createdPost = await Post.findById(post.id);
  if (!createdPost) {
    throw new ApiError(400, "something went wrong while processing the  post ");
  }

  res
    .status(201)
    .json(
      new ApiResponse(
        200,
        createdPost,
        "Post successfully created and published"
      )
    );
});


const getAllPost = wrapAsync(async (req, res) => {
  const {page,limit}=req.query;
  const Page=Number(page) || 1;
  const Limit=Number(limit) || 10;
  const Skip=(Page-1)*Limit;
  
  const posts = await Post
  .find({})
  .skip(Skip)
  .limit(Limit);

  if(!posts){
    throw new ApiError(404,"Posts not found ");
  }
  res
    .status(200)
    .json(new ApiResponse(200, posts, "all posts fetched successfully"));
});


const singlePost=wrapAsync(async(req,res)=>{
  
  const {id}=req.params;
  if(!id){
    throw new ApiError(400,"invalid request id is missing ");
  }
  const post=await Post.findById(id);

  if(!post){
    throw new ApiError(404,"Post not found ");
  }

  res
  .status(200)
  .json(new ApiResponse(200,post,"Post fetched successfully"));

});


const getAllPostsByUser=wrapAsync(async(req,res)=>{
  const {id}=req.params;
  if(!id){
    throw new ApiError(400,"invalid request id is missing ");
  }

  const allPostByUser = await Post.find({ createdBy: id });
  if(! allPostByUser|| allPostByUser.length === 0){
    throw new ApiError(404,"Posts not found");

  }
  
  res
  .status(400)
  .json(new ApiResponse(400, allPostByUser,"All posts created by the user have been retrieved"));

});



const deletePost = wrapAsync(async (req, res) => {
  const userId = req.user._id;
  
  // if (!user) {
  //   throw new ApiError(401, "Unauthorized request");
  // }
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "invalid request id not found ");
  }
  const post = await Post.findById(id);
  if(!post){
    throw new ApiError(404,"Post not found");
  }
 const isOwner = userId.equals(post.createdBy);
  console.log(isOwner);
  if (!isOwner) {
    throw new ApiError(401, "You are not authorized to perform this action");
  }
  const deletedPost = await Post.findByIdAndDelete(id);
  if(!deletePost){
    throw new ApiError(400,"something went wrong while deleting");
  }

  res
  .status(200)
  .json(
    new ApiResponse(
      200,
     "Post deleted successfully"

    )
  );
  
  });



export { 
  newPost,
  getAllPost,
  deletePost,
  singlePost,
  getAllPostsByUser,

};
