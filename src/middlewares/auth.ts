import { NextFunction, Response, Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { UnauthorizedError } from "../errors";

const AUTHORIZATION_NEEDED = "Необходима авторизация";

export default (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.cookies.jwt;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    next(new UnauthorizedError(AUTHORIZATION_NEEDED));
  }

  const token: string = authorization.replace("Bearer ", "");

  let payload: JwtPayload | null = null;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    req.user = payload;
    next();
  } catch {
    next(new UnauthorizedError(AUTHORIZATION_NEEDED));
  }
};
