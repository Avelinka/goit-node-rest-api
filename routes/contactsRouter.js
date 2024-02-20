import express from "express";
import contactsController from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import isValidID from "../middlewares/isValidID.js";
import authenticate from "../middlewares/authenticate.js";

import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../schemas/contact.js";

const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, contactsController.getAllContacts);

contactsRouter.get(
  "/:id",
  authenticate,
  isValidID,
  contactsController.getOneContact
);

contactsRouter.delete(
  "/:id",
  authenticate,
  isValidID,
  contactsController.deleteContact
);

contactsRouter.post(
  "/",
  authenticate,
  validateBody(createContactSchema),
  contactsController.createContact
);

contactsRouter.put(
  "/:id",
  authenticate,
  isValidID,
  validateBody(updateContactSchema),
  contactsController.updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  authenticate,
  isValidID,
  validateBody(updateFavoriteSchema),
  contactsController.updateFavorite
);

export default contactsRouter;
