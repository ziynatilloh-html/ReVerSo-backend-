//=== Custom error codes enum ===//
export enum HttpCode {
  OK = 200,
  CREATED = 201,
  NOT_MODIFIED = 304,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

//=== Custom error messages enum ===//
export enum Message {
  EXISTING_MEMBERNICK = "Member exists in the server",
  WRONG_PASSWORD = "Wrong password",
  SOMETHING_WENT_WRONG = "Something went wrong",
  NO_DATA_FOUND = "No data is found!",
  CREATE_FAILED = "Create is failed!",
  UPDATE_FAILED = "Update is failed!",
  NO_MEMBER_FOUND = "No member is registered with this nickname!",
  USED_NICK_PHONE = "This number is already registered!",
  NOT_AUTHENTICATED = "Sorry, but you are not authentificated sign-up first!",
  MISSING_MEMBER_NICK_PHONE_EMAIL = "MISSING_MEMBER_NICK_PHONE_EMAIL",
  INVALID_OR_EXPIRED_TOKEN = "Token has been expired or invalid",
  RESET_LINK_SENT = "✅ Reset link sent to your email!",
  PASSWORD_CHANGED = "✅ Your password has been changed successfully!",
}

//=== Custom error class ===//
class Errors extends Error {
  public code: HttpCode;
  public message: Message;

  static standard = {
    code: HttpCode.INTERNAL_SERVER_ERROR,
    message: Message.SOMETHING_WENT_WRONG,
  };

  constructor(statusCode: HttpCode, statusMessage: Message) {
    super();
    this.code = statusCode;
    this.message = statusMessage;
  }
}

export default Errors;
