import { Router } from "express";
import { loginUser, logoutUser, registeruser } from "../controllers/user.controller.js";
import { upload } from './../middlewares/multer.middleware.js';
import { verifyJWT } from "../middlewares/auth.middleware.js";
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

router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logoutUser)
export default router