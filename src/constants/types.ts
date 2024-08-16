import { Mask } from "react-text-mask"

export type Theme = "light" | "dark"

export type AnyType = any

export type TriggersType = {
  onBlur?: unknown
  onChange?: unknown
  onClick?: unknown
  onFinish?: unknown
  onFocus?: unknown
  onPress?: unknown
  onPressEnter?: unknown
  onReset?: unknown
  onSearch?: unknown
  onSelect?: unknown
  onSubmit?: unknown
  onTab?: unknown
}

export type ErrorName =
  | "UnexpectedError"
  | "DataNotFound"
  | "PayloadValidationError"
  | "DbUpdateError"
  | "DbInsertError"
  | "EntityNotFound"
  | "E002"
  | "InternalError"
  | "RangeError"
  | "ReferenceError"
  | "SyntaxError"
  | "TypeError"
  | "ValidationError"

export type ErrorCode =
  | "BK001"
  | "BK002"
  | "BK003"
  | "BK004"
  | "BK005"
  | "BK006"
  | "BK007"
  | "FT001"
  | "FT002"
  | "FT003"
  | "FT004"
  | "FT005"
  | "FT006"

export type MaskType = {
  pasaporte: Mask
  cedula: Mask
  telefono: Mask
  telefono_internacional: Mask
  phone_format: Mask
  extension: Mask
  rnc: Mask
  meses: Mask
  email: Mask
  complete_phone: Mask
  date: Mask
  id_cuenta: Mask
  cedula_rnc?: Mask
}
