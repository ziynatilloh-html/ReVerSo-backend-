import { Member } from "../libs/types/member";

declare module "express-session" {
  interface SessionData {
    member?: Member;
  }
}
export default SessionData;
