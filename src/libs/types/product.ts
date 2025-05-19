import { ObjectId } from "mongoose";
import {
  ProductCategory,
  ProductGender,
  ProductSize,
  ProductStatus,
  ProductTag,
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
  productTags?: ProductTag[];
  productRating?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductInquiry {
  order: string;
  page: number;
  limit: number;
  productCategory?: ProductCategory;
  search?: string;
  category?: string[]; // new
  size?: string[]; // new
  tag?: string[];
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
  productTags?: ProductTag[];
  productRating?: number;
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
  productTags?: ProductTag[];
  productRating?: number;
}
