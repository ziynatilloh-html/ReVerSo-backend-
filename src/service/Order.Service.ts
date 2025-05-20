import { ObjectId } from "mongoose";

import { Member } from "../libs/types/member";

import Errors from "../libs/types/Error";
import { Message, HttpCode } from "../libs/types/Error";
import { shapeIntoMongooseObjectId } from "../libs/types/config";
import { OrderItemInput, OrderResult } from "../libs/types/order";
import { OrderInput } from "../libs/types/order";
import OrderItemModel from "../schema/OrderItem.model";
import OrderModel, { OrderDoc } from "../schema/Order.model";

export default class OrderService {
  private readonly orderModel;
  private orderItemModel = OrderItemModel;
  constructor() {
    this.orderModel = OrderModel;
    this.orderItemModel = OrderItemModel;
  }
  public async savePaidOrder(
    member: Member,
    orderInput: OrderInput
  ): Promise<OrderDoc> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const { orderItems, paymentMethod, shippingAddress } = orderInput;

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.itemPrice * item.itemQuantity,
      0
    );
    const delivery = totalAmount < 100 ? 5 : 0;

    const newOrder = await this.orderModel.create({
      memberId,
      totalAmount: totalAmount + delivery,
      paymentMethod,
      orderStatus: "PAID",
      shippingAddress,
    });

    await this.recordOrderItem(newOrder._id, orderItems);
    return newOrder;
  }

  private async recordOrderItem(orderId: ObjectId, items: OrderItemInput[]) {
    const itemData = items.map((item) => ({
      orderId,
      productId: shapeIntoMongooseObjectId(item.productId),
      itemPrice: item.itemPrice,
      itemQuantity: item.itemQuantity,
    }));

    await this.orderItemModel.insertMany(itemData);
  }
}
