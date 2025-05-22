import express from "express";
const router = express.Router();
import memberController from "./controllers/member.controller";
import makeUploader from "./libs/utils/uploader";
import productController from "./controllers/product.controller";
import orderController from "./controllers/order.controller";

//====Member Routes====//
router.post(
  "/member/signup",
  makeUploader("members").single("memberImage"),
  memberController.signup
);
router.post("/member/login", memberController.login);
router.post(
  "/member/logout",
  memberController.verifyAuth,
  memberController.logout
);
router.get(
  "/member/detail",
  memberController.verifyAuth,
  memberController.getSelf
);

router.post(
  "/member/update",
  memberController.verifyAuth,
  makeUploader("members").single("memberImage"),
  memberController.updateSelf
);

router.post("/member/request-password", memberController.requestPassword);
router.post("/member/reset-password/:token", memberController.resetPassword);
export default router;

//===Product Routes====//
router.get("/product/new-arrivals", productController.getNewArrivals);
router.get("/product/popular-products", productController.getPopularProducts);
router.get("/product/list", productController.getProductList);

router.get("/product/:id", productController.getProductById);

//===Order Routes====//
// ✅ 1. Create Stripe PaymentIntent (needs auth)
router.post(
  "/order/create-payment-intent",
  memberController.verifyAuth, // ⛔ require login
  orderController.createPaymentIntent
);

// ✅ 2. Save order AFTER payment succeeds (final insert)
router.post(
  "/order/save-success",
  memberController.verifyAuth, // ⛔ require login
  orderController.saveOrderAfterPayment
);

// ✅ 3. Get all orders for the current logged-in member
router.get(
  "/order/member/:memberId",
  memberController.verifyAuth, // ⛔ require login
  orderController.getOrdersByMember
);
