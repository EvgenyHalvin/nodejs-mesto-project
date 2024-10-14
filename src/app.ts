import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";

import users from "./routes/users";
import cards from "./routes/cards";

mongoose.connect("mongodb://localhost:27017/mestodb");

const { PORT = 3000 } = process.env;
const app = express();

app.use(helmet());
app.use(express.json());

app.use("/users", users);
app.use("/cards", cards);

app.use("*", (req, res) => {
  res.status(404).send({ message: "Запрашиваемый ресурс не найден" });
});

app.listen(+PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
