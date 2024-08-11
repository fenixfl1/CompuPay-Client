import { ErrorCode, ErrorName } from "./types"

export interface ErrorMessages {
  code: ErrorCode
  error_code: string
  message: string
  title: string
  type: "success" | "warning" | "info" | "warning"
}

export const ERROR_MESSAGES: Record<ErrorName, ErrorMessages> = {
  UnexpectedError: {
    message:
      "Estamos experimentando un problema temporal. Por favor, vuelve a intentarlo más tarde.",
    error_code: "UNEXPECTED_ERROR",
    type: "warning",
    title: "Aviso",
    code: "BK001",
  },
  DataNotFound: {
    message: "No se encontraron datos.",
    error_code: "DATA_NOT_FOUND",
    type: "warning",
    title: "Aviso",
    code: "BK002",
  },
  PayloadValidationError: {
    message: "Por favor, verifica los datos ingresados e inténtalo nuevamente.",
    error_code: "PAYLOAD_VALIDATION_ERROR",
    type: "warning",
    title: "Aviso",
    code: "BK003",
  },
  DbUpdateError: {
    message:
      "La actualización de la información no se ha completado correctamente. Te recomendamos intentarlo de nuevo más tarde.",
    error_code: "DB_UPDATE_ERROR",
    type: "warning",
    title: "Aviso",
    code: "BK004",
  },
  DbInsertError: {
    message:
      "La inserción de la información no se ha completado correctamente. Te recomendamos intentarlo de nuevo más tarde.",
    error_code: "DB_INSERT_ERROR",
    type: "warning",
    title: "Aviso",
    code: "BK005",
  },
  EntityNotFound: {
    message:
      "La información que estás buscando no está disponible en estos momentos. Te sugerimos intentarlo de nuevo en otro momento.",
    error_code: "ENTITY_NOT_FOUND",
    type: "warning",
    title: "Aviso",
    code: "BK006",
  },
  E002: {
    message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    error_code: "EXPIRED_SESSION_E002",
    type: "warning",
    title: "Aviso",
    code: "BK007",
  },
  InternalError: {
    message:
      "Ha ocurrido un error inesperado. Por favor, intenta de nuevo más tarde.",
    error_code: "INTERNAL_ERROR",
    type: "warning",
    title: "Importante",
    code: "FT001",
  },
  RangeError: {
    message: "El valor ingresado es inválido.",
    error_code: "RANGE_ERROR",
    type: "warning",
    title: "Aviso",
    code: "FT002",
  },
  SyntaxError: {
    message: "Algo no ha ido como se esperaba. Por favor, intenta de nuevo.",
    error_code: "SYNTAX_ERROR",
    type: "warning",
    title: "Aviso",
    code: "FT003",
  },
  ReferenceError: {
    message:
      "No hemos podido procesar la referencia solicitada. Te sugerimos que lo intentes de nuevo más tarde.",
    error_code: "REFERENCE_ERROR",
    type: "warning",
    title: "Aviso",
    code: "FT004",
  },
  TypeError: {
    message:
      "Parece que algo no ha ido como se esperaba. Por favor, vuelve a intentarlo.",
    error_code: "TYPE_ERROR",
    type: "warning",
    title: "Aviso",
    code: "FT005",
  },
  ValidationError: {
    message: "Por favor, verifica los datos ingresados e inténtalo nuevamente.",
    error_code: "VALIDATION_ERROR",
    type: "warning",
    title: "Aviso",
    code: "FT006",
  },
}
