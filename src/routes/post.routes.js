import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  deletePost,
  getAllPost,
  getAllPostsByUser,
  newPost,
  singlePost,
} from "../controllers/post.controller.js";

const router = Router();

router
  .route("/")
  .get(getAllPost)
  .post(
    verifyJWT,
    upload.fields([
      {
        name: "img",
        maxCount: 1,
      },
    ]),
    newPost
  );

router
.route("/:id")
.delete(
  verifyJWT, 
  deletePost,
)
.get(singlePost);

router.get("/user/:id", getAllPostsByUser);

export default router;
