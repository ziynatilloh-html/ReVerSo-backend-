import { SessionData } from "express-session";
import { Request, Response } from "express";
import GoogleAuthService from "../service/GoogleAuth.service";
import { Profile } from "passport-google-oauth20";
import Errors, { Message } from "../libs/types/Error";
import { T } from "../libs/types/common";

const googleAuthController: T = {};
//==== Google Auth Controller====//
googleAuthController.signupWithGoogle = async (
  req: Request,
  res: Response,
  profile: Profile
) => {
  try {
    console.log("signupWithGoogle");

    const googleAuthService = new GoogleAuthService();
    const member = await googleAuthService.signupWithGoogle(profile);

    const SessionDataInstance = req.session as SessionData;
    SessionDataInstance.member = member;
    req.session.member = member;

    await new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return reject(err);
        }
        console.log("✅ Session saved with member:", req.session.member);
        resolve(null);
      });
    });

    res.redirect("/dashboard");
  } catch (err) {
    console.error("Error signupWithGoogle:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(`<script>alert("${message}")</script>`);
  }
};

export default googleAuthController;
