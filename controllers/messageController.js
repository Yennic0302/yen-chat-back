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

    const userFrom = await User.findOne({ _id: from });
    const userTo = await User.findOne({ _id: to });

    const validChatUserFrom = userFrom.chats.find(
      (chat) => chat._id.toString() === to.toString()
    );
    const validChatUserTo = userTo.chats.find(
      (chat) => chat._id.toString() === from.toString()
    );

    if (validChatUserFrom === undefined) {
      const userFromUpdateChat = await User.findByIdAndUpdate(
        { _id: from },
        {
          $push: {
            chats: {
              _id: userTo._id,
              username: userTo.username,
              avatarImage: userTo.avatarImage,
              email: userTo.email,
              lastMessage: message,
              isRead: true,
            },
          },
        }
      );
    } else {
      const userFromDeleteChat = await User.findByIdAndUpdate(
        { _id: from },
        {
          $pull: {
            chats: {
              _id: userTo._id,
            },
          },
        }
      );
      const userFromUpdateChat = await User.findByIdAndUpdate(
        { _id: from },
        {
          $push: {
            chats: {
              _id: userTo._id,
              username: userTo.username,
              avatarImage: userTo.avatarImage,
              email: userTo.email,
              lastMessage: message,
              isRead: true,
            },
          },
        }
      );
    }
    if (validChatUserTo === undefined) {
      const userToUpdateChat = await User.findByIdAndUpdate(
        { _id: to },
        {
          $push: {
            chats: {
              _id: userFrom._id,
              username: userFrom.username,
              avatarImage: userFrom.avatarImage,
              email: userFrom.email,
              lastMessage: message,
              isRead: false,
            },
          },
        }
      );
    } else {
      const userToDeleteChat = await User.findByIdAndUpdate(
        { _id: to },
        {
          $pull: {
            chats: {
              _id: userFrom._id,
            },
          },
        }
      );

      const userToUpdateChat = await User.findByIdAndUpdate(
        { _id: to },
        {
          $push: {
            chats: {
              _id: userFrom._id,
              username: userFrom.username,
              avatarImage: userFrom.avatarImage,
              email: userFrom.email,
              lastMessage: message,
              isRead: false,
            },
          },
        }
      );
    }

    if (data) return res.json({ msg: "Message added succefully" });

    return res.json({ msg: "Failed to add message to the database" });
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

    res.json(projectMessages);
  } catch (e) {
    next(e);
  }
};
