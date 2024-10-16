import { Secret } from "jsonwebtoken";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET: Secret;
    }
  }
}

export {};
