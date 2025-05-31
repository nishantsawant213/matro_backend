import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  verifyLogin,
  loginSendOTP,
} from "../controllers/user.controller.js";
import {
  verifyRegisterOTP,
  registerNewUser,
  userPersonDetailsUpdate,
  updateeducationdetails,
  updateFamilyDetails,
  updatePreferences,
  updateAdvancePreferences,
  updateotherInformation,
} from "../controllers/user/register.user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "image1",
      maxCount: 5,
    },
  ]),
  registerUser,
);

router.route("/login").post(loginUser);

router.route("/loginsendotp").post(loginSendOTP);
router.route("/verifylogin").post(verifyLogin);

router.route("/verifyregisterotp").post(verifyRegisterOTP);
router.route("/registerNewUser").post(registerNewUser);
router.route("/updatepersonaldetails").post(verifyJWT, userPersonDetailsUpdate);
router.route("/updateeducationdetails").post(verifyJWT, updateeducationdetails);
router.route("/udpatefamilydetails").post(verifyJWT, updateFamilyDetails);
router.route("/updatepreferences").post(verifyJWT, updatePreferences);
router.route("/updateotherinformation").post(verifyJWT, updateotherInformation);

router.route("/logout").post(verifyJWT, logoutUser);

export default router;
