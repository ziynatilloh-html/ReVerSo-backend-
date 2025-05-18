import { Request, Response, NextFunction } from "express";
import { ExtendedRequest, Member } from "./libs/types/member";
import { T } from "./libs/types/common";
import AuthService from "./service/Auth.Service";

const authService = new AuthService();

export async function memberSession(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const sessionInstance = req.session as T;
    const extendedReq = req as ExtendedRequest;

    // ✅ Block accessToken auto-login on /admin routes
    const isAdminRoute = req.originalUrl.startsWith("/admin");

    // ✅ Only check accessToken if not admin route
    const token = !isAdminRoute ? req.cookies["accessToken"] : null;

    if (token) {
      try {
        const member = await authService.checkAuth(token);
        if (member) {
          extendedReq.member = member;
          res.locals.member = member;
          console.log("✅ Current member from accessToken:", member.memberNick);
          return next();
        }
      } catch (err) {
        console.log("❌ Invalid accessToken:", err);
      }
    }

    // ✅ Fallback to Passport session or session.member (for admin)
    if (req.isAuthenticated?.() && req.user) {
      extendedReq.member = req.user as Member;
      res.locals.member = req.user;
    } else if (sessionInstance.member) {
      extendedReq.member = sessionInstance.member as Member;
      res.locals.member = sessionInstance.member;
    } else {
      extendedReq.member = undefined;
      res.locals.member = null;
    }

    console.log(
      "✅ Current member in middleware (fallback):",
      extendedReq.member?.memberNick
    );

    next();
  } catch (error) {
    console.log("❌ Error in memberSession:", error);
    next();
  }
}
