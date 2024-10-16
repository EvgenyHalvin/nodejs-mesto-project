import winston from "winston";
import expressWinston from "express-winston";
import "winston-daily-rotate-file";

export const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.DailyRotateFile({
      filename: "request.log",
      datePattern: "YYYY-MM-DD-HH",
      maxFiles: 14,
    }),
  ],
  format: winston.format.json(),
});

export const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.DailyRotateFile({
      filename: "error.log",
      datePattern: "YYYY-MM-DD-HH",
      maxFiles: 14,
    }),
  ],
  format: winston.format.json(),
});
