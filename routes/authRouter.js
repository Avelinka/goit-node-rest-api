import express from "express";
import authController from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import authenticate from "../middlewares/authenticate.js";

import {
  registerSchema,
  loginSchema,
  subscriptionShema,
} from "../schemas/user.js";

const authRrouter = express.Router();

authRrouter.post(
  "/register",
  validateBody(registerSchema),
  authController.registerUser
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

export default authRrouter;
