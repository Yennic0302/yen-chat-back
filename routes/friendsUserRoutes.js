import { Router } from "express";
import {
  acceptFriendRequest,
  declineFriendRequest,
  getFriendRequest,
  getFriends,
  requestFriend,
} from "../controllers/friendsUserController.js";

const router = Router();

router.get("/get-friends/:id", getFriends);
router.post("/send-friend-request/:id", requestFriend);
router.get("/get-friend-request/:id", getFriendRequest);
router.post("/accept-friend/:id", acceptFriendRequest);
router.post("/decline-friend/:id", declineFriendRequest);

export default router;
