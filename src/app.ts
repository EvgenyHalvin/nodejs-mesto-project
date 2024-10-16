import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import { celebrate, Joi } from "celebrate";

import users from "./routes/users";
import cards from "./routes/cards";

import { createUser, login } from "./controllers/users";

import auth from "./middlewares/auth";
import { requestLogger, errorLogger } from "./middlewares/logger";
import { errorHandler } from "./middlewares/error-handler";

import { NotFoundError } from "./errors";
import { linkRegExp } from "./utils/regex";

mongoose.connect("mongodb://localhost:27017/mestodb");

const { PORT = 3000 } = process.env;
const app = express();

app.use(helmet());
app.use(express.json());

app.use(requestLogger);

app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser
);
app.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().min(2),
      about: Joi.string().min(2),
      avatar: Joi.string().pattern(linkRegExp),
    }),
  }),
  login
);

app.use(auth);

// Роуты, не требующие авторизации
app.use("/users", users);
app.use("/cards", cards);

app.use("*", (req, res, next) => {
  next(new NotFoundError("Запрашиваемый ресурс не найден"));
});

app.use(errorLogger);

app.use(errorHandler);

app.listen(+PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
