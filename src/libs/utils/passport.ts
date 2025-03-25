import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import dotenv from "dotenv";
import googleAuthController from "../../controllers/googleAuth.controller";
import SessionData from "../types/express-session";

dotenv.config();

import GoogleAuthService from "../../service/GoogleAuth.service";
import MemberModel from "../../schema/Member.model";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const googleAuthService = new GoogleAuthService();
        const user = await googleAuthService.signupWithGoogle(profile);
        done(null, user);
      } catch (err) {
        console.error("Google Strategy Error:", err);
        done(err);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await MemberModel.findById(id).lean();
  done(null, user);
});
export default passport;
