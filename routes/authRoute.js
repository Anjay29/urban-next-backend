import { Router } from "express";
const router = Router()

import {auth, googleAuth, signIn, signOut} from "../controllers/authController.js";

router.route("/signup").post(auth)
router.route("/login").post(signIn)
router.route("/signout").get(signOut)
router.route("/auth/google").post(googleAuth)

export default router;