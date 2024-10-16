import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";

import users from "./routes/users";
import cards from "./routes/cards";

import { createUser, login } from "./controllers/users";

import auth from "./middlewares/auth";
import { requestLogger, errorLogger } from "./middlewares/logger";
import { errorHandler } from "./middlewares/error-handler";

mongoose.connect("mongodb://localhost:27017/mestodb");

const { PORT = 3000 } = process.env;
const app = express();

app.use(helmet());
app.use(express.json());

app.use(requestLogger);

app.post("/signup", createUser);
app.post("/signin", login);

app.use(auth);

app.use("/users", users);
app.use("/cards", cards);

app.use("*", (req, res) => {
  res.status(404).send({ message: "Запрашиваемый ресурс не найден" });
});

app.use(errorLogger);

app.use(errorHandler);

app.listen(+PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
