import { HttpCode } from "../libs/types/Error";
import { Member } from "../libs/types/member";
import jwt from "jsonwebtoken";
import { Message } from "../libs/types/Error";
import Errors from "../libs/types/Error";
import { AUTH_TIMER } from "../libs/types/config";

class AuthService {
  constructor() {}
  public async createToken(payload: Member) {
    return new Promise((resolve, reject) => {
      const duration = `${AUTH_TIMER}h`;
      jwt.sign(
        payload,
        process.env.SECRET_TOKEN as string,
        {
          expiresIn: duration,
        },
        (err, token) => {
          if (err)
            reject(
              new Errors(HttpCode.UNAUTHORIZED, Message.TOKEN_CREATION_FAILED)
            );
          else resolve(token as string);
        }
      );
    });
  }
}
export default AuthService;
