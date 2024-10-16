import winston from "winston";
import expressWinston from "express-winston";
import "winston-daily-rotate-file";

const fileFormat = winston.format.combine(
  winston.format.prettyPrint({ colorize: false }),
  winston.format.json()
);

// Логгер запросов
export const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.DailyRotateFile({
      filename: "logs/request-%DATE%.json",
      datePattern: "DD-MM-YYYY",
      maxFiles: 5,
      maxSize: 100,
      format: fileFormat,
    }),
  ],
});

// Логгер ошибок
export const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.DailyRotateFile({
      filename: "logs/error-%DATE%.json",
      datePattern: "DD-MM-YYYY",
      maxFiles: 5,
      maxSize: 100,
      format: fileFormat,
    }),
  ],
});
