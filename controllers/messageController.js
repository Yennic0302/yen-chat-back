import messageModel from "../models/messageModel.js";
import User from "../models/userModel.js";

export const addMessages = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = messageModel.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data)
      return res.json({ status: true, msg: "Message added succefully" });

    return res.json({
      status: false,
      msg: "Failed to add message to the database",
    });
  } catch (e) {
    next(e);
  }
};

export const getAllMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const messages = await messageModel
      .find({ users: { $all: [from, to] } })
      .sort({ updateAt: 1 });

    const projectMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });

    if (messages) {
      res.json({
        status: true,
        messages: projectMessages,
        msg: "messages findedd",
      });
    } else {
      res.json({ status: false, msg: "filed finding messages" });
    }
  } catch (e) {
    next(e);
  }
};
