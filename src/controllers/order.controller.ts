import { Response } from "express";
import { ExtendedRequest } from "../libs/types/member";

import Errors, { Message, HttpCode } from "../libs/types/Error";
import { T } from "../libs/types/common";
import OrderService from "../service/Order.Service";

const orderService = new OrderService();
const orderController: T = {};

orderController.createOrder = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("createOrder");
    if (!req.member) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        code: HttpCode.UNAUTHORIZED,
        message: Message.NOT_AUTHENTICATED,
      });
    }

    const result = await orderService.createOrder(req.member, req.body);
    return res.status(HttpCode.OK).json(result);
  } catch (err) {
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(HttpCode.INTERNAL_SERVER_ERROR).json(Errors.standard);
    }
  }
};

export default orderController;
