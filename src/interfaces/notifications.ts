import { User } from "./user"

export interface Notification {
  SENDER: Pick<User, "AVATAR" | "FULL_NAME" | "USERNAME">
  RECEIVER: Pick<User, "AVATAR" | "FULL_NAME" | "USERNAME">
  IS_READ: boolean
  MESSAGE: string
  CREATED_AT: string
}
