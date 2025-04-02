import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Post } from "../models/post.model.js";
import wrapAsync from "../utils/wrapAsync.js";
import { User } from "../models/user.model.js";
import Fuse from 'fuse.js'

const searchPosts = wrapAsync(async (req, res) => {
  res.status(200).json(new ApiResponse(200, "sucess"));
});

const searchSuggest = wrapAsync(async (req, res) => {
    const ds = await User.find({}).select('username _id avatar fullname');

    if(!req.query){
       new ApiError(400,"Empty query");
    }
  const { search } = req.query;
  if (!search) {
    new ApiError(400, "Empty query");
  }

const fuseOptions = {
	keys: [
		"username",
		"fullname"
	]
};

const fuse = new Fuse(ds, fuseOptions);



const result = fuse.search(search);
console.log(result.map((data)=>data.item.username));

res
.status(200)
.json(new ApiResponse(200, result,"this suggestion route "));

});

export{

    searchPosts,
    searchSuggest,


 };
