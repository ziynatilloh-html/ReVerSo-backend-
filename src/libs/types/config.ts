export const MORGAN_FORMAT = `:method :url - :response-time [:status] ms \n`;

import mongoose from "mongoose";
export const shapeIntoMongooseObjectId = (target: any) => {
  return typeof target === "string"
    ? new mongoose.Types.ObjectId(target)
    : target;
};

export const AUTH_TIMER = 24;
