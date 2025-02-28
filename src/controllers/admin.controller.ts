import { Request, Response } from "express";
import { T } from "../libs/types/common";
import MemberService from "../service/Member.service";
import { MemberType } from "../libs/enums/member.enum";
import { MemberInput } from "../libs/types/member";

const adminController: T = {};
adminController.goHome = (req: Request, res: Response) => {
  try {
    console.log("goHome");
    res.send("Home page");
  } catch (err) {
    console.log("Error goHome:", err);
  }
};
adminController.getLogin = (req: Request, res: Response) => {
  try {
    console.log("getLogin");
    res.send("Login page");
  } catch (err) {
    console.log("Error getLogin:", err);
  }
};
adminController.getSignup = (req: Request, res: Response) => {
  try {
    console.log("getSignup");
    res.send("Sing-up page");
  } catch (err) {
    console.log("Error getSignup:", err);
  }
};

//Back-end side server rendering
adminController.processLogin = async (req: Request, res: Response) => {
  try {
    console.log("processLogin");
    res.send("processLogin");
  } catch (err) {
    console.log("Error processLogin:", err);
  }
};
adminController.processSignup = async (req: Request, res: Response) => {
  try {
    console.log("processSignup");

    const newMember: MemberInput = req.body;
    console.log("req.body:", req.body);
    newMember.memberType = MemberType.ADMIN;

    const memberService = new MemberService();
    const result = await memberService.processSignup(newMember);
    res.send(result);
  } catch (err) {
    console.log("Error, processSignup:", err);
    res.send(err);
  }
};
export default adminController;
