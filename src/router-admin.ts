import express from "express";
const routerAdmin = express.Router();
import adminController from "./controllers/admin.controller";
import productController from "./controllers/product.controller";
import makeUploader from "./libs/utils/uploader";

/*Owner*/
routerAdmin.get("/", adminController.goHome);

routerAdmin
  .get("/login", adminController.getLogin)
  .post("/login", adminController.processLogin);

routerAdmin
  .get("/signup", adminController.getSignup)
  .post(
    "/signup",
    makeUploader("members").single("memberImage"),
    adminController.processSignup
  );
routerAdmin.get("/logout", adminController.processLogout);
routerAdmin.get("/check-me", adminController.checkAuthSession);

routerAdmin
  .get("/request-password", adminController.getRequestPassword)
  .post("/request-password", adminController.requestPassword);

routerAdmin
  .get("/reset-password/:token", adminController.getResetPassword)
  .post("/reset-password/:token", adminController.resetPassword);

routerAdmin.get("/admin-support", adminController.adminSupportPage);

/* Product */
routerAdmin.get(
  "/product/all",
  adminController.verifyAdmin,
  productController.getAllProducts
);
routerAdmin.post(
  "/product/create",
  adminController.verifyAdmin,
  // makeUploader("products").single("productImages"),
  makeUploader("products").array("productImages", 5),
  productController.createNewProduct
);
routerAdmin.post(
  "/product/:id",
  adminController.verifyAdmin,
  productController.updateChosenProduct
);

//TEST//

routerAdmin.get("/dashboard", adminController.getDashboard);

export default routerAdmin;
