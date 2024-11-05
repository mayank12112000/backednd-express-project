import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registeruser } from "../controllers/user.controller.js";
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
router.route("/refresh-access-token").post(refreshAccessToken)
export default router