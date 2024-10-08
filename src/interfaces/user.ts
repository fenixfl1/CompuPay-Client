interface SessionPayload {
  USER_ID: number
  USERNAME: string
  FULL_NAME: string
  ROLES: string[]
  AVATAR: string
  SESSION_COOKIE: {
    token: string
    expires: string
  }
}

interface LoginPayload {
  username: string
  password: string
}

interface Roles {
  ROL_ID: number
  NAME: string
  DESCRIPTION: string
  CREATED_AD?: string
  UPDATED_AD?: string
  STATE: string
  CREATED_BY?: string
  UPDATED_BY?: string
  OPERATIONS: number[]
  INIT_USER_STATE: string
  COLOR: string
}

interface MenuOption<T = unknown> {
  label: string
  key: string
  type?: "divider" | "group" | "item" | "submenu" | "link"
  icon?: string
  children?: MenuOption[]
  path: string
  title?: string
  parameters: T[]
  operations: number[]
  content: string
}

interface RolesUser {
  ID_ROL: number
  ID_USUARIO: number
  ID_TIPO_ROL: string
  ESTADO: string
}

interface RoleAccessPayload {
  ID_ROL: number
  ID_USUARIO: number
  OPCIONES: string[]
  PERMISOS: number[]
}

interface User {
  ADDRESS?: string
  AVATAR?: string
  BENEFITS?: string[]
  BIRTH_DATE?: string
  BIRTH_DAY: string
  CONTRACT_END?: string
  CREATED_AT: string
  CREATED_BY?: string
  CURRENCY: "RD" | "USD" | "EUR"
  DESC_GENDER?: string
  DOCUMENT_TYPE: "C" | "P"
  EMAIL: string
  FULL_NAME?: string
  GENDER: string
  GROSS_SALARY?: number
  HIRED_DATE?: string
  IDENTITY_DOCUMENT: string
  IS_ACTIVE: boolean
  IS_STAFF: boolean
  IS_SUPERUSER: boolean
  LAST_NAME: string
  NAME: string
  NAME_SUPERVISOR?: string
  NET_SALARY?: number
  PASSWORD: string
  PHONE?: string
  RESUME?: string
  ROLES: Roles[]
  SALARY?: number
  STATE: string
  SUPERVISOR?: string
  TAX?: number
  UPDATED_AT?: string
  UPDATED_BY?: string
  USERNAME: string
  USER_ID: number
}

interface Department {
  DEPARTMENT_ID: number
  STATE: string
  CREATED_AT: string
  UPDATED_AT?: string
  NAME: string
  DESCRIPTION: string
  CREATED_BY: string
  UPDATED_BY?: string
}

export type {
  SessionPayload,
  LoginPayload,
  MenuOption,
  Roles,
  RolesUser,
  RoleAccessPayload,
  User,
  Department,
}
