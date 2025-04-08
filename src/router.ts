import express from "express";
const router = express.Router();
import memberController from "./controllers/member.controller";
import makeUploader from "./libs/utils/uploader";

//====Member Routes====//
router.post(
  "/signup",
  makeUploader("members").single("memberImage"),
  memberController.signup
);
router.post("/login", memberController.login);

export default router;
