import "dotenv/config";
import nodemailer from "nodemailer";

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

if (!emailUser) {
  throw new Error("EMAIL_USER não definido no ambiente.");
}

if (!emailPass) {
  throw new Error("EMAIL_PASS não definido no ambiente.");
}

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});
