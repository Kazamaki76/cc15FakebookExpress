const Joi = require("joi");
const checkUserIdScheme = Joi.object({
  userId: Joi.number().integer().positive().required(),
});

exports.checkUserIdScheme = checkUserIdScheme;

const checkReceiverIdScheme = Joi.object({
  receiverId: Joi.number().integer().positive().required(),
});

exports.checkReceiverIdScheme = checkReceiverIdScheme;

const checkRequesterIdSchema = Joi.object({
  requesterId: Joi.number().integer().positive().required(),
});

exports.checkRequesterIdSchema = checkRequesterIdSchema;

const checkFriendIdSchema = Joi.object({
    friendId: Joi.number().integer().positive().required(),
})
exports.checkFriendIdSchema = checkFriendIdSchema