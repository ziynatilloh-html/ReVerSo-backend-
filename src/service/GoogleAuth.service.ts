import MemberModel from "../schema/Member.model";
import { Profile } from "passport-google-oauth20";
import Errors, { HttpCode, Message } from "../libs/types/Error";
import { Member } from "../libs/types/member";
import {
  AuthProvider,
  MemberStatus,
  MemberType,
} from "../libs/enums/member.enum";

class GoogleAuthService {
  private readonly memberModel;

  constructor() {
    this.memberModel = MemberModel;
  }

  public async signupWithGoogle(profile: Profile): Promise<Member> {
    try {
      const existingAdmin = await this.memberModel
        .findOne({ memberType: MemberType.ADMIN })
        .exec();
      if (existingAdmin) {
        console.log("Logging in with existing admin:", existingAdmin);
        return existingAdmin.toJSON();
      }
      const created = await this.memberModel.create({
        memberNick: profile.displayName,
        memberEmail: profile.emails?.[0]?.value,
        googleId: profile.id,
        memberType: MemberType.ADMIN,
        authProvider: AuthProvider.GOOGLE,
        memberImage: profile.photos?.[0]?.value,
        memberStatus: MemberStatus.ACTIVE,
        memberPhone: "null",
        memberPassword: "null",
        memberPoints: 0,
        memberDesc: "",
        memberAddress: "",
      });
      return created.toJSON();
    } catch (err: any) {
      throw new Errors(
        HttpCode.INTERNAL_SERVER_ERROR,
        err?.message || Message.CREATE_FAILED
      );
    }
  }
}

export default GoogleAuthService;
