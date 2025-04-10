import { LoginInput, Member } from "./../libs/types/member";
import { Request, Response } from "express";
import { T } from "../libs/types/common";
import MemberService from "../service/Member.service";
import { MemberInput } from "../libs/types/member";
import Errors, { HttpCode } from "../libs/types/Error";
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
      result = await memberService.login(input);
    //TODO Tokens
    res.json({ member: result });
  } catch (err) {
    console.log("Error, login:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export default memberController;
