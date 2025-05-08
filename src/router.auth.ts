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
//=== Google OAuth Members ===//
router.get(
  "/member/google",
  passport.authenticate("google-member", { scope: ["profile", "email"] })
);

router.get(
  "/member/google/callback",
  passport.authenticate("google-member", { failureRedirect: "/login" }),
  (req, res) => {
    const user = req.user as Member;
    (req.session as Session & { member: Member }).member = user;

    req.session.save((err) => {
      if (err) {
        console.error("Session save error after Google member login:", err);
        return res.redirect("/login");
      }

      console.log("✅ Google MEMBER login successful. Session saved.");
      res.redirect("http://localhost:3000/account"); // or other member page
    });
  }
);
export default router;
