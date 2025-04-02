import { Router } from "express";
import { 

    searchPosts,
    searchSuggest,



} from "../controllers/feed.controller.js";

const router = Router();


router
.route("/")
.get(searchPosts);

router
.route("/suggest")
.get(searchSuggest)

export default router;
