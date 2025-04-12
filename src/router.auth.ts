import passport from "./libs/utils/passport";
import express from "express";
import { Member } from "./libs/types/member";
import { Session } from "express-session";

const router = express.Router();

// === Google OAuth Login Redirect ===
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// === Google OAuth Callback ===

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const user = req.user as Member;

    (req.session as Session & { member: Member }).member = user;

    req.session.save((err) => {
      if (err) {
        console.error("Session save error after Google login:", err);
        return res.redirect("/login");
      }

      console.log("✅ Google login successful. Session saved.");
      res.redirect("/admin/dashboard");
    });
  }
);

export default router;
