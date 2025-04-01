import MemberModel from "../schema/Member.model";
import { MemberType } from "../libs/enums/member.enum";
import Errors, { HttpCode, Message } from "../libs/types/Error";
import {
  LoginInput,
  Member,
  MemberInput,
  PasswordResetInput,
  PasswordResetRequestInput,
} from "../libs/types/member";
import * as bcrypt from "bcryptjs";
import * as crypto from "crypto";
import { mailSender } from "../libs/types/common";

class MemberService {
  private readonly memberModel;

  constructor() {
    this.memberModel = MemberModel;
  }
  public async signup(input: MemberInput): Promise<Member> {
    const salt = await bcrypt.genSalt();
    input.memberPassword = await bcrypt.hash(input.memberPassword, salt);
    try {
      const result = await this.memberModel.create(input);
      result.memberPassword = "";
      return result.toJSON();
    } catch (err) {
      console.error("Error, model:signup", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.USED_NICK_PHONE);
    }
  }
  public async login(input: LoginInput): Promise<Member> {
    // TODO: Consider member status later

    const member = await this.memberModel
      .findOne({
        $or: [
          { memberNick: input.memberNick },
          { memberPhone: input.memberPhone },
          { memberEmail: input.memberEmail },
        ],
      })
      .select("+memberPassword")
      .exec();
    if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_FOUND);
    const isMatch = await bcrypt.compare(
      input.memberPassword,
      member.memberPassword
    );
    if (!isMatch)
      throw new Errors(HttpCode.UNAUTHORIZED, Message.NO_MEMBER_FOUND);
    return await this.memberModel.findById(member._id).lean().exec();
  }
  /* SSR*/
  public async processSignup(input: MemberInput): Promise<Member> {
    const exist = await this.memberModel
      .findOne({ memberType: MemberType.ADMIN })
      .exec();
    if (exist)
      throw new Errors(HttpCode.BAD_REQUEST, Message.EXISTING_MEMBERNICK);
    const salt = await bcrypt.genSalt();
    input.memberPassword = await bcrypt.hash(input.memberPassword, salt);
    try {
      const result = await this.memberModel.create(input);
      result.memberPassword = "";
      return result;
    } catch (error: any) {
      console.error("processSignup Error:", error);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }
  public async processLogin(input: LoginInput): Promise<Member> {
    console.log("Login input:", input);
    const member = await this.memberModel
      .findOne({
        $or: [
          { memberNick: input.memberNick },
          { memberPhone: input.memberPhone },
          { memberEmail: input.memberEmail },
        ],
      })
      .select("+memberPassword")
      .exec();
    console.log("member", member);
    if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_FOUND);
    const isMatch = await bcrypt.compare(
      input.memberPassword,
      member.memberPassword
    );
    console.log("member", member);
    if (!isMatch)
      throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
    return await this.memberModel.findOne(member._id).exec();
  }
  public async requestPassword(
    input: PasswordResetRequestInput
  ): Promise<void> {
    const member = await this.memberModel.findOne({
      $or: [
        { memberNick: input.memberNick },
        { memberPhone: input.memberPhone },
        { memberEmail: input.memberEmail },
      ],
    });

    if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_FOUND);

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const expires = Date.now() + 1000 * 60 * 30; // 30 min

    member.passwordResetToken = hashedToken;
    member.passwordResetExpires = expires;

    await member.save();
    console.log("📧 Sending email to:", member.memberEmail);
    const resetLink = `http://localhost:3007/admin/reset-password/${token}`;
    console.log("resetLink", resetLink);
    await mailSender.sendMail({
      to: member.memberEmail,
      subject: "Password Reset Request",
      html: `
      <p>Hi ${member.memberNick},</p>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link will expire in 30 minutes.</p>
    `,
    });
  }

  // RESET PASSWORD
  public async resetPassword(
    token: string,
    newPassword: string
  ): Promise<void> {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const member = await this.memberModel.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!member) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.INVALID_OR_EXPIRED_TOKEN);
    }

    member.memberPassword = await bcrypt.hash(newPassword, 10);
    member.passwordResetToken = undefined;
    member.passwordResetExpires = undefined;

    await member.save();
    console.log("✅ Password reset successful for:", member.memberNick);
  }
}
export default MemberService;
