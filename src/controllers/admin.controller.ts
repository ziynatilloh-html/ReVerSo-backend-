import { Request, Response } from "express";
import { T } from "../libs/types/common";
import MemberService from "../service/Member.service";

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
adminController.processSignUp = async (req: Request, res: Response) => {
  try {
    console.log("processSignUp");
    res.send("processSignUp");
  } catch (err) {
    console.log("Error processSignUp:", err);
  }
};
export default adminController;
