import { NextFunction, Response, Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { UnauthorizedError } from "../errors";

const AUTHORIZATION_NEEDED = "Необходима авторизация";

export default (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.cookie;

  if (!authorization) {
    next(new UnauthorizedError(AUTHORIZATION_NEEDED));
  }

  const token = authorization?.replace("jwt=", "");

  let payload: JwtPayload | null = null;

  try {
    if (!token) {
      throw new Error("Server error");
    }
    payload = jwt.verify(token, "some-secret-key") as JwtPayload;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    req.user = payload;
    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return next(new UnauthorizedError(AUTHORIZATION_NEEDED));
    }
    next(err);
  }
};
