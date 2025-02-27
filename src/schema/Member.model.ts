import mongoose, { Schema } from "mongoose";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";

const memberschema = new Schema(
  {
    membertype: {
      type: String,
      enum: MemberType,
      default: MemberType.MEMBER,
    },
    memberStatus: {
      type: String,
      enum: MemberStatus,
      default: MemberStatus.ACTIVE,
    },
    memberNick: {
      type: String,
      required: true,
      index: { unique: true, sparse: true },
    },
    memberPhone: {
      type: String,
      required: true,
      index: { unique: true, sparse: true },
    },
    memberPassword: {
      type: String,
      select: false,
      required: true,
    },
    memberAdress: {
      type: String,
    },
    memeberDescription: {
      type: String,
    },
    memberEmail: {
      type: String,
      required: false,
      index: { unique: true, sparse: true },
    },
    memberImage: {
      type: String,
    },
    memberPoints: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
export default mongoose.model("Member", memberschema);
