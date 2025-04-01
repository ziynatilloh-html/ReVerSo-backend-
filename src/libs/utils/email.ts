import { mailSender } from "../types/common";

export const sendResetPasswordEmail = async (
  email: string,
  nick: string,
  token: string
): Promise<void> => {
  const resetLink = `http://localhost:3007/admin/reset-password/${token}`;

  await mailSender.sendMail({
    to: email,
    subject: "Password Reset Request",
    html: `
      <p>Hi ${nick},</p>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link will expire in 30 minutes.</p>
    `,
  });

  console.log("📧 Sent reset link to:", email);
};
