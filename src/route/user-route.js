const express = require("express");

const userController = require("../controllers/user-controller");
const authenticateMiddleware = require("../middleware/authenticate");
const uploadMiddleware = require("../middleware/upload");

const router = express.Router();

router.patch(
  "/",
  authenticateMiddleware,
  uploadMiddleware.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  userController.updateProfile
);
router.get('/:userId',authenticateMiddleware, userController.getuserById)


module.exports = router;
