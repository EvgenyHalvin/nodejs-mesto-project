import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import { ErrorStatusesEnum } from "../types";

const AUTHORIZATION_NEEDED = "Необходима авторизация";

export const authMiddleWare = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.cookies.jwt;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(ErrorStatusesEnum.UNAUTHORIZED)
      .send({ message: AUTHORIZATION_NEEDED });
  }
  const token: string = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res
      .status(ErrorStatusesEnum.UNAUTHORIZED)
      .send({ message: AUTHORIZATION_NEEDED });
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  req.user = payload;

  next();
};
