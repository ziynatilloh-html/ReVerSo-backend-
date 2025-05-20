import { ObjectId } from "mongoose";

import { Member } from "../libs/types/member";

import Errors from "../libs/types/Error";
import { Message, HttpCode } from "../libs/types/Error";
import { shapeIntoMongooseObjectId } from "../libs/types/config";
import { OrderResult } from "../libs/types/order";
import { OrderInput } from "../libs/types/order";
import OrderItemModel from "../schema/OrderItem.model";
import OrderModel from "../schema/Order.model";

export default class OrderService {
  public async createOrder(
    member: Member,
    input: OrderInput
  ): Promise<OrderResult> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const { orderItems, paymentMethod, shippingAddress } = input;

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.itemPrice * item.itemQuantity,
      0
    );
    const delivery = totalAmount < 100 ? 5 : 0;

    try {
      const newOrder = await OrderModel.create({
        memberId,
        totalAmount: totalAmount + delivery,
        paymentMethod,
        orderStatus: "PENDING",
        shippingAddress,
      });

      await OrderItemModel.insertMany(
        orderItems.map((item) => ({
          orderId: newOrder._id,
          productId: shapeIntoMongooseObjectId(item.productId),
          itemPrice: item.itemPrice,
          itemQuantity: item.itemQuantity,
        }))
      );

      return {
        _id: newOrder._id,
        memberId: newOrder.memberId,
        orderTotal: newOrder.totalAmount,
        orderDelivery: delivery,
        createdAt: newOrder.createdAt,
        updatedAt: newOrder.updatedAt,
      };
    } catch (err) {
      console.error("Error,model:CreateOrder", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }
}
