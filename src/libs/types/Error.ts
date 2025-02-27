// HTTP status codes enum with explanations
export enum HttpCode {
  OK = 200, // The request was successful, and the server returned the expected data.
  CREATED = 201, // The request was successful, and a new resource was created.
  NOT_MODIFIED = 304, // The resource has not been modified since the last request (used for caching).
  BAD_REQUEST = 400, // The request was malformed or invalid (e.g., missing required parameters).
  UNAUTHORIZED = 401, // Authentication is required, or the provided credentials are invalid.
  FORBIDDEN = 403, // The user does not have permission to access the requested resource.
  NOT_FOUND = 404, // The requested resource could not be found on the server.
  INTERNAL_SERVER_ERROR = 500, // A generic error occurred on the server.
}

// Message enum with user-friendly error messages
export enum Message {
  SOMETHING_WENT_WRONG = "Something went wron", // Generic error message for unexpected issues.
  NO_DATA_FOUND = "No data is found!", // Indicates that no data was found for the request.
  CREATE_FAILED = "Create is failed!", // Error message for failed resource creation.
  UPDATE_FAILED = "Update is failed!", // Error message for failed resource update.
}

// Custom error class extending the built-in Error class
class Errors extends Error {
  public code: HttpCode;
  public message: Message;

  constructor(statusCode: HttpCode, statusMessage: Message) {
    super();
    this.code = statusCode;
    this.message = statusMessage;
  }
}

export default Errors;
