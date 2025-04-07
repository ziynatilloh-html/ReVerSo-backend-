import { ProductInput } from "../libs/types/product";
import ProductModel from "../schema/Product.model";
import { HttpCode } from "../libs/types/Error";
import Errors from "../libs/types/Error";
import { Message } from "../libs/types/Error";
import { Product } from "../libs/types/product";

class ProductService {
  private readonly productModel;

  constructor() {
    this.productModel = ProductModel;
  }

  /** SPA */

  /** SSR */

  public async createNewProduct(input: ProductInput): Promise<Product> {
    try {
      console.log("create input:", input);
      return await this.productModel.create(input);
    } catch (err) {
      console.error("Error, model:createNewProduct:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }
}

export default ProductService;
