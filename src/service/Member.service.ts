import MemberModel from "../schema/Member.model";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";
import Errors, { HttpCode, Message } from "../libs/types/Error";
import {
  LoginInput,
  Member,
  MemberInput,
  MemberUpdateInput,
  PasswordResetRequestInput,
} from "../libs/types/member";
import * as bcrypt from "bcryptjs";
import * as crypto from "crypto";
import { sendResetPasswordEmail } from "../libs/utils/email";
import { shapeIntoMongooseObjectId } from "../libs/types/config";

class MemberService {
  private readonly memberModel;

  constructor() {
    this.memberModel = MemberModel;
  }

  //======SPA======//

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
    const member = await this.memberModel
      .findOne(
        {
          $or: [
            { memberNick: input.memberNick },
            { memberPhone: input.memberPhone },
            { memberEmail: input.memberEmail },
          ],
          memberStatus: { $ne: MemberStatus.DELETED },
        },
        {
          memberNick: 1,
          memberPassword: 1,
          memberStatus: 1,
        }
      )
      .select("+memberPassword")
      .exec();

    if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_FOUND);
    else if (member.memberStatus === MemberStatus.BLOCKED) {
      throw new Errors(HttpCode.FORBIDDEN, Message.BLOCKED_USER);
    }

    const isMatch = await bcrypt.compare(
      input.memberPassword,
      member.memberPassword
    );

    if (!isMatch)
      throw new Errors(HttpCode.UNAUTHORIZED, Message.NO_MEMBER_FOUND);

    return await this.memberModel.findById(member._id).lean().exec();
  }

  //======SSR======//

  //===Authentication===//
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
    } catch (err) {
      console.error("processSignup Error:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }
  public async processLogin(input: LoginInput): Promise<Member> {
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
      throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
    return await this.memberModel.findById(member._id).exec();
  }
  //======Password Reset======//
  public async requestPassword(
    input: PasswordResetRequestInput
  ): Promise<{ message: string }> {
    const member = await this.memberModel.findOne({
      memberNick: input.memberNick,
    });

    if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_FOUND);

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const expires = Date.now() + 1000 * 60 * 30;

    member.passwordResetToken = hashedToken;
    member.passwordResetExpires = expires;

    await member.save();
    await sendResetPasswordEmail(member.memberEmail, member.memberNick, token);
    return { message: Message.RESET_LINK_SENT };
  }
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
  }
  //======Admin Panel======//
  public async updateAdminData(
    member: Member,
    input: MemberUpdateInput
  ): Promise<Member> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const result = await this.memberModel
      .findOneAndUpdate({ _id: memberId }, input, { new: true })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
    return result;
  }
  public async updateChosenMember(input: MemberUpdateInput): Promise<Member> {
    input._id = shapeIntoMongooseObjectId(input._id);
    const result = await this.memberModel
      .findByIdAndUpdate({ _id: input._id }, input, { new: true })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
    return result;
  }
  public async getUsers(): Promise<Member[]> {
    const result = await this.memberModel
      .find({ memberType: MemberType.MEMBER })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }
}
export default MemberService;
