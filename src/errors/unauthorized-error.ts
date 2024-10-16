import { ErrorStatusesEnum } from "../types";

export class UnauthorizedError extends Error {
  statusCode: ErrorStatusesEnum;

  constructor(message: string) {
    super(message);
    this.statusCode = ErrorStatusesEnum.UNAUTHORIZED;
  }
}
