import { Router } from "express";
import { celebrate, Joi } from "celebrate";

import {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} from "../controllers/cards";
import { linkRegExp } from "../utils/regex";

const router = Router();

router.get("/", getCards);
router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2),
      link: Joi.string().required().pattern(linkRegExp),
    }),
  }),
  createCard
);
router.delete(
  "/:cardId",
  celebrate({
    body: Joi.object().keys({
      cardId: Joi.string().length(24).hex(),
    }),
  }),
  deleteCard
);
router.put(
  "/:cardId/likes",
  celebrate({
    body: Joi.object().keys({
      cardId: Joi.string().length(24).hex(),
    }),
  }),
  likeCard
);
router.delete(
  "/:cardId/likes",
  celebrate({
    body: Joi.object().keys({
      cardId: Joi.string().length(24).hex(),
    }),
  }),
  dislikeCard
);

export default router;
