import express from "express";
const routerAdmin = express.Router();
import adminController from "./controllers/admin.controller";
import productsController from "./controllers/products.controller";
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

/* Product */
routerAdmin.get(
  "/products/all",
  adminController.verifyAdmin,
  productsController.getAllProducts
);
routerAdmin.post(
  "/products/create",

  adminController.verifyAdmin,
  // makeUploader.single("productImage"),
  makeUploader("products").array("productImages", 5),
  productsController.createNewProduct
);
routerAdmin.post(
  "/products/:id",
  adminController.verifyAdmin,
  productsController.updateChosenProduct
);

//TEST//

routerAdmin.get("/dashboard", adminController.getDashboard);

export default routerAdmin;
