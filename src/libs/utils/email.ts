import MemberModel from "../../schema/Member.model";
import { mailSender } from "../types/common";
import { MemberType } from "../enums/member.enum";

export const sendResetPasswordEmail = async (
  email: string,
  nick: string,
  token: string
): Promise<void> => {
  // 🏃 lookup the member to check their type
  const member = await MemberModel.findOne({ memberEmail: email });

  const isAdmin = member?.memberType === MemberType.ADMIN;

  const resetLink = isAdmin
    ? `http://localhost:5001/admin/reset-password/${token}`
    : `http://localhost:3000/reset-password/${token}`;

  console.log("🛠️ sendResetPasswordEmail() sending link:", resetLink);

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
