import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const { META_EMAIL, META_PASSWORD } = process.env;

const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: META_EMAIL,
    pass: META_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const standartEmail = {
  to: "",
  from: META_EMAIL,
  subject: "",
  html: "",
};

const sendEmail = (data) => {
  const email = { ...standartEmail, ...data };
  return transport.sendMail(email);
};

export default sendEmail;
