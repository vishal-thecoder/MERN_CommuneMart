import express from "express";
import {
  createUser,
  loginUserCtrl,
  getAllUsers,
  getUser,
  deleteUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatedUser,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
} from "../controllers/userCtrl.js";

import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* ================= USER AUTH ================= */
router.post("/register", createUser);
router.post("/login", loginUserCtrl);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);

/* ================= USERS ================= */
router.get("/all-users", authMiddleware, isAdmin, getAllUsers);
router.get("/:id", authMiddleware, isAdmin, getUser);
router.delete("/:id", authMiddleware, isAdmin, deleteUser);

/* ================= USER ACTIONS ================= */
router.put("/update-password", authMiddleware, updatePassword);
router.put("/edit-user", authMiddleware, updatedUser);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);

/* ================= BLOCK / UNBLOCK ================= */
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

export default router;
