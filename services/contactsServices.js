import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("db", "contacts.json");

async function listContacts() {
  const data = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(data);
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  const contact = contacts.find((item) => item.id === contactId);
  return contact || null;
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const index = contacts.findIndex((item) => item.id === contactId);

  if (index === -1) return null;

  const [result] = contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return result;
}

async function addContact(data) {
  const contacts = await listContacts();
  const newContact = { id: nanoid(), ...data };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}

async function changeContact(id, data) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === id);

  if (index === -1) {
    return null;
  }

  contacts[index] = { ...contacts[index], ...data };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[index];
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  changeContact,
};
