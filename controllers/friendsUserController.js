import User from "../models/userModel.js";

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
          status: true,
          msg: "request send",
        });
      }
    } else {
      return res.json({
        status: false,
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
      res.json({
        status: true,
        requestFriends: user.friendRequestsFrom,
      });
    } else {
      res.json({
        status: false,
        msg: "error in finding request friends",
      });
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
        status: true,
        msg: "add friend",
        userToFriend,
      });
    } else {
      res.json({
        status: false,
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
        status: true,
        msg: "decline friend",
      });
    } else {
      res.json({
        status: false,
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
        status: true,
        friends: getFriends.friends,
      });
    } else {
      res.json({
        status: false,
        msg: "error in find friends",
      });
    }
  } catch (e) {
    next(e);
  }
};
