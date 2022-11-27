import express from "express";
import {
  addMessages,
  getAllMessages,
} from "../controllers/messageController.js";
const router = express.Router();

router.post("/get-all-messages", getAllMessages);
router.post("/add-messages", addMessages);

export default router;
