import { Request } from "express";

export enum ErrorStatusesEnum {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  SERVER_ERROR = 500,
}

export type TCustomError = Error & { statusCode?: ErrorStatusesEnum };

export type TRequest = Request & { user: { _id: string } };
