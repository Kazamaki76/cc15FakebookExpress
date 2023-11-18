const express = require("express");

const authenticateMiddleware = require("../middleware/authenticate");
const friendContoller = require("../controllers/friend-controller");

const router = express.Router();

router.post(
  "/:receiverId",
  authenticateMiddleware,
  friendContoller.requestFriend
);

router.patch(
  "/:requesterId",
  authenticateMiddleware,
  friendContoller.acceptRequest
);

router.delete(
  "/:requesterId/reject",
  authenticateMiddleware,
  friendContoller.rejectRequest
);

router.delete(
  "/:receiverId/cancel",
  authenticateMiddleware,
  friendContoller.cancelRequest
);

router.delete(
  "/:friendId/unfriend",
  authenticateMiddleware,
  friendContoller.unfriend
);

module.exports = router;
