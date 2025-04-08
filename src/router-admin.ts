import express from "express";
const routerAdmin = express.Router();
import adminController from "./controllers/admin.controller";
import productController from "./controllers/product.controller";
import makeUploader from "./libs/utils/uploader";

//====Admin Routes====//
routerAdmin.get("/", adminController.goHome);

//====Authentification Routes ADMIN====//
routerAdmin
  .get("/signup", adminController.getSignup)
  .post(
    "/signup",
    makeUploader("members").single("memberImage"),
    adminController.processSignup
  );
routerAdmin
  .get("/login", adminController.getLogin)
  .post("/login", adminController.processLogin);

routerAdmin
  .get("/request-password", adminController.getRequestPassword)
  .post("/request-password", adminController.requestPassword);

routerAdmin
  .get("/reset-password/:token", adminController.getResetPassword)
  .post("/reset-password/:token", adminController.resetPassword);

routerAdmin.get("/logout", adminController.processLogout);
routerAdmin.get("/check-me", adminController.checkAuthSession);

//====Product Routes====//

routerAdmin.get("/dashboard", adminController.getDashboard);

routerAdmin.get(
  "/product/all",
  adminController.verifyAdmin,
  productController.getAllProducts
);

routerAdmin.post(
  "/product/create",
  adminController.verifyAdmin,
  makeUploader("products").array("productImages", 5),
  productController.createNewProduct
);
routerAdmin.post(
  "/product/:id",
  adminController.verifyAdmin,
  productController.updateChosenProduct
);
//====User Routes====//
routerAdmin.get(
  "/user/all",
  adminController.verifyAdmin,
  adminController.getUsers
);
routerAdmin.post(
  "/edit/user",
  adminController.verifyAdmin,
  adminController.updateChosenMember
);

routerAdmin.get("/admin-support", adminController.adminSupportPage);

export default routerAdmin;
