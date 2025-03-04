import MemberModel from "../schema/Member.model";
import { MemberType } from "../libs/enums/member.enum";
import Errors, { HttpCode, Message } from "../libs/types/Error";
import { LoginInput, Member, MemberInput } from "../libs/types/member";
import * as bcrypt from "bcryptjs";

class MemberService {
  private readonly memberModel;

  constructor() {
    this.memberModel = MemberModel;
  }
  public async processSignup(input: MemberInput): Promise<Member> {
    const exist = await this.memberModel
      .findOne({ memberType: MemberType.ADMIN })
      .exec();
    if (exist) throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    const salt = await bcrypt.genSalt();
    input.memberPassword = await bcrypt.hash(input.memberPassword, salt);
    console.log("after input:", input);
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
    return await this.memberModel.findOne(member._id).exec();
  }
}
export default MemberService;
