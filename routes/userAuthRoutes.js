import { Router } from "express";
import {
  login,
  register,
  setAvatar,
  getAllUsers,
  requestFriend,
  getFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  getFriends,
  getChats,
  readChat,
} from "../controllers/userController.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/set-avatar/:id", setAvatar);
router.post("/send-friend-request/:id", requestFriend);
router.get("/get-all-users/:id", getAllUsers);
router.get("/get-friend-request/:id", getFriendRequest);
router.post("/accept-friend/:id", acceptFriendRequest);
router.post("/decline-friend/:id", declineFriendRequest);
router.get("/get-friends/:id", getFriends);
router.get("/get-chats/:id", getChats);
router.post("/read-chat/:id", readChat);

export default router;
