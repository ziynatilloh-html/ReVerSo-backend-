import { Request, Response } from "express";
import { T } from "../libs/types/common";

const adminController: T = {};
adminController.goHome = (req: Request, res: Response) => {
  try {
    res.send("Home page ");
  } catch (err) {
    console.log("Error goHome:", err);
  }
};
adminController.getLogin = (req: Request, res: Response) => {
  try {
    res.send("Login page ");
  } catch (err) {
    console.log("Error getLogin:", err);
  }
};
adminController.getSignup = (req: Request, res: Response) => {
  try {
    res.send("Sing-up page");
  } catch (err) {
    console.log("Error getSignup:", err);
  }
};
export default adminController;
