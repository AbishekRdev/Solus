import { Router } from "express";
import {
  changeCurrentPassword,
  changeFullname,
  getCurrentUser,
  logInUser,
  logOutUser,
  refreshAccessToken,
  registerUser,
  updateAvatar,
  checkUserEmail,
  checkUserUsername,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


//get current user route 
router.get(
  "/me",
  verifyJWT,
  getCurrentUser,
);



router.post(

  "/register",
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registerUser,


);

router.post(

  "/login",
  logInUser

);


//secured Routes
router.post(

  "/logout",
   verifyJWT,
   logOutUser

);

router.post(

  "/refresh-token",
  refreshAccessToken,

);

router.post(

  "/change-password",
  verifyJWT,
  changeCurrentPassword,
 

);

router.patch(

  "/change-fullname",
  verifyJWT,
  changeFullname,
 
);

router.patch(
"/avatar",
verifyJWT,
upload.single("avatar"),
updateAvatar,

);

router.post(
  "/check-email",
  checkUserEmail,

)

router.post(
  "/check-username",
  checkUserUsername,

)



export default router;
