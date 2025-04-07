import { NextFunction, Request, Response } from "express";
import { T } from "../libs/types/common";
import MemberService from "../service/Member.service";
import { MemberType } from "../libs/enums/member.enum";
import {
  AdminRequest,
  LoginInput,
  MemberInput,
  PasswordResetRequestInput,
} from "../libs/types/member";
import Errors, { Message } from "../libs/types/Error";

const adminController: T = {};
adminController.goHome = (req: Request, res: Response) => {
  try {
    console.log("goHome");
    res.render("home");
  } catch (err) {
    console.log("Error goHome:", err);
    res.redirect("/admin");
  }
};

//TEST VERSION //
adminController.getDashboard = (req: Request, res: Response) => {
  try {
    res.render("dashboard");
  } catch (err) {
    console.log("Error loading dashboard:", err);
    res.redirect("/admin/login");
  }
};
adminController.getLogin = (req: Request, res: Response) => {
  try {
    console.log("getLogin");
    res.render("login");
  } catch (err) {
    console.log("Error getLogin:", err);
    res.redirect("/admin");
  }
};
adminController.getSignup = (req: Request, res: Response) => {
  try {
    console.log("getSignup");
    res.render("signup");
  } catch (err) {
    console.log("Error getSignup:", err);
    res.redirect("/admin");
  }
};
adminController.getRequestPassword = (req: Request, res: Response) => {
  try {
    console.log("getRequestPassword");
    res.render("request-password");
  } catch (err) {
    console.log("Error, getRequestPassword:", err);
    res.redirect("/admin");
  }
};
adminController.getResetPassword = (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    res.render("reset-password", { token });
  } catch (err) {
    console.log("Error, getResetPassword:", err);
    res.redirect("/admin/login");
  }
};
adminController.adminSupportPage = (req: Request, res: Response) => {
  try {
    console.log("adminSupportPage");
    res.render("admin-support");
  } catch (err) {
    console.log("Error, adminSupportPage:", err);
    res.redirect("/admin/dashboard");
  }
};
//Back-end side server rendering

adminController.processLogin = async (req: AdminRequest, res: Response) => {
  try {
    console.log("processLogin");
    const input: LoginInput = req.body;

    const memberService = new MemberService();
    const result = await memberService.processLogin(input);
    req.session.member = result;
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.redirect("/login");
      }
      return res.redirect("/admin/dashboard");
    });
  } catch (err) {
    console.log("Error processLogin:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.redirect("login");
  }
};
adminController.processSignup = async (req: AdminRequest, res: Response) => {
  try {
    console.log("processSignup");

    const newMember: MemberInput = req.body;
    newMember.memberType = MemberType.ADMIN;
    newMember.memberImage = req.file?.filename;

    const memberService = new MemberService();
    const result = await memberService.processSignup(newMember);

    req.session.member = result;
    res.send(result);
  } catch (err) {
    console.log("Error, processSignup:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script>alert("${message}"); window.location.href='/admin/login';</script>`
    );
  }
};
adminController.processLogout = async (req: AdminRequest, res: Response) => {
  try {
    console.log("processLogout");
    req.session.destroy(function (err) {
      if (err) {
        console.log("Session destruction error:", err);
        return res.send(`<script>alert("Logout failed")</script>`);
      }
      res.redirect("/admin");
    });
  } catch (err) {
    console.log("Error, processLogout:", err);
    res.redirect("/admin");
  }
};
adminController.checkAuthSession = async (req: AdminRequest, res: Response) => {
  try {
    if (req.session?.member)
      res.send(`<script>alert("${req.session.member.memberNick}")<script>`);
    else res.send(`<script>alert("${Message.NOT_AUTHENTICATED}")<script>`);
  } catch (err) {
    console.log("Error,processLogin", err);
    res.send(err);
  }
};
adminController.verifyAdmin = (
  req: AdminRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.session?.member?.memberType === MemberType.ADMIN) {
    req.member = req.session.member;
    next();
  } else {
    const message = Message.NOT_AUTHENTICATED;
    res.send(`<script>alert("${message}")<script>`);
  }
};

//Password resetting//
adminController.requestPassword = async (req: Request, res: Response) => {
  try {
    console.log("requestPassword");
    const input: PasswordResetRequestInput = req.body;
    const memberService = new MemberService();
    const result = await memberService.requestPassword(input);

    res.render("request-password", {
      result: { ...result, error: false },
    });
  } catch (err) {
    console.log("Error, requestPassword:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.render("request-password", {
      result: { message, error: true },
    });
  }
};
adminController.resetPassword = async (req: Request, res: Response) => {
  try {
    console.log("resetPassword");
    const input = req.params.token;
    const { newPassword } = req.body;

    const memberService = new MemberService();
    const result = await memberService.resetPassword(input, newPassword);
    res.render("login", { result });
  } catch (err) {
    console.log("Error, resetPassword:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(`<script>alert("${message}")<script>`);
  }
};

export default adminController;
