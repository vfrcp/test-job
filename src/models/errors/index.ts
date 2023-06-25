import { ICustomError } from "./types";

class CustomError extends Error implements ICustomError {
  isCustomError: true
  httpStatus: number;
  constructor (message: string, httpStatus: number) {
    super(message)
    this.isCustomError = true
    this.httpStatus = httpStatus
  }
  static reqBodyInvalid (message: string) {
    return new CustomError(message, 422)
  }
  static authInvalid (message: string) {
    return new CustomError(message, 401)
  }

  //Databases
  static alreadyExist (message: string) {
    return new CustomError(message, 409)
  }
  static notExist (message: string) {
    return new CustomError(message, 404)
  }
}

export default CustomError