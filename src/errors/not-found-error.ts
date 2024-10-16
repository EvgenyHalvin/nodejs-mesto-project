import { ErrorStatusesEnum } from "../types";

export class NotFoundError extends Error {
  statusCode: ErrorStatusesEnum;

  constructor(message: string) {
    super(message);
    this.statusCode = ErrorStatusesEnum.NOT_FOUND;
  }
}
