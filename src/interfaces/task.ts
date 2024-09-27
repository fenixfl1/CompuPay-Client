import { User } from "./user"

export interface Task {
  TASK_ID: number
  STATE: "A" | "I"
  CREATED_AT?: string
  UPDATED_AT?: string
  NAME: string
  DESCRIPTION: string
  PRIORITY?: string
  START_DATE?: string
  END_DATE?: string
  CREATED_BY: string
  UPDATED_BY?: string
  TAGS: Tag[]
  ASSIGNED_USERS: Pick<User, "AVATAR" | "FULL_NAME" | "USERNAME">[]
  COMPLETED: boolean
}

export interface Tag {
  COLOR: string
  CREATED_AT?: string
  CREATED_BY: string
  DESCRIPTION: string
  NAME: string
  STATE: "A" | "I"
  TAG_ID: number
  UPDATED_AT?: string
  UPDATED_BY?: string
}
