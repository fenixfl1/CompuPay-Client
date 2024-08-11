import { customNotification } from "@/components/custom/customNotification"
import { ERROR_MESSAGES, ErrorMessages } from "@/constants/messages"
import { assert } from "./assert"
import { ErrorName } from "@/constants/types"
import { ErrorResponse } from "@/services/interfaces"

/**
 * This function is used to handle the error response from the server or the client
 * @param { any } error the error response
 * @param {boolean} useServerMessage use to indicate if the error message should be the one from the server or not
 */
function errorHandler(error: any, useServerMessage = true): void {
  let ERROR_CODE: string
  let alert_msg: string

  assert<ErrorResponse & { errorFields?: any }>(error)

  if (error?.errorFields) {
    useServerMessage = true
    error.message = error.errorFields
      .map(
        (item: any) => `<strong style="color: red" >»</strong> ${item.errors}`
      )
      .join("<br/>")
    error.code = "FT006"
    error.name = "ValidationError"
  }

  const {
    error: name,
    errorCode,
    message: serverMessage,
  } = error.response?.data || {}

  const { message, type, error_code, title, code } =
    ERROR_MESSAGES[
      (name ?? error.name) as keyof Record<ErrorName, ErrorMessages>
    ] || {}

  const errorMessage = useServerMessage ? serverMessage : message

  if (error.name !== "AxiosError") {
    ERROR_CODE = error.code as string
    alert_msg =
      error.code === "FT006"
        ? error.message
        : ERROR_MESSAGES[error.name as ErrorName]?.message
  } else {
    ERROR_CODE = errorCode ? `${error_code}_${errorCode}` : error_code
    alert_msg = errorMessage as string
  }

  // eslint-disable-next-line no-console
  console.error({ error })

  const description = `
    ${alert_msg}
    <br />
    <br /> 
    <strong>Código: <code>${code}</code></strong> 
  `

  customNotification({
    description,
    title,
    type,
  } as never)
}

export default errorHandler
