import express from "express";
import contactsController from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../schemas/contact.js";

import isValidID from "../helpers/isValidID.js";

const contactsRouter = express.Router();

contactsRouter.get("/", contactsController.getAllContacts);

contactsRouter.get("/:id", isValidID, contactsController.getOneContact);

contactsRouter.delete("/:id", isValidID, contactsController.deleteContact);

contactsRouter.post(
  "/",
  validateBody(createContactSchema),
  contactsController.createContact
);

contactsRouter.put(
  "/:id",
  isValidID,
  validateBody(updateContactSchema),
  contactsController.updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  isValidID,
  validateBody(updateFavoriteSchema),
  contactsController.updateFavorite
);

export default contactsRouter;
