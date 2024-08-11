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
