import dotenv from "dotenv";
import { Response } from "express";
import { ExtendedRequest } from "../libs/types/member";
import Errors, { Message, HttpCode } from "../libs/types/Error";
import { T } from "../libs/types/common";
import OrderService from "../service/Order.Service";
import Stripe from "stripe";

dotenv.config();
const orderService = new OrderService();
const orderController: T = {};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

// ✅ Handle Stripe PaymentIntent
orderController.createPaymentIntent = async (
  req: ExtendedRequest,
  res: Response
) => {
  try {
    if (!req.member) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        code: HttpCode.UNAUTHORIZED,
        message: Message.NOT_AUTHENTICATED,
      });
    }

    const { totalAmount } = req.body;
    if (!totalAmount) {
      return res.status(HttpCode.BAD_REQUEST).json({
        code: HttpCode.BAD_REQUEST,
        message: "Total amount is required",
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: "usd",
      payment_method_types: ["card"],
    });

    return res.status(HttpCode.OK).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error("Error creating payment intent:", err);
    return res.status(HttpCode.INTERNAL_SERVER_ERROR).json(Errors.standard);
  }
};

// ✅ Save order only AFTER payment is confirmed
orderController.saveOrderAfterPayment = async (
  req: ExtendedRequest,
  res: Response
) => {
  try {
    if (!req.member) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        code: HttpCode.UNAUTHORIZED,
        message: Message.NOT_AUTHENTICATED,
      });
    }

    const savedOrder = await orderService.savePaidOrder(req.member, req.body);
    return res.status(HttpCode.OK).json(savedOrder);
  } catch (err) {
    console.error("❌ Error saving order:", err);
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(Errors.standard);
  }
  // ✅ Get Orders by Member ID
};
orderController.getOrdersByMember = async (
  req: ExtendedRequest,
  res: Response
) => {
  try {
    const memberId = req.params.memberId;

    if (!req.member || req.member._id.toString() !== memberId) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        code: HttpCode.UNAUTHORIZED,
        message: Message.NOT_AUTHENTICATED,
      });
    }

    const orders = await orderService.getOrdersByMember(memberId);

    return res.status(HttpCode.OK).json(orders); // ✅ always return array
  } catch (err) {
    console.error("❌ Error fetching member orders:", err);
    return res.status(HttpCode.INTERNAL_SERVER_ERROR).json(Errors.standard);
  }
};

export default orderController;
