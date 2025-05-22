import { ObjectId } from "mongoose";

import { Member } from "../libs/types/member";

import Errors from "../libs/types/Error";
import { Message, HttpCode } from "../libs/types/Error";
import { shapeIntoMongooseObjectId } from "../libs/types/config";
import { OrderItemInput, OrderResult } from "../libs/types/order";
import { OrderInput } from "../libs/types/order";
import OrderItemModel from "../schema/OrderItem.model";
import OrderModel, { OrderDoc } from "../schema/Order.model";
import MemberService from "./Member.service";

export default class OrderService {
  private readonly orderModel;
  private readonly memberService;
  private orderItemModel = OrderItemModel;
  constructor() {
    this.orderModel = OrderModel;
    this.orderItemModel = OrderItemModel;
    this.memberService = new MemberService();
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

    const totalQuantity = orderItems.reduce(
      (sum, item) => sum + item.itemQuantity,
      0
    );

    const delivery = totalAmount < 100 ? 5 : 0;

    const previewItem = {
      name: orderItems[0]?.productName || "Item",
      image: orderItems[0]?.productImage || "",
    };

    const newOrder = await this.orderModel.create({
      memberId,
      totalAmount: totalAmount + delivery,
      totalQuantity,
      paymentMethod,
      orderStatus: "PAID",
      shippingAddress,
      previewItem,
    });

    await this.recordOrderItem(newOrder._id, orderItems);

    const earnedPoints = totalQuantity * 2;
    await this.memberService.addUserPoint(member, earnedPoints); // ✅ Update points

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
  public async getOrdersByMember(memberId: string): Promise<OrderDoc[]> {
    const _memberId = shapeIntoMongooseObjectId(memberId);

    const orders = await this.orderModel
      .find({ memberId: _memberId })
      .sort({ createdAt: -1 })
      .exec();

    // ✅ Return empty array instead of throwing
    return orders;
  }
}
