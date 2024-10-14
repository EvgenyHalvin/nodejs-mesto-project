import { Router } from "express";

import {
  createUser,
  login,
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
} from "../controllers/users";

const router = Router();

router.post("/signin", login);
router.post("/signup", createUser);
router.get("/", getUsers);
router.get("/:userId", getUser);
router.patch("/me", updateUser);
router.patch("/me/avatar", updateAvatar);

export default router;
