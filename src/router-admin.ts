import express from "express";
import adminController from "./controllers/admin.controller";
import productController from "./controllers/product.controller";
import makeUploader from "./libs/utils/uploader";
const routerAdmin = express.Router();
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
routerAdmin.get(
  "/profile",

  adminController.getUpdateAdmin
);
routerAdmin.post(
  "/update",
  adminController.verifyAdmin,
  makeUploader("members").single("memberImages"),
  adminController.updateAdminData
);

//====Product Routes====//

routerAdmin.get(
  "/dashboard",
  adminController.verifyAdmin,
  adminController.getDashboard
);

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
routerAdmin.get("/user/all", adminController.getUsers);
routerAdmin.post(
  "/edit/user",
  adminController.verifyAdmin,
  adminController.updateChosenMember
);

routerAdmin.get("/admin-support", adminController.adminSupportPage);

//====Test===//

routerAdmin.get("/top-buyers", adminController.getAnalyticsDashboardData);

export default routerAdmin;
