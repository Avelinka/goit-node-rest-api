import express from "express";

import authController from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

import {
  registerSchema,
  emailSchema,
  loginSchema,
  subscriptionShema,
} from "../schemas/user.js";

const authRrouter = express.Router();

authRrouter.post(
  "/register",
  validateBody(registerSchema),
  authController.registerUser
);

authRrouter.get("/verify/:verificationToken", authController.verefyEmail);

authRrouter.post(
  "/verify",
  validateBody(emailSchema),
  authController.resendVerifyEmail
);

authRrouter.post("/login", validateBody(loginSchema), authController.loginUser);

authRrouter.get("/current", authenticate, authController.getCurrentUser);

authRrouter.post("/logout", authenticate, authController.logoutUser);

authRrouter.patch(
  "/",
  authenticate,
  validateBody(subscriptionShema),
  authController.updateSubscription
);

authRrouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  authController.updateAvatar
);

export default authRrouter;
