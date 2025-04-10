import express from "express";
const router = express.Router();
import memberController from "./controllers/member.controller";
import makeUploader from "./libs/utils/uploader";

//====Member Routes====//
router.post(
  "/member/signup",
  makeUploader("members").single("memberImage"),
  memberController.signup
);
router.post("/member/login", memberController.login);
router.post(
  "/member/logout",
  memberController.verifyAuth,
  memberController.logout
);
router.get("/member/detail", memberController.verifyAuth);

export default router;
