import express from "express";
const routerAdmin = express.Router();
import adminController from "./controllers/admin.controller";
import productsController from "./controllers/products.controller";

/*Owner*/
routerAdmin.get("/", adminController.goHome);

routerAdmin
  .get("/login", adminController.getLogin)
  .post("/login", adminController.processLogin);

routerAdmin
  .get("/signup", adminController.getSignup)
  .post("/signup", adminController.processSignup);
routerAdmin.get("/logout", adminController.processLogout);
routerAdmin.get("/check-me", adminController.checkAuthSession);

/* Product */
routerAdmin.get(
  "/products/all",
  adminController.verifyAdmin,
  productsController.getAllProducts
);
routerAdmin.post(
  "/products/create",
  adminController.verifyAdmin,
  productsController.createNewProduct
);
routerAdmin.post(
  "/products/:id",
  adminController.verifyAdmin,
  productsController.updateChosenProduct
);

export default routerAdmin;
