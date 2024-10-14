import { Model, model, Schema, Document } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

type TUser = {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
};

type TUserModel = Model<TUser> & {
  findUserByCredentials: (
    email: string,
    password: string
  ) => Promise<Document<unknown, unknown, TUser>>;
};

const userSchema = new Schema<TUser, TUserModel>(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: "Жак-Ив Кусто",
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 200,
      default: "Исследователь",
    },
    avatar: {
      type: String,
      validate: {
        validator: (url) => validator.isURL(url),
        message: "Некорректная ссылка на аватар",
      },
      default:
        "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => validator.isEmail(email),
        message: "Некорректный email",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
  },
  { versionKey: false }
);

userSchema.static(
  "findUserByCredentials",
  function findUserByCredentials(email: string, password: string) {
    return this.findOne({ email }).then((user) => {
      if (!user) {
        return Promise.reject(new Error("Неправильные почта или пароль"));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Неправильные почта или пароль"));
        }

        return user;
      });
    });
  }
);

export default model("user", userSchema);
