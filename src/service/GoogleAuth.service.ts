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
        throw new Errors(HttpCode.BAD_REQUEST, Message.EXISTING_MEMBERNICK);
      }

      const existingGoogleUser = await this.memberModel
        .findOne({ googleId: profile.id })
        .exec();
      if (existingGoogleUser) {
        return existingGoogleUser.toJSON();
      }

      const created = await this.memberModel.create({
        memberNick: profile.displayName || "google_admin",
        memberEmail: profile.emails?.[0]?.value,
        googleId: profile.id,
        memberType: MemberType.ADMIN,
        authProvider: AuthProvider.GOOGLE,
        memberStatus: MemberStatus.ACTIVE,
        memberPhone: "000-0000-0000",
        memberPassword: "GOOGLE_AUTH",
        memberPoints: 0,
        memberDesc: "",
        memberAddress: "",
      });
      return created.toJSON();
    } catch (err) {
      throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILED);
    }
  }
}

export default GoogleAuthService;
