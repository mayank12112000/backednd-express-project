import { Router } from "express";
import { registeruser } from "../controllers/user.controller.js";
import { upload } from './../middlewares/multer.middleware.js';
const router = Router()

router.route("/register").post(
    upload.fields([ // upload is middleware here
        {
            name:"avatar",
            maxCount:1, // only one file
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registeruser
)

export default router