import mongoose, { Schema, Document } from "mongoose";

export interface OrderItemDoc extends Document {
  orderId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  itemPrice: number;
  itemQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<OrderItemDoc>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    itemPrice: { type: Number, required: true },
    itemQuantity: { type: Number, required: true },
  },
  { timestamps: true, collection: "orderItems" }
);

export default mongoose.model<OrderItemDoc>("OrderItem", orderItemSchema);
