import { Request, Response } from "express";
import { T } from "../libs/types/common";
import Errors from "../libs/types/Error";
import ProductsService from "../service/Products.service";
import { AdminRequest } from "../libs/types/member";

const productsService = new ProductsService();
const productsController: T = {};

productsController.getAllProducts = async (
  req: AdminRequest,
  res: Response
) => {
  try {
    console.log("getAllProducts");
    console.log("req.memeber", req.member);

    res.render("products");
  } catch (err) {
    console.log("Error, getAllProducts:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

productsController.createNewProduct = async (req: Request, res: Response) => {
  try {
    console.log("createNewProduct");
    res.send("Uploaded🐳");
  } catch (err) {
    console.log("Error, createNewProduct:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

productsController.updateChosenProduct = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("getAllProducts");
  } catch (err) {
    console.log("Error, getAllProducts:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export default productsController;
