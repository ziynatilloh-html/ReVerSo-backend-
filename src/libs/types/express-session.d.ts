import { Member } from "./member";

declare module "express-session" {
  interface SessionData {
    member?: Member;
  }
}
export default SessionData;
