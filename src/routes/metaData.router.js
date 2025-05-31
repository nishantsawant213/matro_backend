import { Router } from "express";
import { metaData1, metaData2 } from "../controllers/metaData.controller.js";


const router = Router()



router.route("/RegisterMetaData1").get(metaData1)
router.route("/RegisterMetaData2").post(metaData2)

// router.route("/RegisterMetaData2").post(loginSendOTP)


export default router;