import HttpError from "../helpers/HttpError.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import { Contact } from "../schemas/contact.js";

const getAllContacts = async (req, res) => {
  const owner = req.user.id;
  const { page = 1, limit = 10, favorite } = req.query;
  const skip = (page - 1) * limit;

  const ownerFilter = { owner };

  if (favorite !== undefined) {
    ownerFilter.favorite = favorite;
  }

  const result = await Contact.find(ownerFilter, "-createdAt -updatedAt")
    .skip(skip)
    .limit(limit);
  res.status(200).json(result);
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findById(id);

  if (!result) {
    throw HttpError(404);
  }

  res.status(200).json(result);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndDelete(id);

  if (!result) {
    throw HttpError(404);
  }

  res.status(200).json(result);
};

const createContact = async (req, res) => {
  const owner = req.user.id;

  const result = await Contact.create({ ...req.body, owner });

  res.status(201).json(result);
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  if (Object.keys(data).length === 0) {
    throw HttpError(400, "Body must have at least one field");
  }

  const result = await Contact.findByIdAndUpdate(id, data, { new: true });

  if (!result) {
    throw HttpError(404);
  }
  res.status(200).json(result);
};

const updateFavorite = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const result = await Contact.findByIdAndUpdate(id, data, { new: true });

  if (!result) {
    throw HttpError(404);
  }

  res.status(200).json(result);
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  deleteContact: ctrlWrapper(deleteContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  updateFavorite: ctrlWrapper(updateFavorite),
};
