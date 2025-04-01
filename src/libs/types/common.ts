export interface T {
  [key: string]: any;
}

import nodemailer from "nodemailer";

export const mailSender = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});
