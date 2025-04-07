import mongoose, { Schema } from "mongoose";
import {
  ProductCategory,
  ProductGender,
  ProductSize,
  ProductStatus,
} from "../libs/enums/product.enum";
const productSchema = new Schema(
  {
    productStatus: {
      type: String,
      enum: ProductStatus,
      default: ProductStatus.PAUSE,
    },
    productCategory: {
      type: String,
      enum: ProductCategory,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    productGender: {
      type: String,
      enum: ProductGender,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    productLeftCount: {
      type: Number,
      required: true,
    },
    productSize: {
      type: String,
      enum: ProductSize,
      default: ProductSize.M,
    },

    productDesc: {
      type: String,
    },
    productImages: {
      type: [String],
      default: [],
    },
    productView: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true } // updatedAt, createdAt
);
productSchema.index(
  { productName: 1, productSize: 1, productGender: 1 },
  { unique: true }
);

export default mongoose.model("Product", productSchema);
