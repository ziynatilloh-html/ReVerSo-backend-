import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import GoogleAuthService from "../../service/GoogleAuth.service";
import MemberModel from "../../schema/Member.model";
dotenv.config();
// ADMIN STRATEGY
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
        const admin = await googleAuthService.signupWithGoogle(
          profile,
          "admin"
        );
        done(null, admin);
      } catch (err) {
        console.error("Google Admin Strategy Error:", err);
        done(err);
      }
    }
  )
);

// MEMBER STRATEGY
passport.use(
  "google-member",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID_MEMBER!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET_MEMBER!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL_MEMBER!,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const googleAuthService = new GoogleAuthService();
        const member = await googleAuthService.signupWithGoogle(
          profile,
          "member"
        );
        done(null, member);
      } catch (err) {
        console.error("Google Member Strategy Error:", err);
        done(err);
      }
    }
  )
);
passport.serializeUser((member: any, done) => {
  done(null, member._id);
});

passport.deserializeUser(async (id, done) => {
  const member = await MemberModel.findById(id).lean();
  done(null, member);
});
export default passport;
