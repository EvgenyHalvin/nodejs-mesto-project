import { Router } from "express";
import { Joi, celebrate } from "celebrate";

import {
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
  getCurrentUser,
} from "../controllers/users";
import { linkRegExp } from "../utils/regex";

const router = Router();

router.get("/", getUsers);
router.get("/me", getCurrentUser);
router.get(
  "/:userId",
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().length(24).hex(),
    }),
  }),
  getUser
);
router.patch(
  "/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2),
      about: Joi.string().required().min(2),
    }),
  }),
  updateUser
);
router.patch(
  "/me/avatar",
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().pattern(linkRegExp),
    }),
  }),
  updateAvatar
);

export default router;
