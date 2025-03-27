import { ObjectId } from "mongoose";
import { MemberStatus, MemberType } from "../enums/member.enum";
import { Request } from "express";
import { Session } from "express-session";

export interface Member {
  [x: string]: unknown;
  _id: ObjectId;
  memberType: MemberType;
  memberStatus: MemberStatus;
  memberNick: string;
  memberPhone: string;
  memberPassword?: string;
  memberAddress?: string;
  memberDesc?: string;
  memberImage?: string;
  memberPoints: number;
  memberEmail?: string;
  createdAt: Date;
  updatedAt: Date;
  authProvider?: "LOCAL" | "GOOGLE";
}

export interface MemberInput {
  memberType?: MemberType;
  memberStatus?: MemberStatus;
  memberNick: string;
  memberPhone: string;
  memberPassword: string;
  memberAddress?: string;
  memberDesc?: string;
  memberEmail?: string;
  memberImage?: string;
  memberPoints?: number;
  authProvider?: "LOCAL" | "GOOGLE";
}
export interface LoginInput {
  memberNick: string;
  memberPhone: string;
  memberEmail: string;
  memberPassword: string;
  authProvider?: "LOCAL" | "GOOGLE";
}

export interface AdminRequest extends Request {
  member: Member;
  session: Session & { member: Member };
}
