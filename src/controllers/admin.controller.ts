import { Request, Response } from "express";
import { T } from "../libs/types/common";
import MemberService from "../service/Member.service";
import { MemberType } from "../libs/enums/member.enum";
import { AdminRequest, LoginInput, MemberInput } from "../libs/types/member";
import { Message } from "../libs/types/Error";

const adminController: T = {};
adminController.goHome = (req: Request, res: Response) => {
  try {
    console.log("goHome");
    res.render("Home page");
  } catch (err) {
    console.log("Error goHome:", err);
  }
};
adminController.getLogin = (req: Request, res: Response) => {
  try {
    console.log("getLogin");
    res.render("Login page");
  } catch (err) {
    console.log("Error getLogin:", err);
  }
};
adminController.getSignup = (req: Request, res: Response) => {
  try {
    console.log("getSignup");
    res.render("Sing-up page");
  } catch (err) {
    console.log("Error getSignup:", err);
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
    req.session.save(function () {
      res.send(result);
    });
  } catch (err) {
    console.log("Error processLogin:", err);
  }
};
adminController.processSignup = async (req: AdminRequest, res: Response) => {
  try {
    console.log("processSignup");

    const newMember: MemberInput = req.body;
    newMember.memberType = MemberType.ADMIN;

    const memberService = new MemberService();
    const result = await memberService.processSignup(newMember);
    req.session.member = result;
    req.session.save(function () {
      res.send(result);
    });
  } catch (err) {
    console.log("Error, processSignup:", err);
    res.send(err);
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
export default adminController;
