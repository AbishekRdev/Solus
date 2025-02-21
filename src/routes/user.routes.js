import { Router } from "express";
import {
  logInUser,
  logOutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/register",
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registerUser
);


router.post(

  "/login", 
  logInUser,

);

//secured Routes
router.post(

 "/logout", 
 verifyJWT,
logOutUser,

);


router.post(

  "/refresh-token",
  refreshAccessToken,




)

export default router;
