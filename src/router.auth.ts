import { Router } from "express";
import passport from "passport";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/admin", // or wherever you want
    failureRedirect: "/admin/login", // show login on failure
  })
);

export default router;
