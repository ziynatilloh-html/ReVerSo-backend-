import { Request, Response } from "express";
import Errors, { HttpCode, Message } from "../libs/types/Error";
import { AdminRequest, ExtendedRequest } from "../libs/types/member";
import ProductService from "../service/Product.service";
import { ProductInput, ProductInquiry } from "../libs/types/product";
import { T } from "../libs/types/common";
import { ProductCategory } from "../libs/enums/product.enum";

//=====Models=====//
const productService = new ProductService();
const productController: T = {};

//=====Product Controller=====//
//== SPA ==//

productController.getNewArrivals = async (req: Request, res: Response) => {
  try {
    const {
      order = "createdAt",
      page = 1,
      limit = 8,
      search,
      productCategory,
    } = req.query;

    const inquiry: ProductInquiry = {
      order: String(order),
      page: Number(page),
      limit: Number(limit),
    };

    if (search) inquiry.search = String(search);
    if (productCategory)
      inquiry.productCategory = productCategory as ProductCategory;

    const result = await productService.getNewArrivals(inquiry);
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.error("Error, getNewArrivals:", err);
    res.status(Errors.standard.code).json(Errors.standard);
  }
};
productController.getPopularProducts = async (req: Request, res: Response) => {
  try {
    console.log("getPopularProducts");
    const { order = "productViews", page = 1, limit = 8 } = req.query;

    const inquiry: ProductInquiry = {
      order: String(order),
      page: Number(page),
      limit: Number(limit),
    };

    const result = await productService.getPopularProducts(inquiry);
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.error("Error, getPopularProducts:", err);
    res.status(Errors.standard.code).json(Errors.standard);
  }
};
productController.getProductById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await productService.getProductById(id);
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.error("Error, getProductById:", err);
    res.status(Errors.standard.code).json(Errors.standard);
  }
};

productController.getProductList = async (req: Request, res: Response) => {
  try {
    const {
      order = "createdAt",
      page = 1,
      limit = 12,
      search,
      productCategory,
      category,
      size,
      tag,
    } = req.query;

    const inquiry: ProductInquiry = {
      order: String(order),
      page: Number(page),
      limit: Number(limit),
    };

    if (search) inquiry.search = String(search);
    if (productCategory) {
      inquiry.productCategory = productCategory as ProductCategory;
    }

    // ✅ Properly handle filters as array of strings
    if (category) {
      inquiry.category = Array.isArray(category)
        ? category.map(String)
        : String(category).split(",");
    }
    if (size) {
      inquiry.size = Array.isArray(size)
        ? size.map(String)
        : String(size).split(",");
    }
    if (tag) {
      inquiry.tag = Array.isArray(tag)
        ? tag.map(String)
        : String(tag).split(",");
    }
    const { products, total } = await productService.getProductList(inquiry);
    res.status(HttpCode.OK).json({ products, total });
  } catch (err) {
    console.error("Error, getProductList:", err);
    res.status(Errors.standard.code).json(Errors.standard);
  }
};

//=====SSR=====//
productController.getAllProducts = async (req: AdminRequest, res: Response) => {
  try {
    console.log("getAllProducts");
    const data = await productService.getAllProducts();
    res.render("products", { products: data });
  } catch (err) {
    console.log("Error, getAllProducts:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script> alert("${message}"); window.location.replace('/admin/product/all') </script>`
    );
  }
};

productController.createNewProduct = async (
  req: AdminRequest,
  res: Response
) => {
  try {
    console.log("createNewProduct");
    if (!req.files?.length)
      throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILED);

    const data: ProductInput = req.body;
    data.productImages = req.files?.map((ele) => {
      return ele.path;
    });
    await productService.createNewProduct(data);

    res.send(
      `<script> alert("Successful creation!"); window.location.replace('/admin/product/all') </script>`
    );
  } catch (err) {
    console.log("Error, createNewProduct:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script> alert("${message}"); window.location.replace('/admin/product/all') </script>`
    );
  }
};

productController.updateChosenProduct = async (req: Request, res: Response) => {
  try {
    console.log("updateChosenProduct");
    const id = req.params.id;
    const result = await productService.updateChosenProduct(id, req.body);
    res.status(HttpCode.OK).json({ data: result });
  } catch (err) {
    console.log("Error, updateChosenProduct:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script> alert("${message}"); window.location.replace('/admin/product/all') </script>`
    );
  }
};

export default productController;
