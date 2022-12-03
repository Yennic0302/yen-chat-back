import User from "../models/userModel.js";

export const getUsers = async (req, res, next) => {
  try {
    let _id = req.params.id;
    let { search } = req.query;

    const userVerifyInRequest = await User.findOne({ _id });

    const users = await User.find({ _id: { $ne: _id } }).select([
      "email",
      "username",
      "avatarImage",
      "friendRequestsFrom",
      "friends",
      "_id",
    ]);

    if (!users) {
      return res.json({
        status: false,
        msg: "error in search, try again",
      });
    }
    let resultSearch = users.filter(
      (user) => user.username.toLowerCase().indexOf(search.toLowerCase()) > -1
    );

    let resultSearchVerifyFriend = resultSearch.map((user) => {
      const userRequestFriend = userVerifyInRequest.friendRequestsFrom.find(
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

    if (resultSearchVerifyFriend) {
      return res.json({
        status: true,
        msg: "search complete",
        resultSearch: resultSearchVerifyFriend,
      });
    }
  } catch (e) {
    next(e);
  }
};
