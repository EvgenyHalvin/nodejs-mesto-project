import { Request, Response } from "express";

import User from "../models/user";
import { ErrorStatusesEnum, TRequest } from "./types";

const SERVER_ERROR = "На сервере произошла ошибка";
const USER_NOT_FOUND = "Пользователь по указанному _id не найден";
const INCORRECT_CREATE_USER_DATA =
  "Переданы некорректные данные при создании пользователя";
const INCORRECT_UPDATE_USER_DATA =
  "Переданы некорректные данные при обновлении профиля";
const INCORRECT_UPDATE_USER_AVATAR_DATA =
  "Переданы некорректные данные при обновлении аватара";

export const getUsers = (_req: Request, res: Response) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() =>
      res.status(ErrorStatusesEnum.SERVER_ERROR).send({ message: SERVER_ERROR })
    );
};

export const getUser = (req: Request, res: Response) => {
  const userId = req.params.userId;

  User.findById(userId)
    .orFail(new Error(USER_NOT_FOUND))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === USER_NOT_FOUND) {
        res.status(ErrorStatusesEnum.NOT_FOUND).send({ message: err.message });
      } else {
        res
          .status(ErrorStatusesEnum.SERVER_ERROR)
          .send({ message: SERVER_ERROR });
      }
    });
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ErrorStatusesEnum.BAD_REQUEST).send({
          message: INCORRECT_CREATE_USER_DATA,
        });
      } else {
        res.status(ErrorStatusesEnum.SERVER_ERROR).send(SERVER_ERROR);
      }
    });
};

export const updateUser = (req: Request, res: Response) => {
  const { name, about } = req.body;
  const userId = (req as TRequest).user._id;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail(new Error(USER_NOT_FOUND))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ErrorStatusesEnum.BAD_REQUEST).send({
          message: INCORRECT_UPDATE_USER_DATA,
        });
      } else if (err.message === USER_NOT_FOUND) {
        res.status(ErrorStatusesEnum.NOT_FOUND).send({ message: err.message });
      } else {
        res
          .status(ErrorStatusesEnum.SERVER_ERROR)
          .send({ message: SERVER_ERROR });
      }
    });
};

export const updateAvatar = (req: Request, res: Response) => {
  const { avatar } = req.body;
  const userId = (req as TRequest).user._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .orFail(new Error(USER_NOT_FOUND))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ErrorStatusesEnum.BAD_REQUEST).send({
          message: INCORRECT_UPDATE_USER_AVATAR_DATA,
        });
      } else if (err.message === USER_NOT_FOUND) {
        res.status(ErrorStatusesEnum.NOT_FOUND).send({ message: err.message });
      } else {
        res
          .status(ErrorStatusesEnum.SERVER_ERROR)
          .send({ message: SERVER_ERROR });
      }
    });
};
