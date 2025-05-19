import {
  ProductInput,
  ProductInquiry,
  ProductUpdateInput,
} from "../libs/types/product";
import ProductModel from "../schema/Product.model";
import { HttpCode } from "../libs/types/Error";
import Errors from "../libs/types/Error";
import { Message } from "../libs/types/Error";
import { Product } from "../libs/types/product";
import { shapeIntoMongooseObjectId } from "../libs/types/config";
import { ProductStatus } from "../libs/enums/product.enum";
import { T } from "../libs/types/common";
import { ObjectId } from "mongoose";
import { ViewInput } from "../libs/types/view";
import { ViewGroup } from "../libs/enums/view.enum";
import ViewService from "./View.Service";

//=====Product Service=====//
class ProductService {
  private readonly productModel;
  public viewService;
  constructor() {
    this.productModel = ProductModel;
    this.viewService = new ViewService();
  }

  /** SPA */
  public async getNewArrivals(inquiry: ProductInquiry): Promise<Product[]> {
    const match: T = { productStatus: ProductStatus.PROCESS };

    if (inquiry.productCategory) {
      match.productCategory = inquiry.productCategory;
    }

    if (inquiry.search) {
      match.productName = { $regex: new RegExp(inquiry.search, "i") };
    }

    const sort: T =
      inquiry.order === "productPrice"
        ? { [inquiry.order]: 1 }
        : { [inquiry.order ?? "createdAt"]: -1 };

    const result = await this.productModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        { $skip: (inquiry.page - 1) * inquiry.limit },
        { $limit: inquiry.limit },
      ])
      .exec();

    if (!result || result.length === 0) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }

    return result;
  }
  public async getPopularProducts(inquiry: ProductInquiry): Promise<Product[]> {
    try {
      const result = await this.productModel
        .aggregate([
          { $match: { productStatus: ProductStatus.PROCESS } },
          { $sort: { productViews: -1 } },
          { $skip: (inquiry.page - 1) * inquiry.limit },
          { $limit: inquiry.limit },
        ])
        .exec();

      if (!result || result.length === 0)
        throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

      return result;
    } catch (err) {
      console.error("Error, getPopularProducts:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.SOMETHING_WENT_WRONG);
    }
  }
  public async getProductById(id: string): Promise<Product> {
    const _id = shapeIntoMongooseObjectId(id);
    const product = await this.productModel.findById(_id).exec();
    if (!product) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }
    return product;
  }
  public async getProductList(
    inquiry: ProductInquiry
  ): Promise<{ products: Product[]; total: number }> {
    const match: T = { productStatus: ProductStatus.PROCESS };

    // === Filtering ===
    if (inquiry.productCategory) {
      match.productCategory = inquiry.productCategory;
    }

    if (inquiry.search) {
      match.productName = { $regex: new RegExp(inquiry.search, "i") };
    }

    if (inquiry.category?.length) {
      match.productCategory = { $in: inquiry.category };
    }

    if (inquiry.size?.length) {
      match.productSize = { $in: inquiry.size };
    }

    if (inquiry.tag?.length) {
      match.productTags = { $in: inquiry.tag };
    }

    // === Sorting ===
    const sort: T = (() => {
      switch (inquiry.order) {
        case "productPrice":
          return { productPrice: 1 }; // Low to High
        case "productPriceDesc":
          return { productPrice: -1 }; // High to Low
        case "productViews":
          return { productViews: -1 }; // Most Viewed
        case "createdAt":
        default:
          return { createdAt: -1 }; // Newest first
      }
    })();

    // === Query execution ===
    const [products, total] = await Promise.all([
      this.productModel
        .aggregate([
          { $match: match },
          { $sort: sort },
          { $skip: (inquiry.page - 1) * inquiry.limit },
          { $limit: inquiry.limit },
        ])
        .exec(),
      this.productModel.countDocuments(match),
    ]);

    return { products, total };
  }

  //====SSR=====//
  public async getAllProducts(): Promise<Product[]> {
    const result = await this.productModel.find().exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }
  public async createNewProduct(input: ProductInput): Promise<Product> {
    try {
      return await this.productModel.create(input);
    } catch (err) {
      console.error("Error, model:createNewProduct:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }
  public async updateChosenProduct(
    id: string,
    input: ProductUpdateInput
  ): Promise<Product> {
    id = shapeIntoMongooseObjectId(id);
    const result = await this.productModel
      .findOneAndUpdate({ _id: id }, input, { new: true })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
    return result;
  }
}

export default ProductService;
