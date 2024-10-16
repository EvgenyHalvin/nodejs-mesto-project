import { NextFunction, Request, Response } from "express";

import Card from "../models/card";
import { BadRequestError, ForbiddenError, NotFoundError } from "../errors";

const CARD_NOT_FOUND = "Карточка по указанному _id не найдена";
const INCORRECT_CREATE_CARD_DATA =
  "Переданы некорректные данные при создании карточки";
const INCORRECT_LIKE_DATA = "Переданы некорректные данные для постановки лайка";
const INCORRECT_DISLIKE_DATA = "Переданы некорректные данные для снятии лайка";
const FORBIDDEN_ERROR = "Вы не можете удалить чужую карточку";

export const getCards = (_req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => next());
};

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(INCORRECT_CREATE_CARD_DATA));
      } else {
        next();
      }
    });
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const currentUserId = req.user._id;

  Card.findById(cardId)
    .orFail(new Error(CARD_NOT_FOUND))
    .then((card) => {
      const isOwner = String(card.owner) === currentUserId;
      if (!isOwner) {
        next(new ForbiddenError(FORBIDDEN_ERROR));
      } else {
        Card.findByIdAndDelete(cardId)
          .orFail(new NotFoundError(CARD_NOT_FOUND))
          .then((user) => res.send({ data: user }))
          .catch((err) => {
            if (err.message === CARD_NOT_FOUND) {
              next(new NotFoundError(CARD_NOT_FOUND));
            } else {
              next();
            }
          });
      }
    });
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true, runValidators: true }
  )
    .orFail(new NotFoundError(CARD_NOT_FOUND))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError(INCORRECT_LIKE_DATA));
      } else if (err.message === CARD_NOT_FOUND) {
        next(new NotFoundError(CARD_NOT_FOUND));
      } else {
        next();
      }
    });
};

export const dislikeCard = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true, runValidators: true }
  )
    .orFail(new NotFoundError(CARD_NOT_FOUND))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError(INCORRECT_DISLIKE_DATA));
      } else if (err.message === CARD_NOT_FOUND) {
        next(new NotFoundError(CARD_NOT_FOUND));
      } else {
        next();
      }
    });
};
