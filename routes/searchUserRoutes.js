import { Router } from "express";
import { getUsers } from "../controllers/searchUserController.js";

const router = Router();

router.get("/get-users/:id", getUsers);

export default router;
