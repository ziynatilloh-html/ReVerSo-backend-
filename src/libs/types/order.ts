import { Types } from "mongoose";
import { OrderStatus, PaymentMethod } from "../enums/order.enum";

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface OrderItemInput {
  productId: Types.ObjectId | string;
  itemPrice: number;
  itemQuantity: number;
  productName: string;
  productImage: string;
}

export interface OrderInput {
  orderItems: OrderItemInput[];
  paymentMethod: PaymentMethod;
  shippingAddress: ShippingAddress;
}

export interface OrderResult {
  _id: Types.ObjectId;
  memberId: Types.ObjectId;
  orderTotal: number;
  orderDelivery: number;
  createdAt: Date;
  updatedAt: Date;
}
