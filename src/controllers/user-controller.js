const fs = require("fs/promises");

const createError = require("../utils/create-error");
const { upload } = require("../utils/cloudinary-service");
const prisma = require("../model/prisma");
const { checkUserIdScheme } = require("../validator/user-validator");
const {
  AUTH_USER,
  UNKNOWN,
  STATUS_ACCEPTED,
  FRIEND,
  REQUESTER,
  RECEIVER,
} = require("../config/constants");

const getTargetUserStatusWithAuthUser = async (targetUserId, authUserId) => {
  if (targetUserId === authUserId) {
    return AUTH_USER;
  }
  const relationship = await prisma.friend.findFirst({
    where: {
      OR: [
        { requesterId: targetUserId, receiverId: authUserId },
        { requesterId: authUserId, receiverId: targetUserId },
      ],
    },
  });
  if (!relationship) {
    return UNKNOWN;
  }
  if (relationship.status === STATUS_ACCEPTED) {
    return FRIEND;
  }
  if (relationship.requesterId === authUserId) {
    return REQUESTER;
  }
  return RECEIVER;
};

const getTargerUserFriends = async (targetUserId) => {
  //  STATUS : ACCEPTED and (REQUESTER_ID = targetUserId or Receiver_ID =targetUserId)
  const relationships = await prisma.friend.findMany({
    where: {
      status: STATUS_ACCEPTED,
      OR: [{ requesterId: targetUserId }, { receiverId: targetUserId }],
    },
    select: {
      requester: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          mobile: true,
          profileImage: true,
          coverImage: true,
        },
      },
      receiver: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          mobile: true,
          profileImage: true,
          coverImage: true,
        },
      },
    },
  });
  console.log(relationships);
  // [{ id, firstName, lastName}]
  const friends = relationships.map((el) =>
    el.requester.id === targetUserId ? el.receiver : el.requester
  );
  return friends;
};

exports.updateProfile = async (req, res, next) => {
  try {
    if (!req.files) {
      return next(createError("profile image or cover image is require"));
    }
    if (req.files.profileImage) {
      const url = await upload(req.files.profileImage[0].path);
      await prisma.user.update({
        data: {
          profileImage: url,
        },
        where: {
          id: req.user.id,
        },
      });
    }

    if (req.files.coverImage) {
      const url = await upload(req.files.coverImage[0].path);
      await prisma.user.data({
        data: {
          profileImage: url,
        },
        where: {
          id: req.user.id,
        },
      });

      console.log(result);
    }
    // req.file   .single
    // req.file   .array  .field
    console.log(req.files);
    res.status(200).json({ message: "correct" });
  } catch (err) {
    next(err);
  } finally {
    if (req.files.profileImage) {
      fs.unlink(req.files.profileImage[0].path);
    }
    if (req.files.coverImage) {
      fs.unlink(req.files.coverImage[0].path);
    }
  }
};

exports.getuserById = async (req, res, next) => {
  try {
    console.log(req.params);
    const { error } = checkUserIdScheme.validate(req.params);
    if (error) {
      return next(error);
    }
    const userId = +req.params.userId;
    const user = await prisma.user.findUnique({
      where: {
        id: +userId,
      },
    });

    let status = null;
    let friends = null;
    if (user) {
      delete user.password;
      status = await getTargetUserStatusWithAuthUser(userId, req.user.id);
      friends = await getTargerUserFriends(userId);
    }

    // below this code is hardcode
    // if (req.user.id === userId) {
    //   status = AUTH_USER;
    // } else {
    //   userId 2
    //   auth user id : req.user.id มาจาก middleware authenticate
    //    find realtionship ของ 2 คนนี้
    //   const relationship = await prisma.friend.findFirst({
    //     where: {
    //       OR: [
    //         { requesterId: userId, receiverId: req.user.id },
    //         { requesterId: req.user.id, receiverId: userId },
    //       ],
    //     },
    //   });
    //   if (!relationship) {
    //     status = UNKNOWN;
    //   } else {
    //     if (relationship.status === STATUS_ACCEPTED) {
    //     } else {
    //       if (relationship.requesterId == userId) {
    //         status = REQUESTER;
    //       } else {
    //         status = RECEIVER;
    //       }
    //     }
    //     status = FRIEND;
    //   }
    // }
    // above this code is hardcode

    res.status(200).json({ user, status, friends });
  } catch (err) {
    next(err);
  }
};
