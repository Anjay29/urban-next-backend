import { Router } from "express";
const router = Router();

import {deleteUser, updateUser, getListings, getListing, getUser} from "../controllers/userController.js"
import verifyJWT from "../utiles/verifyJWT.js";

router.route('/update/:id').post(verifyJWT,updateUser);
router.route('/delete/:id').delete(verifyJWT,deleteUser);
router.route('/listings/:id').get(verifyJWT,getListings);
router.route('/listing/get/:id').get(getListing);
router.route("/user/:id").get(getUser);

export default router