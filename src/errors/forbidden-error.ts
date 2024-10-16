import { ErrorStatusesEnum } from "../types";

export class ForbiddenError extends Error {
  statusCode: ErrorStatusesEnum;

  constructor(message: string) {
    super(message);
    this.statusCode = ErrorStatusesEnum.FORBIDDEN;
  }
}
