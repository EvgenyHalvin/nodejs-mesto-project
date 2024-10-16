import { ErrorStatusesEnum } from "types";

export class ConflictError extends Error {
  statusCode: ErrorStatusesEnum;

  constructor(message: string) {
    super(message);
    this.statusCode = ErrorStatusesEnum.CONFLICT;
  }
}
