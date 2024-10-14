import { Request, Response } from "express";

import Card from "../models/card";
import { ErrorStatusesEnum, TRequest } from "./types";

const SERVER_ERROR = "На сервере произошла ошибка";
const CARD_NOT_FOUND = "Карточка по указанному _id не найдена";
const INCORRECT_CREATE_CARD_DATA =
  "Переданы некорректные данные при создании карточки";
const INCORRECT_LIKE_DATA = "Переданы некорректные данные для постановки лайка";
const INCORRECT_DISLIKE_DATA = "Переданы некорректные данные для снятии лайка";

export const getCards = (_req: Request, res: Response) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() =>
      res.status(ErrorStatusesEnum.SERVER_ERROR).send({ message: SERVER_ERROR })
    );
};

export const createCard = (req: Request, res: Response) => {
  const owner = (req as TRequest).user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ErrorStatusesEnum.BAD_REQUEST).send({
          message: INCORRECT_CREATE_CARD_DATA,
        });
      } else {
        res.status(ErrorStatusesEnum.SERVER_ERROR).send(SERVER_ERROR);
      }
    });
};

export const deleteCard = (req: Request, res: Response) => {
  const { cardId } = req.params;

  Card.findByIdAndDelete(cardId)
    .orFail(new Error(CARD_NOT_FOUND))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === CARD_NOT_FOUND) {
        res.status(ErrorStatusesEnum.NOT_FOUND).send({ message: err.message });
      } else {
        res
          .status(ErrorStatusesEnum.SERVER_ERROR)
          .send({ message: SERVER_ERROR });
      }
    });
};

export const likeCard = (req: Request, res: Response) => {
  const { cardId } = req.params;
  const userId = (req as TRequest).user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true, runValidators: true }
  )
    .orFail(new Error(CARD_NOT_FOUND))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ErrorStatusesEnum.BAD_REQUEST).send({
          message: INCORRECT_LIKE_DATA,
        });
      } else if (err.message === CARD_NOT_FOUND) {
        res.status(ErrorStatusesEnum.NOT_FOUND).send({ message: err.message });
      } else {
        res.status(ErrorStatusesEnum.SERVER_ERROR).send({ message: err });
      }
    });
};

export const dislikeCard = (req: Request, res: Response) => {
  const { cardId } = req.params;
  const userId = (req as TRequest).user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true, runValidators: true }
  )
    .orFail(new Error(CARD_NOT_FOUND))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ErrorStatusesEnum.BAD_REQUEST).send({
          message: INCORRECT_DISLIKE_DATA,
        });
      } else if (err.message === CARD_NOT_FOUND) {
        res.status(ErrorStatusesEnum.NOT_FOUND).send({ message: err.message });
      } else {
        res.status(ErrorStatusesEnum.SERVER_ERROR).send({ message: err });
      }
    });
};
