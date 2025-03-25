import { SessionData } from "express-session";
import { Request, Response } from "express";
import GoogleAuthService from "../service/GoogleAuth.service";
import { Profile } from "passport-google-oauth20";
import Errors, { Message } from "../libs/types/Error";
import { T } from "../libs/types/common";

const googleAuthController: T = {};

googleAuthController.signupWithGoogle = async (
  req: Request,
  res: Response,
  profile: Profile
) => {
  try {
    const googleAuthService = new GoogleAuthService();
    const user = await googleAuthService.signupWithGoogle(profile);
    const SessionDataInstance = req.session as SessionData;
    SessionDataInstance.member = user;
    req.session.member = user;
    req.session.save(() => {
      res.redirect("/admin");
    });
  } catch (err) {
    console.error("Error signupWithGoogle:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(`<script>alert("${message}")</script>`);
  }
};

export default googleAuthController;
