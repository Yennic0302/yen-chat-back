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
      email: user.email,
      isAvatarImageSet: user.isAvatarImageSet,
    };

    return res.json({
      status: true,
      msg: "register completed",
      user: userResponse,
    });
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
      res.json({
        status: true,
        msg: "avartar set",
        avatarImage: req.body.image,
        isAvatarImageSet: true,
      });
    }

    res.json({
      status: false,
      msg: "error in set image, please try again",
    });
  } catch (e) {
    next(e);
  }
};
