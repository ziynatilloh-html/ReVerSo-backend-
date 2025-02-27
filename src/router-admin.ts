import express from "express";
const routerAdmin = express.Router();
import adminController from "./controllers/admin.controller";

/*Owner*/
routerAdmin.get("/", adminController.goHome);

routerAdmin
  .get("/login", adminController.getLogin)
  .post("/login", adminController.processLogin);

routerAdmin
  .get("/signup", adminController.getSignup)
  .post("/signup", adminController.processSignup);

export default routerAdmin;
