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
  public async signupWithGoogle(
    profile: Profile,
    role: "admin" | "member" = "member"
  ): Promise<Member> {
    const email = profile.emails?.[0]?.value;
    const existingMember = await this.memberModel
      .findOne({ memberEmail: email })
      .exec();

    if (existingMember) {
      console.log(`🔁 Logging in existing ${role}:`, email);
      // optionally update fields
      return existingMember.toJSON();
    }

    const created = await this.memberModel.create({
      memberNick: profile.displayName,
      memberEmail: email,
      googleId: profile.id,
      authProvider: AuthProvider.GOOGLE,
      memberType: role === "admin" ? MemberType.ADMIN : MemberType.MEMBER,
      memberStatus: MemberStatus.ACTIVE,
      memberImage: profile.photos?.[0]?.value,
      memberPhone: "null",
      memberPassword: "null",
      memberPoints: 0,
      memberDesc: "",
      memberAddress: "",
    });

    return created.toJSON();
  }
}

export default GoogleAuthService;
