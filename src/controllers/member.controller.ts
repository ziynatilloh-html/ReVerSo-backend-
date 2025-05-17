import { ExtendedRequest, LoginInput, Member } from "./../libs/types/member";
import { NextFunction, Request, Response } from "express";
import { T } from "../libs/types/common";
import MemberService from "../service/Member.service";
import { MemberInput } from "../libs/types/member";
import Errors, { HttpCode, Message } from "../libs/types/Error";
import AuthService from "../service/Auth.Service";
import { AUTH_TIMER } from "../libs/types/config";

//=====Models=====//
const memberService = new MemberService();
const authService = new AuthService();
const memberController: T = {};

//=====SPA=====//
//===== Member Controller=====//
memberController.goHome = (req: Request, res: Response) => {
  try {
    res.send("Home page ");
  } catch (err) {
    console.log("Error goHome:", err);
  }
};

memberController.getLogin = (req: Request, res: Response) => {
  try {
    res.send("Login page ");
  } catch (err) {
    console.log("Error getLogin:", err);
  }
};
memberController.getSignup = (req: Request, res: Response) => {
  try {
    res.send("Sing-up page");
  } catch (err) {
    console.log("Error getSignup:", err);
  }
};
memberController.signup = async (req: Request, res: Response) => {
  try {
    console.log("signup");
    const input = req.body as MemberInput;
    input.memberImage = req.file?.filename;
    const result = await memberService.signup(input);
    const token = await authService.createToken(result);
    res.cookie("accessToken", token, {
      maxAge: AUTH_TIMER * 3600 * 1000,
      httpOnly: false,
    });
    res.status(HttpCode.CREATED).json({ member: result, accessToken: token });
  } catch (err) {
    console.log("Error, login:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};
memberController.login = async (req: Request, res: Response) => {
  try {
    console.log("login");
    const input: LoginInput = req.body,
      result = await memberService.login(input),
      token = await authService.createToken(result);
    res.cookie("accessToken", token, {
      maxAge: AUTH_TIMER * 3600 * 1000,
      httpOnly: false,
    });

    res.status(HttpCode.OK).json({ member: result, accessToken: token });
  } catch (err) {
    console.log("Error, login:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};
memberController.verifyAuth = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let member = null;
    const token = req.cookies["accessToken"];
    if (token) member = await authService.checkAuth(token);
    if (!member)
      throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);
    next();
  } catch (err) {
    console.log("Error, login:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

memberController.logout = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("logout");
    res.cookie("accessToken", null, { maxAge: 0, httpOnly: true });
    res.status(HttpCode.OK).json({ logout: true });
  } catch (err) {
    console.log("Error, logout:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};
memberController.retrieveAuth = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies["accessToken"];
    if (token) req.member = await authService.checkAuth(token);

    next();
  } catch (err) {
    console.log("Error, retrieveAuth:", err);
    next();
  }
};

//=== Password Reset =====//
//======Password Reset======//
memberController.requestPassword = async (req: Request, res: Response) => {
  try {
    console.log("member requestPassword");
    const input = req.body;
    const result = await memberService.requestPassword(input);

    res.json({ result, error: false });
  } catch (err) {
    console.log("Error, member requestPassword:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.status(400).json({ message, error: true });
  }
};

memberController.resetPassword = async (req: Request, res: Response) => {
  try {
    console.log("member resetPassword");
    const token = req.params.token;
    const { newPassword } = req.body;

    await memberService.resetPassword(token, newPassword);
    res.json({ message: "Password reset successful!" });
  } catch (err) {
    console.log("Error, member resetPassword:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.status(400).json({ message, error: true });
  }
};
export default memberController;
