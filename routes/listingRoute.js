import { Router } from "express"
const router = Router();

import verifyJWT from "../utiles/verifyJWT.js";
import {createListing, deleteListing, updateListing, getListing} from "../controllers/listingController.js"

router.route("/listing/create").post(verifyJWT,createListing)
router.route("/delete-listing/:id").delete(verifyJWT,deleteListing)
router.route("/update-listing/:id").post(verifyJWT,updateListing)
router.route('/get').get(getListing)

export default router