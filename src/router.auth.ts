import { Router } from "express";
import passport from "passport";

const router = Router();
//====Google Auth====//
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/admin/dashboard",
    failureRedirect: "/admin/login",
  })
);

export default router;
