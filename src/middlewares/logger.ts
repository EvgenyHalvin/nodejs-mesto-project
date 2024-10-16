import winston from "winston";
import expressWinston from "express-winston";
import "winston-daily-rotate-file";

export const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.DailyRotateFile({
      filename: "logs/request.log",
      datePattern: "YYYY-MM-DD-HH",
      maxFiles: 14,
    }),
  ],
  format: winston.format.json(),
});

export const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.DailyRotateFile({
      filename: "logs/error.log",
      datePattern: "YYYY-MM-DD-HH",
      maxFiles: 14,
    }),
  ],
  format: winston.format.json(),
});
