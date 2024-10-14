import { Request } from "express";

// Временный тип из-за хардкода id
export type TRequest = Request & { user: { _id: string } };

export enum ErrorStatusesEnum {
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
}
