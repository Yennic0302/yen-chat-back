import User from "../models/userModel.js";
import bcrypt from "bcrypt";

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already use", status: false });

    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "email already use", status: false });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const userResponse = {
      _id: user._id,
      username: user.username,
      avatarImage: user.avatarImage,
      email: user.avatarImage,
      isAvatarImageSet: user.isAvatarImageSet,
    };

    return res.json({ status: true, user: userResponse });
  } catch (e) {
    next(e);
  }
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user)
      return res.json({
        msg: "Incorrect username or password",
        status: false,
      });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.json({
        msg: "Incorrect username or password",
        status: false,
      });

    const userResponse = {
      _id: user._id,
      username: user.username,
      avatarImage: user.avatarImage,
      email: user.email,
      isAvatarImageSet: user.isAvatarImageSet,
    };

    return res.json({
      status: true,
      msg: "log in succesfull",
      user: userResponse,
    });
  } catch (e) {
    next(e);
  }
};

export const setAvatar = async (req, res, next) => {
  try {
    let _id = req.params.id;
    const user = await User.findByIdAndUpdate(
      { _id },
      { isAvatarImageSet: true, avatarImage: req.body.image }
    );
    if (user) {
      return res.json({
        isSet: true,
        image: req.body.image,
      });
    }
  } catch (e) {
    next(e);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    let _id = req.params.id;
    let { search } = req.query;

    const userVerifyInRequest = await User.find({ _id });

    const users = await User.find({ _id: { $ne: _id } }).select([
      "email",
      "username",
      "avatarImage",
      "friendRequestsFrom",
      "friends",
      "_id",
    ]);

    let resultSearch = users.filter(
      (user) => user.username.toLowerCase().indexOf(search.toLowerCase()) > -1
    );

    let resultSearchVerifyFriend = resultSearch.map((user) => {
      const userRequestFriend = userVerifyInRequest[0].friendRequestsFrom.find(
        (userTo) => userTo._id == user._id
      );

      if (userRequestFriend) {
        return {
          friendStatus: "REQUEST-RECIVED",
          user,
        };
      }
      const requestFriend = user.friendRequestsFrom.find(
        (userTo) => userTo._id == _id
      );

      if (requestFriend)
        return {
          friendStatus: "REQUEST-SEND",
          user,
        };

      const friend = user.friends.find((userTo) => userTo._id == _id);

      if (friend)
        return {
          friendStatus: "FRIEND",
          user,
        };

      return {
        friendStatus: "NONE",
        user,
      };
    });

    return res.json(resultSearchVerifyFriend);
  } catch (e) {
    next(e);
  }
};

export const requestFriend = async (req, res, next) => {
  try {
    let idToFriendRequest = req.params.id;
    let { _id, username, avatarImage, email } = req.body;

    const userTo = await User.findOne({ _id: idToFriendRequest }).select([
      "email",
      "username",
      "avatarImage",
      "friendRequestsFrom",
      "friends",
      "_id",
    ]);

    let dataOfUserTo = {
      _id: userTo._id.toString(),
      username: userTo.username,
      avatarImage: userTo.avatarImage,
      email: userTo.email,
    };

    const validFriendInUser = userTo.friends.find((user) => user._id === _id);

    if (validFriendInUser)
      return res.json({
        error: true,
        msg: "friend",
      });

    const validRequestInUser = userTo.friendRequestsFrom.find(
      (user) => user._id === _id
    );

    if (validRequestInUser === undefined) {
      const userFromSend = await User.findByIdAndUpdate(
        { _id },
        {
          $push: {
            requestsTo: dataOfUserTo,
          },
        }
      );

      const userToSend = await User.findByIdAndUpdate(
        { _id: idToFriendRequest },
        {
          $push: {
            friendRequestsFrom: { _id, username, avatarImage, email },
          },
        }
      );
      if (userToSend && userFromSend) {
        return res.json({
          error: false,
          msg: "request send",
        });
      }
    } else {
      return res.json({
        error: true,
        msg: "you do was send request",
      });
    }
  } catch (e) {
    next(e);
  }
};

export const getFriendRequest = async (req, res, next) => {
  try {
    const _id = req.params.id;

    const user = await User.findOne({ _id });
    if (user) {
      res.json(user.friendRequestsFrom);
    }
  } catch (e) {
    next(e);
  }
};

export const acceptFriendRequest = async (req, res, next) => {
  try {
    const _id = await req.params.id;
    const data = req.body;

    const userDataToFriend = {
      email: data.email,
      username: data.username,
      avatarImage: data.avatarImage,
      _id: data._id,
    };

    const userToFriend = await User.findOne({ _id }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);

    const userFromUpdateFriend = await User.findByIdAndUpdate(
      { _id: data._id },
      {
        $push: {
          friends: userToFriend,
        },
        $pull: {
          requestsTo: { _id: _id },
        },
      }
    );

    const userToUpdateFriend = await User.findByIdAndUpdate(
      { _id },
      {
        $push: {
          friends: userDataToFriend,
        },
        $pull: {
          friendRequestsFrom: { _id: data._id },
        },
      }
    );

    if (userToUpdateFriend && userFromUpdateFriend) {
      res.json({
        error: false,
        msg: "add friend",
      });
    } else {
      res.json({
        error: true,
        msg: "error adding friend",
      });
    }
  } catch (e) {
    next(e);
  }
};

export const declineFriendRequest = async (req, res, next) => {
  try {
    const _id = await req.params.id;
    const idToDeclineRequest = req.body._id;
    const idTo = req.body.idTo;

    console.log(idTo);

    const userFromDeclineFriend = await User.findByIdAndUpdate(
      { _id: idToDeclineRequest },
      {
        $pull: {
          requestsTo: { _id: idTo },
        },
      }
    );

    const userToDeclineFriend = await User.findByIdAndUpdate(
      { _id },
      {
        $pull: {
          friendRequestsFrom: { _id: idToDeclineRequest },
        },
      }
    );

    if (userToDeclineFriend && userFromDeclineFriend) {
      res.json({
        error: false,
        msg: "decline friend",
      });
    } else {
      res.json({
        error: true,
        msg: "error declining friend",
      });
    }
  } catch (e) {
    next(e);
  }
};

export const getFriends = async (req, res, next) => {
  try {
    const _id = req.params.id;

    const getFriends = await User.findOne({ _id });

    if (getFriends) {
      res.json({
        error: false,
        friends: getFriends.friends,
      });
    } else {
      res.json({
        error: true,
        msg: "error in find friends",
      });
    }
  } catch (e) {
    next(e);
  }
};

export const getChats = async (req, res, next) => {
  try {
    const _id = req.params.id;

    const user = await User.findOne({ _id }).select(["chats"]);

    if (user) res.json(user.chats.reverse());
  } catch (e) {
    next(e);
  }
};

export const readChat = async (req, res, next) => {
  try {
    const _id = req.params.id;

    const user = await User.findOne({ _id: req.body.data._id });

    const userToDeleteChat = await User.findByIdAndUpdate(
      { _id },
      {
        $pull: {
          chats: {
            _id: user._id,
          },
        },
      }
    );

    const userToUpdateChat = await User.findByIdAndUpdate(
      { _id },
      {
        $push: {
          chats: {
            _id: user._id,
            username: user.username,
            avatarImage: user.avatarImage,
            email: user.email,
            lastMessage: req.body.lastMessage || req.body.data.lastMessage,
            isRead: true,
          },
        },
      }
    );

    if (userToDeleteChat && userToUpdateChat) {
      res.json({
        error: false,
        msg: "update chat succefull",
      });
    }
  } catch (e) {
    next(e);
  }
};
