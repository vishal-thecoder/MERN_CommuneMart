import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import Cart from "../models/cartModel.js";
import Coupon from "../models/couponModel.js";
import Order from "../models/orderModel.js";

import asyncHandler from "express-async-handler";
import { generateToken } from "../config/jwtToken.js";
import { generateRefreshToken } from "../config/refreshtoken.js";
import validateMongoDbId from "../utils/validateMongoDbId.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import sendEmail from "./emailCtrl.js";

/* ================= USER AUTH ================= */

export const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email });

  if (findUser) throw new Error("User Already Exists");

  const newUser = await User.create(req.body);
  res.json(newUser);
});

export const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email });

  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = generateRefreshToken(findUser._id);

    await User.findByIdAndUpdate(findUser._id, { refreshToken }, { new: true });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    res.json({
      user: {
        _id: findUser._id,
        firstname: findUser.firstname,
        lastname: findUser.lastname,
        email: findUser.email,
        mobile: findUser.mobile,
      },
      token: generateToken(findUser._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

/* ================= TOKEN HANDLING ================= */

export const handleRefreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) throw new Error("No Refresh Token In Cookies");

  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("No Refresh Token Found");

  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user._id.toString() !== decoded.id) {
      throw new Error("Token mismatch");
    }
    const accessToken = generateToken(user._id);
    res.json({ accessToken });
  });
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) return res.sendStatus(204);

  await User.findOneAndUpdate({ refreshToken }, { refreshToken: "" });

  res.clearCookie("refreshToken", { httpOnly: true });
  res.sendStatus(204);
});

/* ================= USER CRUD ================= */

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json(users);
});

export const getUser = asyncHandler(async (req, res) => {
  validateMongoDbId(req.params.id);
  const user = await User.findById(req.params.id);
  res.json(user);
});

export const deleteUser = asyncHandler(async (req, res) => {
  validateMongoDbId(req.params.id);
  const deletedUser = await User.findByIdAndDelete(req.params.id);
  res.json(deletedUser);
});

export const updatedUser = asyncHandler(async (req, res) => {
  validateMongoDbId(req.user._id);
  const user = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
  });
  res.json(user);
});

export const updatePassword = asyncHandler(async (req, res) => {
  validateMongoDbId(req.user._id);
  const user = await User.findById(req.user._id);
  user.password = req.body.password;
  await user.save();
  res.json(user);
});

/* ================= PASSWORD RESET ================= */

export const forgotPasswordToken = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) throw new Error("User not found");

  const token = await user.createPasswordResetToken();
  await user.save();

  const resetURL = `http://localhost:3000/reset-password/${token}`;

  await sendEmail({
    to: user.email,
    subject: "Password Reset Link",
    html: resetURL,
  });

  res.json(token);
});

export const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) throw new Error("Token expired or invalid");

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
  res.json(user);
});

/* ================= BLOCK / UNBLOCK ================= */

export const blockUser = asyncHandler(async (req, res) => {
  validateMongoDbId(req.params.id);
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isBlocked: true },
    { new: true }
  );
  res.json(user);
});

export const unblockUser = asyncHandler(async (req, res) => {
  validateMongoDbId(req.params.id);
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isBlocked: false },
    { new: true }
  );
  res.json(user);
});
