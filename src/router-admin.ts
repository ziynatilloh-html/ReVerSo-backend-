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
routerAdmin.get("/products/all", productsController.getAllProducts);
routerAdmin.post("/products/create", productsController.createNewProduct);
routerAdmin.post("/products/:id", productsController.updateChosenProduct);

export default routerAdmin;
