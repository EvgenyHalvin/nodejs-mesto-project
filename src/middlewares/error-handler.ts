import { Request, Response } from "express";

import { TCustomError } from "../types";

const SERVER_ERROR = "На сервере произошла ошибка";

export const errorHandler = (
  err: TCustomError,
  req: Request,
  res: Response
) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? SERVER_ERROR : message,
  });
};
