import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../errors";
import { TRequest } from "../types";

const USER_NOT_FOUND = "Пользователь по указанному _id не найден";
const INCORRECT_CREATE_USER_DATA =
  "Переданы некорректные данные при создании пользователя";
const INCORRECT_UPDATE_USER_DATA =
  "Переданы некорректные данные при обновлении профиля";
const INCORRECT_UPDATE_USER_AVATAR_DATA =
  "Переданы некорректные данные при обновлении аватара";
const UNAUTHORIZED_ERROR = "Неправильные почта или пароль";
const INCORRECT_USER_DATA =
  "Переданы некорректные данные при попытке получить данные пользователя";

export const getUsers = (_req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => next());
};

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.userId;

  User.findById(userId)
    .orFail(new NotFoundError(USER_NOT_FOUND))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === USER_NOT_FOUND) {
        next(new NotFoundError(USER_NOT_FOUND));
      } else {
        next();
      }
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { password, ...rest } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ ...rest, password: hash }))
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.code === 11000) {
        next(
          new ConflictError("Пользователь с такой почтой уже зарегистрирован")
        );
      } else if (err.name === "ValidationError") {
        next(new BadRequestError(INCORRECT_CREATE_USER_DATA));
      } else {
        next();
      }
    });
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  const userId = (req as TRequest).user._id;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail(new NotFoundError(USER_NOT_FOUND))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(INCORRECT_UPDATE_USER_DATA));
      } else if (err.message === USER_NOT_FOUND) {
        next(new NotFoundError(USER_NOT_FOUND));
      } else {
        next();
      }
    });
};

export const updateAvatar = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { avatar } = req.body;
  const userId = (req as TRequest).user._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .orFail(new NotFoundError(USER_NOT_FOUND))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(INCORRECT_UPDATE_USER_AVATAR_DATA));
      } else if (err.message === USER_NOT_FOUND) {
        next(new NotFoundError(USER_NOT_FOUND));
      } else {
        next();
      }
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { login, password } = req.body;

  User.findUserByCredentials(login, password)
    .then((user) => {
      if (!process.env.JWT_SECRET) {
        throw new Error("Server error");
      }
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      res
        .cookie("jwt", token, {
          maxAge: 3600 * 1000, // 1 час
          httpOnly: true,
        })
        .end();
    })
    .catch((err: Error) => {
      if (err.message === "Server error") {
        next();
      } else {
        next(new UnauthorizedError(UNAUTHORIZED_ERROR));
      }
    });
};

export const getCurrentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = (req as TRequest).user._id;

  User.findById(userId)
    .orFail(new Error(USER_NOT_FOUND))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(INCORRECT_USER_DATA));
      } else {
        next();
      }
    });
};
