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
    const email = profile.emails?.[0]?.value;
    const existingMember = await this.memberModel
      .findOne({ memberEmail: email })
      .exec();

    if (existingMember) {
      console.log("🔁 Logging in with existing email:", email);

      // Optional: Update Google-related info
      if (!existingMember.googleId) {
        existingMember.googleId = profile.id;
        existingMember.authProvider = AuthProvider.GOOGLE;
        existingMember.memberImages = profile.photos?.[0]?.value;
        await existingMember.save();
      }

      return existingMember.toJSON();
    }
    const created = await this.memberModel.create({
      memberNick: profile.displayName,
      memberEmail: email,
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
  }
}

export default GoogleAuthService;
