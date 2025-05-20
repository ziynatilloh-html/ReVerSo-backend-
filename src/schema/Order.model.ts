import mongoose, { Schema, Document } from "mongoose";
import { OrderStatus, PaymentMethod } from "../libs/enums/order.enum";

interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface OrderDoc extends Document {
  memberId: mongoose.Types.ObjectId;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  orderStatus: OrderStatus;
  shippingAddress: ShippingAddress;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<OrderDoc>(
  {
    memberId: { type: Schema.Types.ObjectId, ref: "Member", required: true },
    totalAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },
    orderStatus: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
  },
  { timestamps: true, collection: "orders" }
);

export default mongoose.model<OrderDoc>("Order", orderSchema);
