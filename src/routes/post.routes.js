import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import wrapAsync from "../utils/wrapAsync.js";

const router = Router();

router.route("/")
  .get((req, res) => {
    res.send("All posts route");  
  })
  .post((req, res) => {
    res.send("Create a new post route");  
  });
export default router;
