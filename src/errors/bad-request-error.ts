import { ErrorStatusesEnum } from "../types";

export class BadRequestError extends Error {
  statusCode: ErrorStatusesEnum;

  constructor(message: string) {
    super(message);
    this.statusCode = ErrorStatusesEnum.BAD_REQUEST;
  }
}
