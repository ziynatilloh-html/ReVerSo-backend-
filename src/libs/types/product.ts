import { ObjectId } from "mongoose";
import {
  ProductCategory,
  ProductGender,
  ProductSize,
  ProductStatus,
} from "../enums/product.enum";

export interface Product {
  _id: ObjectId;
  productStatus: ProductStatus;
  productCategory: ProductCategory;
  productName: string;
  productGender: ProductGender;
  productPrice: number;
  productLeftCount: number;
  productSize: ProductSize;
  productDesc?: string;
  productImages: string[];
  productViews: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface ProductInput {
  productStatus?: ProductStatus;
  productCategory: ProductCategory;
  productName: string;
  productGender: ProductGender;
  productPrice: number;
  productLeftCount: number;
  productSize?: ProductSize;
  productDesc?: string;
  productImages?: string[];
  productViews?: number;
}
export interface ProductUpdateInput {
  _id: ObjectId;
  productStatus?: ProductStatus;
  productCategory: ProductCategory;
  productName?: string;
  productGender: ProductGender;
  productPrice?: number;
  productLeftCount?: number;
  productSize?: ProductSize;
  productVolume?: number;
  productDesc?: string;
  productImages?: string[];
  productViews?: number;
}
