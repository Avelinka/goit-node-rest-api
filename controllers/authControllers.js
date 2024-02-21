import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import gravatar from "gravatar";
import Jimp from "jimp";
import path from "path";
import fs from "fs/promises";

import HttpError from "../helpers/HttpError.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import { User } from "../schemas/user.js";

dotenv.config();

const { SECRET_KEY } = process.env;
const avatarsDir = path.resolve("public", "avatars");

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user.id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

  await User.findByIdAndUpdate(user.id, { token });

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrentUser = async (req, res) => {
  const { subscription, email } = req.user;
  res.json({ email, subscription });
};

const logoutUser = async (req, res) => {
  const { id } = req.user.id;

  await User.findByIdAndUpdate(id, { token: "" });

  res.status(204).json();
};

const updateSubscription = async (req, res) => {
  const owner = req.user.id;
  const { subscription } = req.body;
  const result = await User.findByIdAndUpdate(
    owner,
    { subscription },
    { new: true }
  );

  if (!result) {
    throw HttpError(404);
  }

  res.json(result);
};

const updateAvatar = async (req, res) => {
  const owner = req.user.id;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${owner}_${originalname}`;

  const resultUpload = path.resolve(avatarsDir, filename);

  const normalAvatar = await Jimp.read(tempUpload);
  normalAvatar.resize(250, 250).write(tempUpload);

  await fs.rename(tempUpload, resultUpload);

  const avatarURL = path.join("avatars", filename);

  await User.findByIdAndUpdate(owner, { avatarURL });

  res.json({
    avatarURL,
  });
};

export default {
  registerUser: ctrlWrapper(registerUser),
  loginUser: ctrlWrapper(loginUser),
  getCurrentUser: ctrlWrapper(getCurrentUser),
  logoutUser: ctrlWrapper(logoutUser),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
